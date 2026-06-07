import { BaseGame } from '../BaseGame.js';
import type { GameActionData, GameType } from '../../types/index.js';
import { getRandomCategory } from './categories.js';

export class WordRushGame extends BaseGame {
  private currentCategory = '';
  private validWords: string[] = [];
  private submittedAnswers = new Map<string, Set<string>>(); // userId -> Set<answer>
  private allSubmitted = new Set<string>(); // All unique answers this round
  private typingPhaseTime = 30;
  private comboCount = new Map<string, number>();

  constructor(roomCode: string, roomId: string, io: any) {
    super(roomCode, roomId, io, 5); // 5 rounds
  }

  getGameType(): GameType {
    return 'wordrush';
  }

  async start(): Promise<void> {
    this.currentRound = 0;
    await this.nextRound();
  }

  private async nextRound(): Promise<void> {
    this.currentRound++;
    this.submittedAnswers.clear();
    this.allSubmitted.clear();
    this.comboCount.clear();

    // Pick category
    const cat = getRandomCategory();
    this.currentCategory = cat.name;
    this.validWords = cat.words.map((w) => w.toLowerCase());

    // Countdown phase (3s)
    this.emit('game:phase', {
      phase: 'countdown',
      duration: 3,
      data: { category: this.currentCategory },
    });

    await this.startTimer(3, 'countdown');

    // Typing phase (30s)
    this.emit('game:phase', {
      phase: 'typing',
      duration: this.typingPhaseTime,
      data: { category: this.currentCategory },
    });

    await this.startTimer(this.typingPhaseTime, 'typing');

    // Scoring phase
    await this.scoreRound();
  }

  private async scoreRound(): Promise<void> {
    // Calculate scores for each player
    const roundScores: Record<string, { points: number; uniqueCount: number; duplicates: string[] }> = {};

    for (const player of this.players) {
      const answers = this.submittedAnswers.get(player.userId);
      if (!answers || answers.size === 0) {
        roundScores[player.userId] = { points: 0, uniqueCount: 0, duplicates: [] };
        continue;
      }

      let points = 0;
      let uniqueCount = 0;
      const duplicates: string[] = [];

      for (const answer of answers) {
        // Check if answer is unique (only this player submitted it)
        let isUnique = true;
        for (const [otherUserId, otherAnswers] of this.submittedAnswers) {
          if (otherUserId !== player.userId && otherAnswers.has(answer)) {
            isUnique = false;
            break;
          }
        }

        if (isUnique) {
          points += 10;
          uniqueCount++;
        } else {
          points += 3; // Partial credit for duplicate valid answers
          duplicates.push(answer);
        }
      }

      // Combo bonus
      if (uniqueCount >= 3) points += 5;
      if (uniqueCount >= 5) points += 10;

      roundScores[player.userId] = { points, uniqueCount, duplicates };
      this.addScore(player.userId, points);
    }

    this.emit('game:phase', {
      phase: 'scoring',
      duration: 8,
      data: {
        category: this.currentCategory,
        validWords: this.validWords,
        roundScores,
        allAnswers: Object.fromEntries(
          Array.from(this.submittedAnswers.entries()).map(([uid, set]) => [uid, Array.from(set)])
        ),
      },
    });

    this.broadcastScores();
    await this.startTimer(8, 'scoring');

    // Next round or end
    if (this.currentRound < this.totalRounds) {
      await this.nextRound();
    } else {
      await this.endGame();
    }
  }

  async handleAction(userId: string, action: GameActionData): Promise<void> {
    if (action.type !== 'submit-answer') return;

    const answer = (action.payload?.answer as string || '').trim().toLowerCase();
    if (!answer) return;

    // Validate answer
    if (!this.validWords.includes(answer)) return;

    // Check duplicate for this player
    if (!this.submittedAnswers.has(userId)) {
      this.submittedAnswers.set(userId, new Set());
    }
    const playerAnswers = this.submittedAnswers.get(userId)!;
    if (playerAnswers.has(answer)) return;

    playerAnswers.add(answer);
    this.allSubmitted.add(answer);

    // Speed bonus: first answers get more points
    const speedBonus = Math.max(0, Math.floor((this.typingPhaseTime - (this.allSubmitted.size * 0.5)) * 0.5));

    // Broadcast real-time feedback
    const player = this.getPlayer(userId);
    this.emit('game:state', {
      phase: 'typing',
      round: this.currentRound,
      totalRounds: this.totalRounds,
      data: {
        newAnswer: {
          userId,
          username: player?.username,
          answer,
          points: 10 + speedBonus,
        },
        totalAnswers: this.allSubmitted.size,
      },
    });
  }

  cleanup(): void {
    this.clearTimer();
    this.clearPhaseTimeout();
  }
}
