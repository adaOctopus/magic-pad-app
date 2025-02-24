-- Create a new table for file uploads
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('linkedin', 'producthunt')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON file_uploads
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON file_uploads
  FOR INSERT WITH CHECK (true);

