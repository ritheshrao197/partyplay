import { useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { useChatStore } from '../store/chatStore';

export function useChat() {
  const { emit } = useSocket();
  const messages = useChatStore((s) => s.messages);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const isOpen = useChatStore((s) => s.isOpen);
  const toggleChat = useChatStore((s) => s.toggleChat);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      emit('chat:message', { content });
    },
    [emit],
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      emit('chat:typing', { isTyping });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (isTyping) {
        typingTimeout.current = setTimeout(() => {
          emit('chat:typing', { isTyping: false });
        }, 2000);
      }
    },
    [emit],
  );

  return { messages, typingUsers, isOpen, toggleChat, sendMessage, setTyping };
}
