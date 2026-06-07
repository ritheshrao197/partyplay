import { v4 as uuid } from 'uuid';
import type { ChatMessage } from '../types/index.js';

class ChatService {
  createMessage(roomId: string, userId: string, username: string, content: string): ChatMessage {
    return {
      id: uuid(),
      roomId,
      userId,
      username,
      avatar: '', // avatar is resolved on client from store
      content: content.substring(0, 500), // Max 500 chars
      timestamp: Date.now(),
    };
  }
}

export const chatService = new ChatService();
