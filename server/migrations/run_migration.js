const { pool } = require('../db');

const MIGRATIONS = [
    // Fix missing item_id column in booking_items
    {
        label: 'booking_items: add item_id column',
        sql: "ALTER TABLE booking_items ADD COLUMN item_id VARCHAR(255) NOT NULL DEFAULT '' AFTER booking_id",
        ignoreCode: 1060, // Duplicate column name
    },
    // Add UNIQUE key needed for ON DUPLICATE KEY UPDATE in cart sync
    {
        label: 'cart_items: add UNIQUE(user_id, item_id)',
        sql: 'ALTER TABLE cart_items ADD UNIQUE uniq_user_item (user_id, item_id)',
        ignoreCode: 1061, // Duplicate key name
    },
    // Add verification columns used in auth flow
    {
        label: 'users: add is_verified column',
        sql: 'ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 1 AFTER role',
        ignoreCode: 1060,
    },
    {
        label: 'users: add verification_token column',
        sql: 'ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL AFTER is_verified',
        ignoreCode: 1060,
    },
    // Indexes for bookings
    {
        label: 'bookings: index on status',
        sql: 'CREATE INDEX idx_bookings_status ON bookings (status)',
        ignoreCode: 1061,
    },
    {
        label: 'bookings: index on return_date',
        sql: 'CREATE INDEX idx_bookings_return_date ON bookings (return_date)',
        ignoreCode: 1061,
    },
    {
        label: 'bookings: index on pickup_date',
        sql: 'CREATE INDEX idx_bookings_pickup_date ON bookings (pickup_date)',
        ignoreCode: 1061,
    },
    {
        label: 'bookings: composite index status+dates (availability query)',
        sql: 'CREATE INDEX idx_bookings_status_dates ON bookings (status, pickup_date, return_date)',
        ignoreCode: 1061,
    },
    // Indexes for booking_items
    {
        label: 'booking_items: index on item_id',
        sql: 'CREATE INDEX idx_booking_items_item_id ON booking_items (item_id)',
        ignoreCode: 1061,
    },
    // Indexes for newsletter
    {
        label: 'newsletter_subscribers: index on email',
        sql: 'CREATE INDEX idx_newsletter_email ON newsletter_subscribers (email)',
        ignoreCode: 1061,
    },
    // Index for products category filter
    {
        label: 'products: index on category',
        sql: 'CREATE INDEX idx_products_category ON products (category)',
        ignoreCode: 1061,
    },
    // Unsubscribe token for newsletter
    {
        label: 'newsletter_subscribers: add unsubscribe_token column',
        sql: 'ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribe_token VARCHAR(64) DEFAULT NULL AFTER email',
        ignoreCode: 1060,
    },
    // Backfill existing subscribers with a token
    {
        label: 'newsletter_subscribers: backfill unsubscribe tokens',
        sql: `UPDATE newsletter_subscribers SET unsubscribe_token = SUBSTRING(MD5(RAND()), 1, 32) WHERE unsubscribe_token IS NULL`,
        ignoreCode: null,
    },
];

async function runMigration() {
    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (const { label, sql, ignoreCode } of MIGRATIONS) {
        try {
            await pool.query(sql);
            console.log(`✓ ${label}`);
            success++;
        } catch (err) {
            if (err.errno === ignoreCode) {
                console.log(`- ${label} (sudah ada, dilewati)`);
                skipped++;
            } else {
                console.error(`✗ ${label}`);
                console.error(`  → ${err.message}`);
                failed++;
            }
        }
    }

    console.log(`\nSelesai: ${success} diterapkan, ${skipped} dilewati, ${failed} gagal`);
    await pool.end();
    process.exit(failed > 0 ? 1 : 0);
}

runMigration();
