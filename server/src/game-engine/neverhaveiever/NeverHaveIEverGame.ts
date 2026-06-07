import { BaseGame } from '../BaseGame.js';
import type { GameActionData, GameType } from '../../types/index.js';
import { getRandomQuestionFromAll } from './questions.js';

export class NeverHaveIEverGame extends BaseGame {
  private answers = new Map<string, boolean>(); // userId -> hasDoneIt
  private currentQuestion = '';
  private currentPack = '';
  private usedQuestions = new Set<string>();

  constructor(roomCode: string, roomId: string, io: any) {
    super(roomCode, roomId, io, 10); // 10 rounds
  }

  getGameType(): GameType {
    return 'neverhaveiever';
  }

  async start(): Promise<void> {
    this.currentRound = 0;
    await this.nextRound();
  }

  private async nextRound(): Promise<void> {
    this.currentRound++;
    this.answers.clear();

    // Pick question (avoid repeats)
    let q = getRandomQuestionFromAll();
    let attempts = 0;
    while (this.usedQuestions.has(q.question) && attempts < 20) {
      q = getRandomQuestionFromAll();
      attempts++;
    }
    this.currentQuestion = q.question;
    this.currentPack = q.pack;
    this.usedQuestions.add(q.question);

    // Question phase (5s to read)
    this.emit('game:phase', {
      phase: 'question',
      duration: 5,
      data: { question: this.currentQuestion, pack: this.currentPack },
    });

    await this.startTimer(5, 'question');

    // Answer phase (10s, anonymous)
    this.emit('game:phase', {
      phase: 'answer',
      duration: 10,
      data: { question: this.currentQuestion },
    });

    await this.startTimer(10, 'answer');

    // Reveal phase
    await this.revealResults();
  }

  private async revealResults(): Promise<void> {
    const totalPlayers = this.players.length;
    const yesCount = Array.from(this.answers.values()).filter((v) => v).length;
    const noCount = totalPlayers - yesCount;
    const percentage = totalPlayers > 0 ? Math.round((yesCount / totalPlayers) * 100) : 0;

    // Score: Players who answered get 5 points each
    for (const [userId] of this.answers) {
      this.addScore(userId, 5);
    }

    // Bonus: If minority (< 30% or > 70%), those in minority get bonus
    if (percentage < 30 && yesCount > 0) {
      for (const [userId, answered] of this.answers) {
        if (answered) this.addScore(userId, 10); // Minority bonus
      }
    } else if (percentage > 70 && noCount > 0) {
      for (const [userId, answered] of this.answers) {
        if (!answered) this.addScore(userId, 10); // Minority bonus
      }
    }

    this.emit('game:phase', {
      phase: 'reveal',
      duration: 8,
      data: {
        question: this.currentQuestion,
        pack: this.currentPack,
        yesCount,
        noCount,
        totalPlayers,
        percentage,
        funFact: this.generateFunFact(yesCount, noCount, totalPlayers),
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

  private generateFunFact(yes: number, no: number, total: number): string {
    const pct = Math.round((yes / total) * 100);
    if (pct === 0) return 'Nobody has done this! You all live clean lives.';
    if (pct === 100) return `All ${total} players have done this! Wild group!`;
    if (pct <= 20) return `Only ${yes} out of ${total} -- the rest of you are playing it safe!`;
    if (pct >= 80) return `${yes} out of ${total} -- this group is experienced!`;
    if (pct === 50) return `Exactly half! The group is perfectly split.`;
    return `${yes} out of ${total} players (${pct}%) have done this.`;
  }

  async handleAction(userId: string, action: GameActionData): Promise<void> {
    if (action.type === 'answer') {
      const hasDoneIt = action.payload?.hasDoneIt as boolean;
      if (typeof hasDoneIt !== 'boolean') return;
      this.answers.set(userId, hasDoneIt);

      // Send anonymous count update (don't reveal who answered)
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
  }

  cleanup(): void {
    this.clearTimer();
    this.clearPhaseTimeout();
  }
}
