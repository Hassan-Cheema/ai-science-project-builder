-- Migration: 001 - Initial Schema
-- Description: Create initial database schema for AI Science Builder
-- Date: 2024-10-23

BEGIN;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100),
    grade VARCHAR(20),
    topic TEXT,
    idea TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    materials JSONB,
    procedure TEXT,
    graph_data TEXT,
    graph_description TEXT,
    report TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT projects_title_check CHECK (char_length(title) >= 3 AND char_length(title) <= 200)
);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_subject ON projects(subject);
CREATE INDEX idx_projects_grade ON projects(grade);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;

