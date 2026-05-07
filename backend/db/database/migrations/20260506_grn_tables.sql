-- GRN (Goods Received Note) — mirrors rate_contracts + approval execution.
-- Run after rate_contracts / approval_workflow tables exist.

CREATE TABLE IF NOT EXISTS grns (
    id SERIAL PRIMARY KEY,
    grn_number VARCHAR(50) UNIQUE,
    rate_contract_id INTEGER,
    invoice_no VARCHAR(100),
    invoice_date DATE,
    entity_id INTEGER,
    vendor_id INTEGER,
    vendor_site_id INTEGER,
    shipping_vendor_site_id INTEGER,
    billing_vendor_site_id INTEGER,
    shipping_address TEXT,
    billing_address TEXT,
    currency_id INTEGER,
    item_type_id INTEGER,
    validity_from DATE,
    validity_to DATE,
    required_date DATE,
    frequency VARCHAR(50),
    department_id INTEGER,
    subdepartment_id INTEGER,
    payment_term_id INTEGER,
    terms_condition_id INTEGER,
    overall_summary TEXT,
    total_base_amount NUMERIC(12,2) DEFAULT 0,
    net_amount NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grn_rc FOREIGN KEY (rate_contract_id) REFERENCES rate_contracts(id) ON DELETE SET NULL,
    CONSTRAINT fk_grn_entity FOREIGN KEY (entity_id) REFERENCES entities(id),
    CONSTRAINT fk_grn_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    CONSTRAINT fk_grn_vendor_site FOREIGN KEY (vendor_site_id) REFERENCES vendor_sites(id),
    CONSTRAINT fk_grn_ship_site FOREIGN KEY (shipping_vendor_site_id) REFERENCES vendor_sites(id),
    CONSTRAINT fk_grn_bill_site FOREIGN KEY (billing_vendor_site_id) REFERENCES vendor_sites(id),
    CONSTRAINT fk_grn_currency FOREIGN KEY (currency_id) REFERENCES currencies(id),
    CONSTRAINT fk_grn_item_type FOREIGN KEY (item_type_id) REFERENCES item_types(id),
    CONSTRAINT fk_grn_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_grn_subdepartment FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id),
    CONSTRAINT fk_grn_payment_term FOREIGN KEY (payment_term_id) REFERENCES payment_terms(id),
    CONSTRAINT fk_grn_terms FOREIGN KEY (terms_condition_id) REFERENCES terms_and_conditions(id)
);

CREATE TABLE IF NOT EXISTS grn_items (
    id SERIAL PRIMARY KEY,
    grn_id INTEGER NOT NULL,
    item_id INTEGER,
    description TEXT,
    center_id INTEGER NOT NULL,
    quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
    rate NUMERIC(12,2) NOT NULL DEFAULT 0,
    base_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    remarks TEXT,
    created_by VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grn_item_grn FOREIGN KEY (grn_id) REFERENCES grns(id) ON DELETE CASCADE,
    CONSTRAINT fk_grn_item_item FOREIGN KEY (item_id) REFERENCES items(id),
    CONSTRAINT fk_grn_item_center FOREIGN KEY (center_id) REFERENCES centers(id)
);

CREATE TABLE IF NOT EXISTS grn_documents (
    id SERIAL PRIMARY KEY,
    grn_id INTEGER NOT NULL,
    file_name VARCHAR(255),
    file_path TEXT,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_by VARCHAR(100),
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grn_document_grn FOREIGN KEY (grn_id) REFERENCES grns(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grn_approval_step (
    id SERIAL PRIMARY KEY,
    grn_id INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    approval_workflow_step_id INTEGER,
    step_role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    acted_by_user_id INTEGER,
    acted_at TIMESTAMP WITHOUT TIME ZONE,
    remarks TEXT,
    CONSTRAINT fk_grn_approval_step_grn FOREIGN KEY (grn_id) REFERENCES grns(id) ON DELETE CASCADE,
    CONSTRAINT fk_grn_approval_step_aw_step FOREIGN KEY (approval_workflow_step_id) REFERENCES approval_workflow_step(id) ON DELETE SET NULL,
    CONSTRAINT fk_grn_approval_step_actor FOREIGN KEY (acted_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_grn_approval_step_role CHECK (step_role IN ('REVIEWER', 'APPROVER')),
    CONSTRAINT chk_grn_approval_step_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_grn_approval_step_grn_seq
    ON grn_approval_step (grn_id, sequence_order);

CREATE INDEX IF NOT EXISTS idx_grn_approval_step_grn_id ON grn_approval_step (grn_id);

CREATE TABLE IF NOT EXISTS grn_approval_assignee (
    id SERIAL PRIMARY KEY,
    grn_approval_step_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_grn_approval_assignee_step FOREIGN KEY (grn_approval_step_id) REFERENCES grn_approval_step(id) ON DELETE CASCADE,
    CONSTRAINT fk_grn_approval_assignee_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_grn_approval_assignee_step_user UNIQUE (grn_approval_step_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_grn_approval_assignee_step ON grn_approval_assignee (grn_approval_step_id);

CREATE INDEX IF NOT EXISTS idx_grn_entity_id ON grns(entity_id);
CREATE INDEX IF NOT EXISTS idx_grn_vendor_id ON grns(vendor_id);
CREATE INDEX IF NOT EXISTS idx_grn_status ON grns(status);
CREATE INDEX IF NOT EXISTS idx_grn_rc_id ON grns(rate_contract_id);
CREATE INDEX IF NOT EXISTS idx_grn_items_grn_id ON grn_items(grn_id);
CREATE INDEX IF NOT EXISTS idx_grn_docs_grn_id ON grn_documents(grn_id);
