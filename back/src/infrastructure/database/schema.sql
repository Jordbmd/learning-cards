CREATE TABLE IF NOT EXISTS cards (
  id VARCHAR(36) PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category INTEGER NOT NULL CHECK (category BETWEEN 1 AND 7),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_reviewed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category);

CREATE INDEX IF NOT EXISTS idx_cards_tags ON cards USING GIN(tags);
