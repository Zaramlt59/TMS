const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ttms_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS service_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL
      )
    `);
    console.log('✅ service_categories table ensured');

    // Add column to teachers if not exists
    const [cols] = await connection.execute(`SHOW COLUMNS FROM teachers LIKE 'service_category'`);
    if (cols.length === 0) {
      await connection.execute(`ALTER TABLE teachers ADD COLUMN service_category VARCHAR(100) NULL AFTER medium`);
      console.log('✅ Added service_category column to teachers');
    } else {
      console.log('ℹ️ service_category column already exists on teachers');
    }

    // Seed initial categories
    const initial = ['Gazetted Group A', 'Gazetted Group B', 'Non-Gazetted'];
    for (const name of initial) {
      await connection.execute(`INSERT IGNORE INTO service_categories (name, is_active) VALUES (?, true)`, [name]);
    }
    console.log('✅ Seeded initial service categories');

  } catch (e) {
    console.error('❌ Setup failed:', e.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();


