-- First drop the existing table if it exists
DROP TABLE IF EXISTS file_uploads;

-- Recreate the table with optional user_id
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('linkedin', 'producthunt')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NULL -- Make user_id optional
);

-- Enable RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies that allow both authenticated and anonymous access
CREATE POLICY "Enable insert access for all users" ON file_uploads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON file_uploads
  FOR SELECT USING (true);

