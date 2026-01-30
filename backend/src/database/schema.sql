-- Database Schema for Widget-as-a-Service
-- SQLite Database

PRAGMA foreign_keys = ON;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    roles TEXT NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: tenants
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    owner_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- Table: specialists
-- ============================================
CREATE TABLE IF NOT EXISTS specialists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    user_id TEXT,
    tenant_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- ============================================
-- Table: services
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    duration INTEGER NOT NULL CHECK (duration > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    tenant_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- ============================================
-- Table: service_specialists (Join Table)
-- ============================================
CREATE TABLE IF NOT EXISTS service_specialists (
    service_id TEXT NOT NULL,
    specialist_id TEXT NOT NULL,
    PRIMARY KEY (service_id, specialist_id),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON DELETE CASCADE
);

-- ============================================
-- Table: appointments
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'canceled', 'completed')),
    comment TEXT,
    user_id TEXT NOT NULL,
    specialist_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    tenant_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- ============================================
-- Table: working_hours
-- ============================================
CREATE TABLE IF NOT EXISTS working_hours (
    id TEXT PRIMARY KEY,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    specialist_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE (specialist_id, day_of_week)
);

-- ============================================
-- Table: exceptions
-- ============================================
CREATE TABLE IF NOT EXISTS exceptions (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    reason TEXT NOT NULL,
    specialist_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialist_id) REFERENCES specialists(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- ============================================
-- Indexes for better query performance
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Tenants indexes
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON tenants(owner_id);

-- Specialists indexes
CREATE INDEX IF NOT EXISTS idx_specialists_user_id ON specialists(user_id);
CREATE INDEX IF NOT EXISTS idx_specialists_tenant_id ON specialists(tenant_id);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_specialist_id ON appointments(specialist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Working hours indexes
CREATE INDEX IF NOT EXISTS idx_working_hours_specialist_id ON working_hours(specialist_id);
CREATE INDEX IF NOT EXISTS idx_working_hours_tenant_id ON working_hours(tenant_id);
CREATE INDEX IF NOT EXISTS idx_working_hours_day_of_week ON working_hours(day_of_week);

-- Exceptions indexes
CREATE INDEX IF NOT EXISTS idx_exceptions_specialist_id ON exceptions(specialist_id);
CREATE INDEX IF NOT EXISTS idx_exceptions_tenant_id ON exceptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_exceptions_date ON exceptions(date);
