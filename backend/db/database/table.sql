CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type role_type,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    image VARCHAR(500),
    status user_status NOT NULL DEFAULT 'PENDING',
    last_seen TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- ----------------------------------------------------------------------------
-- Permission system: pages / actions / page_actions / role_permissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    page_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    parent_page_id INTEGER REFERENCES pages(id) ON UPDATE NO ACTION ON DELETE SET NULL,
    sequence INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS actions (
    id SERIAL PRIMARY KEY,
    action_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS page_actions (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pages(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    action_id INTEGER NOT NULL REFERENCES actions(id),
    tag VARCHAR(150) NOT NULL UNIQUE,
    UNIQUE (page_id, action_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    page_action_id INTEGER REFERENCES page_actions(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id),
    created_date TIMESTAMP WITHOUT TIME ZONE,
    UNIQUE (role_id, page_action_id)
);

-- ----------------------------------------------------------------------------
-- Geography masters: country (more to come — state/city/zone).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS country_name_lower_uniq
    ON country (LOWER(name));

CREATE TABLE IF NOT EXISTS state (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    name VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS state_country_name_lower_uniq
    ON state (country_id, LOWER(name));

CREATE TABLE IF NOT EXISTS city (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    state_id INTEGER NOT NULL REFERENCES state(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    name VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS city_state_name_lower_uniq
    ON city (state_id, LOWER(name));

CREATE TABLE IF NOT EXISTS zone (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    name VARCHAR(100),
    code VARCHAR(50),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS zone_country_name_lower_uniq
    ON zone (country_id, LOWER(name));

-- Lightweight user-to-role link. The legacy `erp-db` UserRoles entity
-- requires zone_id/reporting_user_id which are not yet modelled in this
-- service; we only need the (user_id, role_id) pair to drive permissions.
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON UPDATE NO ACTION ON DELETE CASCADE,
    zone_id INTEGER,
    reporting_user_id INTEGER REFERENCES users(id),
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE,
    UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subdepartments (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_subdepartment_name UNIQUE (department_id, name),
    CONSTRAINT unique_subdepartment_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS cost_centers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS centers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_sources (
    id SERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,

    status BOOLEAN DEFAULT TRUE,

    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gst (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tds (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coa_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coa (
    id SERIAL PRIMARY KEY,
    coa_category_id INTEGER NOT NULL,
    gl_code VARCHAR(50) NOT NULL UNIQUE,
    gl_name VARCHAR(150) NOT NULL UNIQUE,
    distribution_combination VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_coa_category
        FOREIGN KEY (coa_category_id)
        REFERENCES coa_categories(id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS entities (
    id SERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL UNIQUE,

    business_unit VARCHAR(100),
    legal_entity VARCHAR(150),
    liability_distribution VARCHAR(255),
    prepayment_distribution VARCHAR(255),

    shipping_addresses TEXT[],
    billing_addresses TEXT[],

    status BOOLEAN DEFAULT TRUE,

    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS payment_terms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    oracle_code VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS terms_and_conditions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uoms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applicant_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    item_type_id INTEGER,
    item_category_id INTEGER,
    uom_id INTEGER,
    coa_id INTEGER,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_item_type FOREIGN KEY (item_type_id) REFERENCES item_types(id),
    CONSTRAINT fk_item_category FOREIGN KEY (item_category_id) REFERENCES item_categories(id),
    CONSTRAINT fk_item_uom FOREIGN KEY (uom_id) REFERENCES uoms(id),
    CONSTRAINT fk_item_coa FOREIGN KEY (coa_id) REFERENCES coa(id)
);

CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    vendor_category_id INTEGER,
    supplier_number VARCHAR(100),
    supplier_name VARCHAR(150),
    tds_id INTEGER,
    payment_term_id INTEGER,
    applicant_type_id INTEGER,
    resident_status VARCHAR(50),
    pan_number VARCHAR(20),
    gst_number VARCHAR(20),
    country_code VARCHAR(10),
    vendor_type VARCHAR(50),
    is_msme BOOLEAN DEFAULT FALSE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    address_line3 VARCHAR(255),
    state_code VARCHAR(50),
    city VARCHAR(100),
    pincode VARCHAR(20),
    country_id INTEGER,
    currency_id INTEGER,
    contact_first_name VARCHAR(100),
    contact_last_name VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_category FOREIGN KEY (vendor_category_id) REFERENCES vendor_categories(id),
    CONSTRAINT fk_vendor_tds FOREIGN KEY (tds_id) REFERENCES tds(id),
    CONSTRAINT fk_vendor_payment_term FOREIGN KEY (payment_term_id) REFERENCES payment_terms(id),
    CONSTRAINT fk_vendor_applicant_type FOREIGN KEY (applicant_type_id) REFERENCES applicant_types(id),
    CONSTRAINT fk_vendor_country FOREIGN KEY (country_id) REFERENCES country(id),
    CONSTRAINT fk_vendor_currency FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

-- Idempotent column adds (so existing databases pick up new columns)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS is_msme BOOLEAN DEFAULT FALSE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS address_line3 VARCHAR(255);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS state_code VARCHAR(50);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS country_id INTEGER;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS currency_id INTEGER;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contact_first_name VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contact_last_name VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contact_email VARCHAR(100);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_vendor_country'
    ) THEN
        ALTER TABLE vendors
            ADD CONSTRAINT fk_vendor_country FOREIGN KEY (country_id) REFERENCES country(id);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_vendor_currency'
    ) THEN
        ALTER TABLE vendors
            ADD CONSTRAINT fk_vendor_currency FOREIGN KEY (currency_id) REFERENCES currencies(id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS vendor_sites (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    site_code VARCHAR(50) NOT NULL,
    site_name VARCHAR(150),
    address TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    supplier_site_name VARCHAR(150),
    oracle_address_name VARCHAR(150),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_site_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_bank_details (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    account_number VARCHAR(50),
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_bank_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_entities (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    entity_id INTEGER NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_entity_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_vendor_entity_entity
        FOREIGN KEY (entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_vendor_entity UNIQUE (vendor_id, entity_id)
);

CREATE TABLE IF NOT EXISTS vendor_centers (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    center_id INTEGER NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_center_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_vendor_center_center
        FOREIGN KEY (center_id)
        REFERENCES centers(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_vendor_center UNIQUE (vendor_id, center_id)
);

CREATE TABLE IF NOT EXISTS vendor_documents (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    description VARCHAR(255),
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_document_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase_requests (
    id SERIAL PRIMARY KEY,

    pr_number VARCHAR(50) UNIQUE,

    entity_id INTEGER,
    vendor_id INTEGER,
    vendor_site_id INTEGER,
    item_type_id INTEGER,

    validity_from DATE,
    validity_to DATE,
    required_date DATE,

    frequency VARCHAR(50),

    department_id INTEGER,
    subdepartment_id INTEGER,
    payment_term_id INTEGER,

    terms_conditions TEXT,
    center_id INTEGER,

    remarks TEXT,
    overall_summary TEXT,

    net_amount NUMERIC(12,2) DEFAULT 0,

    status VARCHAR(50) DEFAULT 'DRAFT',

    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pr_entity FOREIGN KEY (entity_id) REFERENCES entities(id),
    CONSTRAINT fk_pr_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    CONSTRAINT fk_pr_vendor_site FOREIGN KEY (vendor_site_id) REFERENCES vendor_sites(id),
    CONSTRAINT fk_pr_item_type FOREIGN KEY (item_type_id) REFERENCES item_types(id),
    CONSTRAINT fk_pr_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_pr_subdepartment FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id),
    CONSTRAINT fk_pr_payment_term FOREIGN KEY (payment_term_id) REFERENCES payment_terms(id),
    CONSTRAINT fk_pr_center FOREIGN KEY (center_id) REFERENCES centers(id)
);

CREATE TABLE IF NOT EXISTS purchase_request_items (
    id SERIAL PRIMARY KEY,

    purchase_request_id INTEGER NOT NULL,

    item_id INTEGER,
    description TEXT,
    quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
    estimated_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    remarks TEXT,

    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pr_item_request
        FOREIGN KEY (purchase_request_id)
        REFERENCES purchase_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pr_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS purchase_request_documents (
    id SERIAL PRIMARY KEY,

    purchase_request_id INTEGER NOT NULL,

    file_name VARCHAR(255),
    file_path TEXT,
    file_type VARCHAR(100),
    file_size BIGINT,

    uploaded_by VARCHAR(100),
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pr_document_request
        FOREIGN KEY (purchase_request_id)
        REFERENCES purchase_requests(id)
        ON DELETE CASCADE
);

-- Purchase Request Header Indexes
CREATE INDEX IF NOT EXISTS idx_pr_entity_id
ON purchase_requests(entity_id);

CREATE INDEX IF NOT EXISTS idx_pr_vendor_id
ON purchase_requests(vendor_id);

CREATE INDEX IF NOT EXISTS idx_pr_vendor_site_id
ON purchase_requests(vendor_site_id);

CREATE INDEX IF NOT EXISTS idx_pr_item_type_id
ON purchase_requests(item_type_id);

CREATE INDEX IF NOT EXISTS idx_pr_department_id
ON purchase_requests(department_id);

CREATE INDEX IF NOT EXISTS idx_pr_subdepartment_id
ON purchase_requests(subdepartment_id);

CREATE INDEX IF NOT EXISTS idx_pr_payment_term_id
ON purchase_requests(payment_term_id);

CREATE INDEX IF NOT EXISTS idx_pr_center_id
ON purchase_requests(center_id);

CREATE INDEX IF NOT EXISTS idx_pr_status
ON purchase_requests(status);

CREATE INDEX IF NOT EXISTS idx_pr_created_date
ON purchase_requests(created_date);

CREATE INDEX IF NOT EXISTS idx_pr_required_date
ON purchase_requests(required_date);

CREATE INDEX IF NOT EXISTS idx_pr_validity_from_to
ON purchase_requests(validity_from, validity_to);


-- Purchase Request Items Indexes
CREATE INDEX IF NOT EXISTS idx_pr_items_purchase_request_id
ON purchase_request_items(purchase_request_id);

CREATE INDEX IF NOT EXISTS idx_pr_items_item_id
ON purchase_request_items(item_id);


-- Purchase Request Documents Indexes
CREATE INDEX IF NOT EXISTS idx_pr_documents_purchase_request_id
ON purchase_request_documents(purchase_request_id);

CREATE INDEX IF NOT EXISTS idx_pr_documents_uploaded_date
ON purchase_request_documents(uploaded_date);

-- ---------------------------------------------------------------------------
-- Approval workflows (scoped by entity, transaction type, subdepartment, center)
-- center_id NULL = applies to all centers (default).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS approval_workflow (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    subdepartment_id INTEGER NOT NULL,
    center_id INTEGER,
    status BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_approval_workflow_entity
        FOREIGN KEY (entity_id)
        REFERENCES entities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_approval_workflow_subdepartment
        FOREIGN KEY (subdepartment_id)
        REFERENCES subdepartments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_approval_workflow_center
        FOREIGN KEY (center_id)
        REFERENCES centers(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_approval_workflow_scope
    ON approval_workflow (
        entity_id,
        transaction_type,
        subdepartment_id,
        COALESCE(center_id, -1)
    );

CREATE INDEX IF NOT EXISTS idx_approval_workflow_lookup
    ON approval_workflow (entity_id, transaction_type, subdepartment_id);

CREATE TABLE IF NOT EXISTS approval_workflow_tier (
    id SERIAL PRIMARY KEY,
    approval_workflow_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    min_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    max_amount NUMERIC(18, 2),
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_aw_tier_approval_workflow
        FOREIGN KEY (approval_workflow_id)
        REFERENCES approval_workflow(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_approval_workflow_tier_order
    ON approval_workflow_tier (approval_workflow_id, sort_order);

CREATE TABLE IF NOT EXISTS approval_workflow_step (
    id SERIAL PRIMARY KEY,
    approval_workflow_tier_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    step_role VARCHAR(20) NOT NULL,
    created_by VARCHAR(100),
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_aw_step_approval_workflow_tier
        FOREIGN KEY (approval_workflow_tier_id)
        REFERENCES approval_workflow_tier(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_approval_workflow_step_role
        CHECK (step_role IN ('REVIEWER', 'APPROVER'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_approval_workflow_step_order
    ON approval_workflow_step (approval_workflow_tier_id, sort_order);

CREATE TABLE IF NOT EXISTS approval_workflow_step_user (
    id SERIAL PRIMARY KEY,
    approval_workflow_step_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    CONSTRAINT fk_aw_step_user_approval_workflow_step
        FOREIGN KEY (approval_workflow_step_id)
        REFERENCES approval_workflow_step(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_aw_step_user_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_approval_workflow_step_user UNIQUE (approval_workflow_step_id, user_id)
);

-- If you already created these tables with old column names, run once:
-- ALTER TABLE approval_workflow_tier RENAME COLUMN workflow_id TO approval_workflow_id;
-- ALTER TABLE approval_workflow_step RENAME COLUMN tier_id TO approval_workflow_tier_id;
-- ALTER TABLE approval_workflow_step_user RENAME COLUMN step_id TO approval_workflow_step_id;
-- Then recreate FKs/indexes if needed, or drop constraints before rename.

-- ---------------------------------------------------------------------------
-- Purchase request approval execution (sequential reviewers then approvers)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS purchase_request_approval_step (
    id SERIAL PRIMARY KEY,
    purchase_request_id INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    approval_workflow_step_id INTEGER,
    step_role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    acted_by_user_id INTEGER,
    acted_at TIMESTAMP WITHOUT TIME ZONE,
    remarks TEXT,

    CONSTRAINT fk_pr_approval_step_pr
        FOREIGN KEY (purchase_request_id)
        REFERENCES purchase_requests(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pr_approval_step_aw_step
        FOREIGN KEY (approval_workflow_step_id)
        REFERENCES approval_workflow_step(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_pr_approval_step_actor
        FOREIGN KEY (acted_by_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_pr_approval_step_role
        CHECK (step_role IN ('REVIEWER', 'APPROVER')),
    CONSTRAINT chk_pr_approval_step_status
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_pr_approval_step_pr_seq
    ON purchase_request_approval_step (purchase_request_id, sequence_order);

CREATE INDEX IF NOT EXISTS idx_pr_approval_step_pr_id
    ON purchase_request_approval_step (purchase_request_id);

CREATE TABLE IF NOT EXISTS purchase_request_approval_assignee (
    id SERIAL PRIMARY KEY,
    purchase_request_approval_step_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    CONSTRAINT fk_pr_approval_assignee_step
        FOREIGN KEY (purchase_request_approval_step_id)
        REFERENCES purchase_request_approval_step(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pr_approval_assignee_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_pr_approval_assignee_step_user
        UNIQUE (purchase_request_approval_step_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_pr_approval_assignee_step
    ON purchase_request_approval_assignee (purchase_request_approval_step_id);