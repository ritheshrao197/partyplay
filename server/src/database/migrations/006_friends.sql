-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, friend_id)
);

CREATE INDEX idx_friends_user ON friends(user_id);
CREATE INDEX idx_friends_friend ON friends(friend_id);
