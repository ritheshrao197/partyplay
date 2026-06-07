-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

CREATE INDEX idx_players_room ON players(room_id);
CREATE INDEX idx_players_user ON players(user_id);
