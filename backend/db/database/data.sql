CREATE TYPE role_type AS ENUM (
    'SUPER_ADMIN',
    'MANAGER',
    'PURCHASER',
    'FINANCE'
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_status'
    ) THEN
        CREATE TYPE user_status AS ENUM ('ENABLE', 'DISABLE', 'PENDING');
    END IF;
END
$$;