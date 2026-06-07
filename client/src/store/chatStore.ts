import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: number;
}

interface TypingUser {
  userId: string;
  username: string;
}

interface ChatState {
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  isOpen: boolean;
  addMessage: (msg: ChatMessage) => void;
  setTyping: (userId: string, username: string, isTyping: boolean) => void;
  clearMessages: () => void;
  toggleChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  typingUsers: [],
  isOpen: false,

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages.slice(-100), msg], // Keep last 100
    })),

  setTyping: (userId, username, isTyping) =>
    set((state) => ({
      typingUsers: isTyping
        ? [...state.typingUsers.filter((u) => u.userId !== userId), { userId, username }]
        : state.typingUsers.filter((u) => u.userId !== userId),
    })),

  clearMessages: () => set({ messages: [], typingUsers: [] }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));
