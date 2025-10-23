-- Create projects table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    title TEXT NOT NULL,
    idea TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    graph_data TEXT,
    report TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Create an index on user_id for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- You can modify this to restrict access based on user_id
CREATE POLICY "Allow all operations on projects" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Create a policy that restricts users to their own projects
-- Uncomment the lines below and comment out the policy above to enable this

-- CREATE POLICY "Users can view their own projects" ON projects
--     FOR SELECT
--     USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can insert their own projects" ON projects
--     FOR INSERT
--     WITH CHECK (auth.uid()::text = user_id);

-- CREATE POLICY "Users can update their own projects" ON projects
--     FOR UPDATE
--     USING (auth.uid()::text = user_id)
--     WITH CHECK (auth.uid()::text = user_id);

-- CREATE POLICY "Users can delete their own projects" ON projects
--     FOR DELETE
--     USING (auth.uid()::text = user_id);

