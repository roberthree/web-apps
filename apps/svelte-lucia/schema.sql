DROP TABLE IF EXISTS auth_user;
CREATE TABLE IF NOT EXISTS auth_user (id TEXT PRIMARY KEY, email TEXT);

DROP TABLE IF EXISTS auth_key;
CREATE TABLE IF NOT EXISTS auth_key (id TEXT PRIMARY KEY, user_id TEXT, hashed_password TEXT);

DROP TABLE IF EXISTS auth_session;
CREATE TABLE IF NOT EXISTS auth_session (id TEXT PRIMARY KEY, user_id TEXT, active_expires INTEGER, idle_expires INTEGER);

DROP TABLE IF EXISTS auth_pass_token;
CREATE TABLE IF NOT EXISTS auth_pass_token (id TEXT PRIMARY KEY, user_id TEXT, expires INTEGER);

DROP TABLE IF EXISTS auth_pass_code;
CREATE TABLE IF NOT EXISTS auth_pass_code (id TEXT PRIMARY KEY, user_id TEXT, expires INTEGER, code TEXT);
