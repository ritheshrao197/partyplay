-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  game_type VARCHAR(20) NOT NULL,
  difficulty VARCHAR(10) NOT NULL DEFAULT 'medium',
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_questions_game_type ON questions(game_type);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
