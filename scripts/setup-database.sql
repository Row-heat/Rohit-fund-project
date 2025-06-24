-- MongoDB is NoSQL, but here are the equivalent SQL commands for reference
-- This shows the structure we're implementing in MongoDB

-- Users table equivalent
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Saved funds table equivalent  
CREATE TABLE IF NOT EXISTS saved_funds (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    scheme_code VARCHAR(255) NOT NULL,
    scheme_name TEXT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_fund (user_id, scheme_code)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_saved_funds_user_id ON saved_funds(user_id);
CREATE INDEX idx_saved_funds_scheme_code ON saved_funds(scheme_code);
