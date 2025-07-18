DO $$
BEGIN
    -- Create database if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'task_management') THEN
        CREATE DATABASE task_management
            WITH 
            OWNER = postgres
            ENCODING = 'UTF8'
            LC_COLLATE = 'English_United States.1252'
            LC_CTYPE = 'English_United States.1252'
            TABLESPACE = pg_default
            CONNECTION LIMIT = -1;
    END IF;
END $$;

-- Switch context (not directly possible, so we'll just continue)
-- All subsequent commands will run in current database

-- Create tables in current database (not recommended)
-- Instead, better to run in two separate steps as described above