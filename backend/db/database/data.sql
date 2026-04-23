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

-- ----------------------------------------------------------------------------
-- Permission system seed data
-- ----------------------------------------------------------------------------
-- 1) Master action codes (mirrors `ActionType` in the frontend).
INSERT INTO actions (action_code, name) VALUES
    ('VIEW',              'View'),
    ('CREATE',            'Create'),
    ('UPDATE',            'Update'),
    ('DELETE',            'Delete'),
    ('FULL_VIEW',         'Full View'),
    ('EXPORT_DATA',       'Export Data'),
    ('ASSIGN_PERMISSION', 'Assign Permission')
ON CONFLICT (action_code) DO NOTHING;

-- 2) Pages tree. Top-level rows have parent_page_id NULL; children resolve
--    their parent by page_code lookup so the script is order-independent.
INSERT INTO pages (page_code, name, parent_page_id, sequence) VALUES
    ('DASHBOARD',                       'Dashboard',          NULL, 1),
    ('USER_CONFIGURATION',              'User Configuration', NULL, 2),
    ('MASTER',                          'Masters Control',    NULL, 3),
    ('WORKFLOW',                        'Workflows',          NULL, 4),
    ('APPROVALS',                       'Approvals',          NULL, 5),
    ('PROCUREMENT',                     'Procurement',        NULL, 6),
    ('FINANCE',                         'Finance',            NULL, 7)
ON CONFLICT (page_code) DO NOTHING;

INSERT INTO pages (page_code, name, parent_page_id, sequence)
SELECT v.page_code, v.name, parent.id, v.sequence FROM (
    VALUES
        ('USERS_USERS',                    'User Management',     'USER_CONFIGURATION', 1),
        ('USERS_ROLES',                    'Role Config',         'USER_CONFIGURATION', 2),
        ('CONFIGURATION_LIST',             'Configuration List',  'USER_CONFIGURATION', 3),

        -- Masters: 4 sub-group containers (no CRUD actions of their own).
        ('MASTER_PURCHASING',              'Purchasing',          'MASTER',             1),
        ('MASTER_ORGANIZATION',            'Organization',        'MASTER',             2),
        ('MASTER_FINANCE_TAX',             'Finance & Tax',       'MASTER',             3),
        ('MASTER_GEOGRAPHY',               'Geography',           'MASTER',             4),

        ('WORKFLOW_V1',                    'Workflows',           'WORKFLOW',           1),
        ('WORKFLOW_V2',                    'Workflow (V2)',       'WORKFLOW',           2),

        ('APPROVAL_ITEM',                  'Item Approval',       'APPROVALS',          1),
        ('APPROVAL_VENDOR',                'Vendor Approval',     'APPROVALS',          2),
        ('APPROVAL_BUDGET',                'Budget Approval',     'APPROVALS',          3),

        ('PROCUREMENT_PURCHASE_REQUEST',   'Purchase Request',    'PROCUREMENT',        1),
        ('PROCUREMENT_RATE_CONTRACT',      'Rate Contract',       'PROCUREMENT',        2),
        ('PROCUREMENT_PURCHASE_ORDER',     'Purchase Order',      'PROCUREMENT',        3),
        ('PROCUREMENT_DIRECT_INVOICE',     'Direct Invoice',      'PROCUREMENT',        4),

        ('FINANCE_BUDGETS',                'Budgets',             'FINANCE',            1)
) AS v(page_code, name, parent_code, sequence)
JOIN pages parent ON parent.page_code = v.parent_code
ON CONFLICT (page_code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- One-time cleanup of the old MASTER children that have been superseded by
-- the new sub-group tree below. Safe to re-run: the DELETE no-ops once the
-- rows are gone, and the UPDATE no-ops once MASTER_COST_CENTER is already
-- under MASTER_ORGANIZATION.
-- ----------------------------------------------------------------------------
DELETE FROM pages
WHERE page_code IN ('MASTER_VENDORS', 'MASTER_ITEMS', 'MASTER_CATEGORIES');

-- MASTER_COST_CENTER existed in the old seed as a direct child of MASTER.
-- The new tree re-uses the same page_code under MASTER_ORGANIZATION, but the
-- INSERT below uses ON CONFLICT DO NOTHING and won't fix the parent. Force it
-- here so existing role_permissions rows are preserved.
UPDATE pages
   SET parent_page_id = (SELECT id FROM pages WHERE page_code = 'MASTER_ORGANIZATION'),
       sequence       = 3
 WHERE page_code = 'MASTER_COST_CENTER'
   AND parent_page_id <> (SELECT id FROM pages WHERE page_code = 'MASTER_ORGANIZATION');

-- Masters leaves under their respective sub-group parents.
INSERT INTO pages (page_code, name, parent_page_id, sequence)
SELECT v.page_code, v.name, parent.id, v.sequence FROM (
    VALUES
        -- Purchasing
        ('MASTER_VENDOR',          'Vendor',           'MASTER_PURCHASING',  1),
        ('MASTER_VENDOR_SITE',     'Vendor Site',      'MASTER_PURCHASING',  2),
        ('MASTER_VENDOR_CATEGORY', 'Vendor Category',  'MASTER_PURCHASING',  3),
        ('MASTER_APPLICANT_TYPE',  'Applicant Type',   'MASTER_PURCHASING',  4),
        ('MASTER_ITEM',            'Item',             'MASTER_PURCHASING',  5),
        ('MASTER_ITEM_TYPE',       'Item Type',        'MASTER_PURCHASING',  6),
        ('MASTER_ITEM_CATEGORY',   'Item Category',    'MASTER_PURCHASING',  7),
        ('MASTER_UOM',             'UOM',              'MASTER_PURCHASING',  8),
        ('MASTER_PAYMENT_TERMS',   'Payment Terms',    'MASTER_PURCHASING',  9),

        -- Organization
        ('MASTER_DEPARTMENT',      'Department',       'MASTER_ORGANIZATION', 1),
        ('MASTER_SUBDEPARTMENT',   'Subdepartment',    'MASTER_ORGANIZATION', 2),
        ('MASTER_COST_CENTER',     'Cost Center',      'MASTER_ORGANIZATION', 3),
        ('MASTER_ENTITY',          'Entity',           'MASTER_ORGANIZATION', 4),
        ('MASTER_CENTER',          'Center',           'MASTER_ORGANIZATION', 5),

        -- Finance & Tax
        ('MASTER_COA_CATEGORY',    'COA Category',     'MASTER_FINANCE_TAX',  1),
        ('MASTER_COA',             'COA',              'MASTER_FINANCE_TAX',  2),
        ('MASTER_TDS',             'TDS',              'MASTER_FINANCE_TAX',  3),
        ('MASTER_GST',             'GST',              'MASTER_FINANCE_TAX',  4),
        ('MASTER_VOUCHER',         'Voucher',          'MASTER_FINANCE_TAX',  5),
        ('MASTER_INVOICE_SOURCE',  'Invoice Source',   'MASTER_FINANCE_TAX',  6),
        ('MASTER_CURRENCY',        'Currency',         'MASTER_FINANCE_TAX',  7),

        -- Geography
        ('MASTER_COUNTRY',         'Country',          'MASTER_GEOGRAPHY',    1),
        ('MASTER_ZONE',            'Zone',             'MASTER_GEOGRAPHY',    2),
        ('MASTER_STATE',           'State',            'MASTER_GEOGRAPHY',    3),
        ('MASTER_CITY',            'City',             'MASTER_GEOGRAPHY',    4)
) AS v(page_code, name, parent_code, sequence)
JOIN pages parent ON parent.page_code = v.parent_code
ON CONFLICT (page_code) DO NOTHING;

-- 3) page_actions: every TRUE leaf (no children of its own) gets the standard
--    CRUD actions. We exclude container pages like MASTER_PURCHASING so they
--    don't end up with phantom CRUD perms.
INSERT INTO page_actions (page_id, action_id, tag)
SELECT p.id,
       a.id,
       p.page_code || '_' || a.action_code AS tag
FROM pages p
CROSS JOIN actions a
WHERE p.parent_page_id IS NOT NULL  -- not top-level
  AND NOT EXISTS (                  -- no children = real leaf
      SELECT 1 FROM pages c WHERE c.parent_page_id = p.id
  )
  AND a.action_code IN ('VIEW', 'CREATE', 'UPDATE', 'DELETE')
ON CONFLICT (page_id, action_id) DO NOTHING;

-- Top-level Dashboard page is a leaf (it has no children) so seed it too.
INSERT INTO page_actions (page_id, action_id, tag)
SELECT p.id, a.id, p.page_code || '_' || a.action_code
FROM pages p
CROSS JOIN actions a
WHERE p.page_code = 'DASHBOARD'
  AND a.action_code IN ('VIEW')
ON CONFLICT (page_id, action_id) DO NOTHING;

-- ASSIGN_PERMISSION specifically on the Roles page.
INSERT INTO page_actions (page_id, action_id, tag)
SELECT p.id, a.id, p.page_code || '_' || a.action_code
FROM pages p
CROSS JOIN actions a
WHERE p.page_code = 'USERS_ROLES'
  AND a.action_code = 'ASSIGN_PERMISSION'
ON CONFLICT (page_id, action_id) DO NOTHING;


-- =============================================================================
-- Grant SUPER_ADMIN (all permissions) to a single user.
-- Re-runnable: every step is idempotent.
-- =============================================================================
DO $$
DECLARE
    target_email TEXT := 'dhruv@example.com';   -- <-- change this to your login email
    v_user_id    INT;
    v_role_id    INT;
BEGIN
    -- 1) Resolve the user.
    SELECT id INTO v_user_id FROM users WHERE email = target_email;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User % not found. Register/login first, then re-run.', target_email;
    END IF;

    -- 2) Make sure a SUPER_ADMIN role exists.
    INSERT INTO roles (name, description, type, status, created_by, created_date)
    VALUES ('Super Admin', 'Full access to every page and action',
            'SUPER_ADMIN', TRUE, target_email, CURRENT_TIMESTAMP)
    ON CONFLICT (name) DO NOTHING;

    SELECT id INTO v_role_id FROM roles WHERE name = 'Super Admin';

    -- 3) Link the user to the role.
    INSERT INTO user_roles (user_id, role_id, created_by, created_date)
    VALUES (v_user_id, v_role_id, target_email, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id, role_id) DO NOTHING;

    -- 4) Grant every page_action to that role.
    --    Uses the helper function shipped in function.sql so the row layout
    --    matches what the "Save Permissions" UI produces.
    PERFORM assign_role_permissions(
        v_role_id,
        (SELECT COALESCE(array_agg(id), ARRAY[]::int[]) FROM page_actions),
        v_user_id
    );

    RAISE NOTICE 'Granted % permissions to user % (id=%) via role % (id=%).',
        (SELECT count(*) FROM role_permissions WHERE role_id = v_role_id),
        target_email, v_user_id, 'Super Admin', v_role_id;
END
$$;