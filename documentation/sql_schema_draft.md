# SQL Schema Draft, version at scope of Scenario 1

This is a draft of the SQL schema for the project, based on the database diagram:

![DB Diagram v1](/documentation/DB%20diagram%20v1.png)

PostgresSQL dialect is used, with some assumptions about the data types and constraints.
```sql
/* ---------- ENUM TYPES ---------- */
CREATE TYPE purchase_reminder_rule_type AS ENUM (
'on_specific_datetime',
'target_price'
);

CREATE TYPE notification_channel AS ENUM (
'email',
'push'
);

CREATE TYPE reminder_status AS ENUM (
'active',
'triggered'
);

/* ---------- CORE TABLES ---------- */

/* User */
CREATE TABLE users (
user_id        SERIAL PRIMARY KEY,
name           TEXT        NOT NULL,
email          TEXT        NOT NULL UNIQUE,
created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* Merchant (supported site) */
CREATE TABLE merchant (
merchant_id         SERIAL PRIMARY KEY,
is_scraping_enabled BOOLEAN      NOT NULL DEFAULT TRUE,
domain_names        TEXT[]       NOT NULL        -- list of accepted hostnames
);

/* Product being tracked (logical item) */
CREATE TABLE product_tracking (
product_id   SERIAL PRIMARY KEY,
user_id      INT          NOT NULL
REFERENCES users(user_id) ON DELETE CASCADE,
product_name TEXT         NOT NULL,
created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

/* Concrete URL for that product at a merchant */
CREATE TABLE product_url (
url_id      SERIAL PRIMARY KEY,
product_id  INT   NOT NULL
REFERENCES product_tracking(product_id) ON DELETE CASCADE,
merchant_id INT   NOT NULL
REFERENCES merchant(merchant_id),
url_link    TEXT  NOT NULL,
UNIQUE (url_link)              -- prevent duplicates
);

/* Reminder settings for the product */
CREATE TABLE product_reminder_setting (
reminder_id          SERIAL PRIMARY KEY,
product_id           INT    NOT NULL
REFERENCES product_tracking(product_id) ON DELETE CASCADE,
rule_type            purchase_reminder_rule_type NOT NULL,
valid_from           TIMESTAMPTZ,
valid_to             TIMESTAMPTZ,
notification_channel notification_channel        NOT NULL,
target_price         NUMERIC(12,2),
target_date          TIMESTAMPTZ,
reminder_status      reminder_status             NOT NULL DEFAULT 'active'
);

/* Out‑going notification instances */
CREATE TABLE notification_log (
notification_id SERIAL PRIMARY KEY,
reminder_id     INT    NOT NULL
REFERENCES product_reminder_setting(reminder_id)
ON DELETE CASCADE,
sent_at         TIMESTAMPTZ NOT NULL,
channel         notification_channel NOT NULL,
read_at         TIMESTAMPTZ
);

/* ---------- HELPFUL INDEXES ---------- */
-- Find all active reminders for a user quickly
CREATE INDEX idx_reminder_user_active
ON product_reminder_setting (product_id, reminder_status)
INCLUDE (rule_type, notification_channel, target_price, target_date);

-- Fast lookup of URL during add flow
CREATE INDEX idx_product_url_link
ON product_url (url_link);
```