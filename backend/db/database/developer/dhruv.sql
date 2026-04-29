-- ----------------------------------------------------------------------------
-- 2026-04-29 · Add `image` column to users for profile image S3 path storage
-- ----------------------------------------------------------------------------
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS image VARCHAR(500);
