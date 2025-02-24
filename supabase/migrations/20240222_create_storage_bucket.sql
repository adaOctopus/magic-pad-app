-- Enable the storage extension if not already enabled
create extension if not exists "storage" schema "extensions";

-- Create the uploads bucket if it doesn't exist
insert into storage.buckets (id, name)
values ('uploads', 'uploads')
on conflict (id) do nothing;

-- Set up storage policies for the uploads bucket
create policy "Give users access to own folder 1yb0e7q_0"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Give users access to own folder 1yb0e7q_1"
on storage.objects for select
to authenticated
using (
  bucket_id = 'uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);

