import { BaseGame } from '../BaseGame.js';
import type { GameActionData, GameType } from '../../types/index.js';
import { getRandomPrompt } from './prompts.js';

interface AnswerEntry {
  userId: string;
  username: string;
  answer: string;
}

export class WrongAnswersGame extends BaseGame {
  private currentPrompt = '';
  private answers = new Map<string, string>(); // userId -> answer
  private votes = new Map<string, string>(); // voterId -> targetUserId (whose answer they vote for)
  private usedPrompts = new Set<string>();
  private shuffledAnswers: AnswerEntry[] = [];

  constructor(roomCode: string, roomId: string, io: any) {
    super(roomCode, roomId, io, 8); // 8 rounds
  }

  getGameType(): GameType {
    return 'wronganswers';
  }

  async start(): Promise<void> {
    this.currentRound = 0;
    await this.nextRound();
  }

  private async nextRound(): Promise<void> {
    this.currentRound++;
    this.answers.clear();
    this.votes.clear();
    this.shuffledAnswers = [];

    // Pick prompt (avoid repeats)
    let prompt = getRandomPrompt();
    let attempts = 0;
    while (this.usedPrompts.has(prompt) && attempts < 20) {
      prompt = getRandomPrompt();
      attempts++;
    }
    this.currentPrompt = prompt;
    this.usedPrompts.add(prompt);

    // Question phase (5s to read)
    this.emit('game:phase', {
      phase: 'question',
      duration: 5,
      data: { prompt: this.currentPrompt },
    });

    await this.startTimer(5, 'question');

    // Answer phase (20s)
    this.emit('game:phase', {
      phase: 'answer',
      duration: 20,
      data: { prompt: this.currentPrompt },
    });

    await this.startTimer(20, 'answer');

    // Shuffle answers and start voting
    await this.startVoting();
  }

  private async startVoting(): Promise<void> {
    // Create shuffled anonymous answers
    this.shuffledAnswers = Array.from(this.answers.entries()).map(([userId, answer]) => {
      const player = this.getPlayer(userId);
      return { userId, username: player?.username || 'Anonymous', answer };
    });

    // Shuffle
    for (let i = this.shuffledAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledAnswers[i], this.shuffledAnswers[j]] = [this.shuffledAnswers[j], this.shuffledAnswers[i]];
    }

    this.emit('game:phase', {
      phase: 'voting',
      duration: 15,
      data: {
        prompt: this.currentPrompt,
        answers: this.shuffledAnswers.map((a, idx) => ({
          index: idx,
          answer: a.answer,
          // Don't reveal userId during voting - keep anonymous
        })),
      },
    });

    await this.startTimer(15, 'voting');
    await this.tallyVotes();
  }

  private async tallyVotes(): Promise<void> {
    // Count votes per answer author
    const voteCounts = new Map<string, number>(); // targetUserId -> voteCount

    for (const [voterId, targetUserId] of this.votes) {
      if (voterId === targetUserId) continue; // Can't vote for yourself
      voteCounts.set(targetUserId, (voteCounts.get(targetUserId) || 0) + 1);
    }

    // Award points based on votes
    for (const [userId, count] of voteCounts) {
      this.addScore(userId, count * 10);
    }

    // Reveal results
    const results = this.shuffledAnswers.map((entry, idx) => ({
      index: idx,
      answer: entry.answer,
      userId: entry.userId,
      username: entry.username,
      votes: voteCounts.get(entry.userId) || 0,
    })).sort((a, b) => b.votes - a.votes);

    this.emit('game:phase', {
      phase: 'reveal',
      duration: 8,
      data: {
        prompt: this.currentPrompt,
        results,
        roundScores: Object.fromEntries(voteCounts),
      },
    });

    this.broadcastScores();
    await this.startTimer(8, 'reveal');

    if (this.currentRound < this.totalRounds) {
      await this.nextRound();
    } else {
      await this.endGame();
    }
  }

  async handleAction(userId: string, action: GameActionData): Promise<void> {
    if (action.type === 'submit-answer') {
      const answer = (action.payload?.answer as string || '').trim();
      if (!answer || answer.length > 200) return;
      this.answers.set(userId, answer);

      this.emit('game:state', {
        phase: 'answer',
        round: this.currentRound,
        totalRounds: this.totalRounds,
        data: {
          answersReceived: this.answers.size,
          totalPlayers: this.players.length,
        },
      });
    }

    if (action.type === 'vote') {
      const targetIndex = action.payload?.answerIndex as number;
      if (typeof targetIndex !== 'number' || targetIndex < 0 || targetIndex >= this.shuffledAnswers.length) return;

      const target = this.shuffledAnswers[targetIndex];
      if (target.userId === userId) return; // Can't vote for yourself

      this.votes.set(userId, target.userId);
    }
  }

  cleanup(): void {
    this.clearTimer();
    this.clearPhaseTimeout();
  }
}
