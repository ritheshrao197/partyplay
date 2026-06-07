import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { FiSend, FiMessageCircle, FiX } from 'react-icons/fi';

export default function Chat() {
  const { messages, typingUsers, isOpen, toggleChat, sendMessage, setTyping } = useChat();
  const userId = useAuthStore((s) => s.user?.id);
  const [input, setInput] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
    setTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-600/30 transition-all active:scale-95"
      >
        {isOpen ? <FiX size={20} /> : <FiMessageCircle size={20} />}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
            {Math.min(messages.length, 99)}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 h-96 glass-strong flex flex-col overflow-hidden animate-scale-in">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm">Chat</h3>
            <span className="text-xs text-white/40">{messages.length} messages</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-center text-white/30 text-sm py-8">No messages yet</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.userId === userId ? 'items-end' : 'items-start'}`}>
                {msg.userId !== userId && (
                  <span className="text-[10px] text-white/40 mb-0.5">{msg.username}</span>
                )}
                <div
                  className={`max-w-[80%] px-3 py-1.5 rounded-xl text-sm ${
                    msg.userId === userId
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/10 text-white/90'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <p className="text-[10px] text-white/40 italic">
                {typingUsers.map((u) => u.username).join(', ')} typing...
              </p>
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder-white/30 focus:outline-none focus:border-primary-500"
              maxLength={500}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-30 transition-colors"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
