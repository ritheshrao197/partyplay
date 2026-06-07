-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  avatar VARCHAR(100) NOT NULL DEFAULT 'avatar_1',
  provider VARCHAR(20) NOT NULL DEFAULT 'guest',
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
