-- Update messages table to include user_id
ALTER TABLE messages
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Allow inserts for authenticated users" ON messages;

CREATE POLICY "Allow inserts for all users" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for all users" ON messages
  FOR SELECT USING (true);

