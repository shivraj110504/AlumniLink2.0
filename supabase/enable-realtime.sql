
-- Enable realtime for the messages table
ALTER TABLE messages REPLICA IDENTITY FULL;
alter publication supabase_realtime add table messages;
