-- Enable the storage extension
create extension if not exists "storage" schema "extensions";

-- Create the uploads bucket if it doesn't exist
DO $$
BEGIN
    insert into storage.buckets (id, name, public)
    values ('uploads', 'uploads', false)
    on conflict (id) do nothing;

    -- Create RLS policies for the bucket
    create policy "Allow public read access"
    on storage.objects for select
    using ( bucket_id = 'uploads' );

    create policy "Allow authenticated users to upload files"
    on storage.objects for insert
    to authenticated
    with check ( bucket_id = 'uploads' );

    create policy "Allow anonymous users to upload files"
    on storage.objects for insert
    to anon
    with check ( bucket_id = 'uploads' );
END $$;

