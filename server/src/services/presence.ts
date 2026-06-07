// In-memory presence tracking (use Redis SET for production scale)
const onlineUsers = new Map<string, { socketId: string; since: number }>();

class PresenceService {
  setOnline(userId: string, socketId: string): void {
    onlineUsers.set(userId, { socketId, since: Date.now() });
  }

  setOffline(userId: string): void {
    onlineUsers.delete(userId);
  }

  isOnline(userId: string): boolean {
    return onlineUsers.has(userId);
  }

  getSocketId(userId: string): string | undefined {
    return onlineUsers.get(userId)?.socketId;
  }

  getOnlineCount(): number {
    return onlineUsers.size;
  }

  getOnlineUserIds(): string[] {
    return Array.from(onlineUsers.keys());
  }
}

export const presenceService = new PresenceService();
