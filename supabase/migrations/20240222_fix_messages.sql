-- Drop existing table if it exists
DROP TABLE IF EXISTS messages;

-- Recreate messages table with proper structure
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON messages
    FOR INSERT WITH CHECK (true);

