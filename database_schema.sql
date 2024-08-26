-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for journal entry status
CREATE TYPE journal_entry_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- User table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entry table
CREATE TABLE journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL,
  status journal_entry_status DEFAULT 'DRAFT',
  UNIQUE (user_id, id)
);

-- Entry Analysis table
CREATE TABLE entry_analyses (
  entry_id UUID UNIQUE NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  subject TEXT NOT NULL,
  negative BOOLEAN NOT NULL,
  summary TEXT NOT NULL,
  color TEXT DEFAULT '#0101fe',
  sentiment_score REAL NOT NULL
);

-- Create index on user_id in entry_analyses
CREATE INDEX idx_entry_analyses_user_id ON entry_analyses(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_entry_analyses_updated_at
BEFORE UPDATE ON entry_analyses
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();