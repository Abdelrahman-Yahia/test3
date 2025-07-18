-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check admin user
SELECT * FROM users WHERE role = 'admin';

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public';