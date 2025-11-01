-- AI Science Builder Database Schema
-- For Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
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
    graph_data TEXT,  -- Base64 encoded image
    graph_description TEXT,
    report TEXT,      -- Markdown report
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT projects_title_check CHECK (char_length(title) >= 3 AND char_length(title) <= 200)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_subject ON projects(subject);
CREATE INDEX IF NOT EXISTS idx_projects_grade ON projects(grade);

-- User preferences table (optional - for future features)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    favorite_subjects TEXT[],
    default_grade VARCHAR(20),
    theme VARCHAR(50) DEFAULT 'light',
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project favorites/bookmarks table (optional)
CREATE TABLE IF NOT EXISTS project_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON project_favorites(user_id);

-- Project shares table (optional - for collaborative features)
CREATE TABLE IF NOT EXISTS project_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    share_token VARCHAR(100) UNIQUE NOT NULL,
    created_by TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_shares_token ON project_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_shares_project_id ON project_shares(project_id);

-- API usage tracking table (optional - for analytics)
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    endpoint VARCHAR(100) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ai_service VARCHAR(50),  -- 'gemini' or 'openai'
    cached BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_created_at ON api_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_endpoint ON api_usage(endpoint);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_favorites ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid()::text = user_id);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences"
    ON user_preferences FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Favorites policies
CREATE POLICY "Users can manage their own favorites"
    ON project_favorites FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Comments for documentation
COMMENT ON TABLE projects IS 'Stores science project data generated by AI';
COMMENT ON TABLE user_preferences IS 'User-specific preferences and settings';
COMMENT ON TABLE project_favorites IS 'User bookmarks/favorites for projects';
COMMENT ON TABLE project_shares IS 'Shareable links for projects';
COMMENT ON TABLE api_usage IS 'API usage analytics and monitoring';

COMMENT ON COLUMN projects.graph_data IS 'Base64 encoded PNG image of the data visualization';
COMMENT ON COLUMN projects.metadata IS 'Flexible JSON field for additional project data';
COMMENT ON COLUMN api_usage.cached IS 'Whether the response was served from cache';

