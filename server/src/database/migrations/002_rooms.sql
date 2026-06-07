-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(6) NOT NULL UNIQUE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  max_players INTEGER NOT NULL DEFAULT 12,
  is_public BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_code ON rooms(room_code);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_game_type ON rooms(game_type);
CREATE INDEX idx_rooms_public ON rooms(is_public) WHERE status = 'waiting';
