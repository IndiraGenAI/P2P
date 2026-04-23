-- ----------------------------------------------------------------------------
-- get_user_role_wise_permission: given a role_id, return the user_id assigned
-- to that role plus the flat list of permission tags the role grants.
--
-- Mirrors the WEB project helper of the same name that powers the
-- `RolesGuard` (`WEB/rnw-api/admission-service/src/core/guards/role.guard.ts`).
-- The guard expects a row shaped like `{ user_id, role_id, permissions }`
-- where `permissions` is an array of `page_actions.tag` strings such as
-- `'MASTER_COUNTRY_VIEW'` (matching the seed expression
-- `page_code || '_' || action_code`).
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS get_user_role_wise_permission(INTEGER);

CREATE OR REPLACE FUNCTION get_user_role_wise_permission(p_role_id INTEGER)
RETURNS TABLE(
    user_id     INTEGER,
    role_id     INTEGER,
    permissions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            ur.user_id,
            r.id AS role_id,
            COALESCE(
                ARRAY(
                    SELECT pa.tag
                      FROM role_permissions rp
                      JOIN page_actions pa ON pa.id = rp.page_action_id
                     WHERE rp.role_id = r.id
                ),
                ARRAY[]::TEXT[]
            ) AS permissions
          FROM roles r
          LEFT JOIN user_roles ur ON ur.role_id = r.id
         WHERE r.id = p_role_id
         LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- assign_role_permissions: replace the role's permission list with the
-- supplied page_action_ids. Mirrors the legacy WEB project helper that the
-- frontend's "Save Permissions" action calls.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION assign_role_permissions(
    p_role_id INTEGER,
    p_page_action_ids INTEGER[],
    p_created_by INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM role_permissions WHERE role_id = p_role_id;

    IF p_page_action_ids IS NOT NULL AND array_length(p_page_action_ids, 1) > 0 THEN
        INSERT INTO role_permissions (role_id, page_action_id, created_by, created_date)
        SELECT p_role_id, page_action_id, p_created_by, CURRENT_TIMESTAMP
        FROM unnest(p_page_action_ids) AS page_action_id
        ON CONFLICT (role_id, page_action_id) DO NOTHING;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- assign_user_roles: replace the user's assigned roles with the supplied
-- role_ids list. Mirrors `assign_role_permissions` so create/edit user form
-- can persist a multi-select role picker atomically (delete + insert).
-- ----------------------------------------------------------------------------
-- Drop any prior signature first so re-running this script always re-creates
-- the function cleanly (CREATE OR REPLACE alone cannot change argument types
-- on an existing function, which would otherwise leave a stale VARCHAR(100)
-- variant resolved over this one).
DROP FUNCTION IF EXISTS assign_user_roles(INTEGER, INTEGER[], VARCHAR);
DROP FUNCTION IF EXISTS assign_user_roles(INTEGER, INTEGER[], TEXT);

CREATE OR REPLACE FUNCTION assign_user_roles(
    p_user_id INTEGER,
    p_role_ids INTEGER[],
    p_created_by TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM user_roles WHERE user_id = p_user_id;

    IF p_role_ids IS NOT NULL AND array_length(p_role_ids, 1) > 0 THEN
        INSERT INTO user_roles (user_id, role_id, created_by, created_date)
        SELECT p_user_id, role_id, p_created_by, CURRENT_TIMESTAMP
        FROM unnest(p_role_ids) AS role_id
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_created_date() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_created_date
DESCRIPTION 	: This function use to generate trigger for created date
CREATED BY 		: Dhruv Sonani
CREATED DATE	: 21-April-2026
MODIFIED BY		: Dhruv Sonani
MODIFIED DATE	: 21-April-2026
CHANGE HISTORY	:
21-April-2026 - Dhruv Sonani - add a condition: if date already set, then not modify it
------------------------------------------------------------------------------------*/
BEGIN
	IF NEW.created_date IS NULL THEN
  		NEW.created_date := CURRENT_TIMESTAMP;
	END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_date() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_updated_date
DESCRIPTION 	: This function use to generate trigger for updated date
UPDATED BY 		: Dhruv Sonani
UPDATED DATE	: 21-April-2026
CHANGE HISTORY	:
21-April-2026 - Dhruv Sonani - add a condition: if date already set, then not modify it
------------------------------------------------------------------------------------*/
BEGIN
  NEW.updated_date := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DO $$
DECLARE
    ct text;
    ut text;
/* ------------------------------------------------------------------------------------
SCRIPT: for set_created_date & set_updated_date
DESCRIPTION 	: Set both triggers to all the tables of current database
CREATED BY 		: Dhruv Sonani
CREATED DATE	: 21-April-2026
UPDATED BY      : Dhruv Sonani
UPDATED DATE    : 21-April-2026
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
BEGIN
    FOR ct IN 
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'created_date'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_created_date on %I',ct);

        EXECUTE format('CREATE TRIGGER set_created_date
                        BEFORE INSERT ON %I
                        FOR EACH ROW EXECUTE PROCEDURE set_created_date()',
                        ct);
    END LOOP;

    FOR ut IN 
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_date'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_date on %I',ut);

        EXECUTE format('CREATE TRIGGER set_updated_date
                        BEFORE UPDATE ON %I
                        FOR EACH ROW EXECUTE PROCEDURE set_updated_date()',
                        ut);
    END LOOP;
    
END;
$$ LANGUAGE plpgsql;
