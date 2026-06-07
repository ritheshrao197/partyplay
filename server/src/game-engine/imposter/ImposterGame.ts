import { BaseGame } from '../BaseGame.js';
import type { GameActionData, GameType } from '../../types/index.js';
import { getRandomWordPair } from './words.js';

type Phase = 'word-reveal' | 'discussion' | 'voting' | 'reveal';

export class ImposterGame extends BaseGame {
  private imposterId = '';
  private crewWord = '';
  private imposterWord = '';
  private phase: Phase = 'word-reveal';
  private votes = new Map<string, string>(); // voterId -> targetId
  private eliminated = new Set<string>();

  constructor(roomCode: string, roomId: string, io: any) {
    super(roomCode, roomId, io, 3); // 3 rounds
  }

  getGameType(): GameType {
    return 'imposter';
  }

  async start(): Promise<void> {
    this.currentRound = 1;
    await this.startRound();
  }

  private async startRound(): Promise<void> {
    this.votes.clear();

    // Pick word pair
    const pair = getRandomWordPair();
    this.crewWord = pair.crewWord;
    this.imposterWord = pair.imposterWord;

    // Pick random imposter
    const activePlayers = this.players.filter((p) => !this.eliminated.has(p.userId));
    const imposterIndex = Math.floor(Math.random() * activePlayers.length);
    this.imposterId = activePlayers[imposterIndex].userId;

    // Phase: Word Reveal (5 seconds)
    this.phase = 'word-reveal';
    this.emit('game:state', {
      phase: 'word-reveal',
      round: this.currentRound,
      totalRounds: this.totalRounds,
      data: {
        // Each player gets their own word via individual emit
        players: this.players.map((p) => ({
          userId: p.userId,
          username: p.username,
          isEliminated: this.eliminated.has(p.userId),
        })),
      },
    });

    // Send individual words
    for (const player of this.players) {
      if (this.eliminated.has(player.userId)) continue;
      const word = player.userId === this.imposterId ? this.imposterWord : this.crewWord;
      const isImposter = player.userId === this.imposterId;

      // Emit to specific player's socket in the room
      this.io.to(this.roomCode).emit('game:phase', {
        phase: 'word-reveal',
        duration: 5,
        data: {
          word,
          isImposter,
          playerUserId: player.userId, // Client filters by own userId
        },
      });
    }

    await this.startTimer(5, 'word-reveal');
    await this.startDiscussion();
  }

  private async startDiscussion(): Promise<void> {
    this.phase = 'discussion';
    this.emit('game:phase', {
      phase: 'discussion',
      duration: 60,
      data: { crewCount: this.players.length - this.eliminated.size - 1 },
    });

    await this.startTimer(60, 'discussion');
    await this.startVoting();
  }

  private async startVoting(): Promise<void> {
    this.phase = 'voting';
    this.votes.clear();

    this.emit('game:phase', {
      phase: 'voting',
      duration: 30,
      data: {
        eligiblePlayers: this.players
          .filter((p) => !this.eliminated.has(p.userId))
          .map((p) => ({ userId: p.userId, username: p.username, avatar: p.avatar })),
      },
    });

    await this.startTimer(30, 'voting');
    await this.tallyVotes();
  }

  private async tallyVotes(): Promise<void> {
    // Count votes
    const voteCount = new Map<string, number>();
    for (const targetId of this.votes.values()) {
      voteCount.set(targetId, (voteCount.get(targetId) || 0) + 1);
    }

    // Find most voted
    let maxVotes = 0;
    let eliminatedId = '';
    for (const [userId, count] of voteCount) {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedId = userId;
      }
    }

    if (eliminatedId) {
      this.eliminated.add(eliminatedId);
    }

    const eliminatedPlayer = this.players.find((p) => p.userId === eliminatedId);
    const isImposterCaught = eliminatedId === this.imposterId;

    // Phase: Reveal
    this.phase = 'reveal';
    this.emit('game:phase', {
      phase: 'reveal',
      duration: 10,
      data: {
        eliminatedId,
        eliminatedUsername: eliminatedPlayer?.username || 'Nobody',
        isImposterCaught,
        imposterId: this.imposterId,
        crewWord: this.crewWord,
        imposterWord: this.imposterWord,
        voteResults: Object.fromEntries(voteCount),
      },
    });

    // Score: Crew gets points if imposter caught, imposter gets points if not
    if (isImposterCaught) {
      for (const p of this.players) {
        if (p.userId !== this.imposterId && !this.eliminated.has(p.userId)) {
          this.addScore(p.userId, 10);
        }
      }
    } else {
      this.addScore(this.imposterId, 15);
    }

    this.broadcastScores();
    await this.startTimer(10, 'reveal');

    // Check if we should play another round
    this.currentRound++;
    if (this.currentRound <= this.totalRounds) {
      await this.startRound();
    } else {
      await this.endGame();
    }
  }

  async handleAction(userId: string, action: GameActionData): Promise<void> {
    if (action.type === 'vote' && this.phase === 'voting') {
      const targetId = action.payload?.targetId as string;
      if (!targetId || targetId === userId) return;
      if (this.eliminated.has(userId)) return;
      if (this.eliminated.has(targetId)) return;

      this.votes.set(userId, targetId);

      // Broadcast vote count (not who voted for whom)
      this.emit('game:state', {
        phase: 'voting',
        round: this.currentRound,
        totalRounds: this.totalRounds,
        data: {
          votesCast: this.votes.size,
          totalVoters: this.players.filter((p) => !this.eliminated.has(p.userId)).length,
        },
      });
    }
  }

  cleanup(): void {
    this.clearTimer();
    this.clearPhaseTimeout();
  }
}
