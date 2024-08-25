-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for journal entry status
CREATE TYPE JOURNAL_ENTRY_STATUS AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY, -- This should match the Auth ID from Supabase Auth
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries table
CREATE TABLE journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL,
  status JOURNAL_ENTRY_STATUS DEFAULT 'DRAFT',
  UNIQUE(user_id, id)
);

-- Entry analysis table
CREATE TABLE entry_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  entry_id UUID UNIQUE NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  subject TEXT NOT NULL,
  negative BOOLEAN NOT NULL,
  summary TEXT NOT NULL,
  color TEXT DEFAULT '#0101fe',
  sentiment_score FLOAT NOT NULL
);

-- Add indexes
CREATE INDEX idx_entry_analysis_user_id ON entry_analysis(user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update timestamps
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_journal_entries_timestamp
BEFORE UPDATE ON journal_entries
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_entry_analysis_timestamp
BEFORE UPDATE ON entry_analysis
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
