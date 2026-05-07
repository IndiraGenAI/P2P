-- Add GRN procurement page (idempotent). Re-sequence sibling procurement leaves.
INSERT INTO pages (page_code, name, parent_page_id, sequence)
SELECT 'PROCUREMENT_GRN', 'GRN', p.id, 3
FROM pages p
WHERE p.page_code = 'PROCUREMENT'
ON CONFLICT (page_code) DO NOTHING;

UPDATE pages
SET sequence = 4
WHERE page_code = 'PROCUREMENT_PURCHASE_ORDER'
  AND parent_page_id = (SELECT id FROM pages WHERE page_code = 'PROCUREMENT');

UPDATE pages
SET sequence = 5
WHERE page_code = 'PROCUREMENT_DIRECT_INVOICE'
  AND parent_page_id = (SELECT id FROM pages WHERE page_code = 'PROCUREMENT');

INSERT INTO page_actions (page_id, action_id, tag)
SELECT p.id, a.id, p.page_code || '_' || a.action_code
FROM pages p
CROSS JOIN actions a
WHERE p.page_code = 'PROCUREMENT_GRN'
  AND a.action_code IN ('VIEW', 'CREATE', 'UPDATE', 'DELETE')
ON CONFLICT (page_id, action_id) DO NOTHING;
