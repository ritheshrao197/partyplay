-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  game_mode VARCHAR(20) NOT NULL,
  rounds INTEGER NOT NULL DEFAULT 1,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ
);

CREATE INDEX idx_matches_room ON matches(room_id);
CREATE INDEX idx_matches_winner ON matches(winner_id);
