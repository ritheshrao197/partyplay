import type { TypedIO } from '../socket/index.js';
import type { GameActionData, GameType, PlayerState } from '../types/index.js';
import { BaseGame } from './BaseGame.js';
import { ImposterGame } from './imposter/ImposterGame.js';
import { WordRushGame } from './wordrush/WordRushGame.js';
import { NeverHaveIEverGame } from './neverhaveiever/NeverHaveIEverGame.js';
import { WrongAnswersGame } from './wronganswers/WrongAnswersGame.js';
import { getPlayerStates } from '../models/player.js';
import { getRoomByCode } from '../models/room.js';

class GameManager {
  private games = new Map<string, BaseGame>();

  async startGame(roomCode: string, roomId: string, gameType: GameType, io: TypedIO): Promise<void> {
    if (this.games.has(roomCode)) {
      throw new Error('Game already running in this room');
    }

    const room = await getRoomByCode(roomCode);
    if (!room) throw new Error('Room not found');

    const playerStates = await getPlayerStates(roomId, room.hostId);

    let game: BaseGame;

    switch (gameType) {
      case 'imposter':
        game = new ImposterGame(roomCode, roomId, io);
        break;
      case 'wordrush':
        game = new WordRushGame(roomCode, roomId, io);
        break;
      case 'neverhaveiever':
        game = new NeverHaveIEverGame(roomCode, roomId, io);
        break;
      case 'wronganswers':
        game = new WrongAnswersGame(roomCode, roomId, io);
        break;
      default:
        throw new Error(`Unknown game type: ${gameType}`);
    }

    await game.init(playerStates);
    this.games.set(roomCode, game);
    await game.start();
  }

  async handleAction(roomCode: string, userId: string, action: GameActionData, _io: TypedIO): Promise<void> {
    const game = this.games.get(roomCode);
    if (!game) throw new Error('No active game in this room');
    await game.handleAction(userId, action);
  }

  endGame(roomCode: string): void {
    const game = this.games.get(roomCode);
    if (game) {
      game.cleanup();
      this.games.delete(roomCode);
    }
  }

  async forceEndGame(roomCode: string): Promise<void> {
    const game = this.games.get(roomCode);
    if (game) {
      await game.forceEndGame();
      this.endGame(roomCode);
    }
  }

  getGame(roomCode: string): BaseGame | undefined {
    return this.games.get(roomCode);
  }
}

export const gameManager = new GameManager();
