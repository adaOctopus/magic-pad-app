-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- LinkedIn contacts table
CREATE TABLE linkedin_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product Hunt contacts table
CREATE TABLE producthunt_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add row level security (RLS) policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE producthunt_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for inserting data (you can adjust these based on your needs)
CREATE POLICY "Allow inserts for authenticated users" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users" ON linkedin_contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow inserts for authenticated users" ON producthunt_contacts
    FOR INSERT WITH CHECK (true);

