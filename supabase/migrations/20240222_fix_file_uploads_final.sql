-- Drop the existing table and its policies
DROP TABLE IF EXISTS file_uploads;

-- Create the table with minimal constraints
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  file_path TEXT,
  upload_type TEXT,
  user_id UUID REFERENCES auth.users(id) NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable insert for all users" ON file_uploads;
DROP POLICY IF EXISTS "Enable select for all users" ON file_uploads;

-- Create a simple policy that allows all operations
CREATE POLICY "Allow all operations"
ON file_uploads
FOR ALL
TO public
USING (true)
WITH CHECK (true);

