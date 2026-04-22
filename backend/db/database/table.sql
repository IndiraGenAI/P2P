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