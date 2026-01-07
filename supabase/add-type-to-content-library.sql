-- Add type column to content_library table
ALTER TABLE content_library 
ADD COLUMN type TEXT DEFAULT '시연' CHECK (type IN ('실습', '시연', '이론'));
