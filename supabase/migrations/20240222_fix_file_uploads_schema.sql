-- Drop the existing table if it exists
DROP TABLE IF EXISTS file_uploads;

-- Recreate the table with correct constraints
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  upload_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NULL, -- Make user_id optional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for both authenticated and anonymous users
CREATE POLICY "Enable insert for all users"
ON file_uploads FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable select for all users"
ON file_uploads FOR SELECT
TO public
USING (true);

