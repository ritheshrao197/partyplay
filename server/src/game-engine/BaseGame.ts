import type { TypedIO } from '../socket/index.js';
import type { GameActionData, ScoreEntry, PlayerState, GameType } from '../types/index.js';
import * as playerModel from '../models/player.js';
import * as matchModel from '../models/match.js';
import * as roomModel from '../models/room.js';
import { addXp } from '../models/user.js';

export interface GamePlayer {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  isConnected: boolean;
}

export abstract class BaseGame {
  protected roomCode: string;
  protected roomId: string;
  protected io: TypedIO;
  protected players: GamePlayer[] = [];
  protected currentRound = 0;
  protected totalRounds: number;
  protected timerHandle: ReturnType<typeof setInterval> | null = null;
  protected phaseTimer: ReturnType<typeof setTimeout> | null = null;
  protected matchId: string | null = null;
  protected isRunning = false;

  constructor(roomCode: string, roomId: string, io: TypedIO, totalRounds: number) {
    this.roomCode = roomCode;
    this.roomId = roomId;
    this.io = io;
    this.totalRounds = totalRounds;
  }

  async init(playerStates: PlayerState[]): Promise<void> {
    this.players = playerStates.map((p) => ({
      userId: p.userId,
      username: p.username,
      avatar: p.avatar,
      score: 0,
      isConnected: true,
    }));

    const match = await matchModel.createMatch(this.roomId, await this.getGameType());
    this.matchId = match.id;
    this.isRunning = true;
  }

  abstract getGameType(): GameType;
  abstract start(): Promise<void>;
  abstract handleAction(userId: string, action: GameActionData): Promise<void>;
  abstract cleanup(): void;

  protected emit(event: string, data: unknown): void {
    this.io.to(this.roomCode).emit(event as any, data as any);
  }

  protected broadcastScores(): void {
    const scores: ScoreEntry[] = this.players
      .map((p) => ({
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
        score: p.score,
      }))
      .sort((a, b) => b.score - a.score);

    this.emit('game:scores', scores);
  }

  protected startTimer(seconds: number, phase: string): Promise<void> {
    return new Promise((resolve) => {
      let remaining = seconds;
      this.emit('game:timer', { seconds: remaining, phase });

      this.timerHandle = setInterval(() => {
        remaining--;
        this.emit('game:timer', { seconds: remaining, phase });

        if (remaining <= 0) {
          this.clearTimer();
          resolve();
        }
      }, 1000);
    });
  }

  protected clearTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  protected setPhaseTimeout(fn: () => void, ms: number): void {
    this.clearPhaseTimeout();
    this.phaseTimer = setTimeout(fn, ms);
  }

  protected clearPhaseTimeout(): void {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
  }

  protected addScore(userId: string, points: number): void {
    const player = this.players.find((p) => p.userId === userId);
    if (player) player.score += points;
  }

  protected async endGame(): Promise<void> {
    this.isRunning = false;
    this.clearTimer();
    this.clearPhaseTimeout();

    // Find winner
    const sorted = [...this.players].sort((a, b) => b.score - a.score);
    const winner = sorted[0];

    // Persist scores
    for (const p of this.players) {
      await playerModel.updatePlayerScore(this.roomId, p.userId, p.score);
      await addXp(p.userId, Math.max(10, p.score));
    }

    // End match
    if (this.matchId) {
      await matchModel.endMatch(this.matchId, winner?.userId || null, this.currentRound);
    }

    // Update room status
    await roomModel.updateRoomStatus(this.roomId, 'finished');

    const scores: ScoreEntry[] = sorted.map((p) => ({
      userId: p.userId,
      username: p.username,
      avatar: p.avatar,
      score: p.score,
    }));

    this.emit('game:ended', {
      winnerId: winner?.userId || '',
      winnerUsername: winner?.username || 'Unknown',
      scores,
    });
  }

  public async forceEndGame(): Promise<void> {
    if (this.isRunning) {
      await this.endGame();
    }
  }

  protected getPlayer(userId: string): GamePlayer | undefined {
    return this.players.find((p) => p.userId === userId);
  }
}
