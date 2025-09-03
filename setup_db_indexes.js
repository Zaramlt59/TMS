const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ttms_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL');

    // Helper to create index if it does not exist
    async function createIndexIfMissing(table, indexName, columns) {
      const [rows] = await conn.execute(
        'SHOW INDEX FROM ' + table + ' WHERE Key_name = ?', [indexName]
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        const sql = `CREATE INDEX ${indexName} ON ${table} (${columns})`;
        await conn.execute(sql);
        console.log('Created index', indexName, 'on', table);
      } else {
        console.log('Index', indexName, 'already exists on', table);
      }
    }

    await createIndexIfMissing('schools', 'idx_schools_school_name', 'school_name');
    await createIndexIfMissing('teachers', 'idx_teachers_teacher_name', 'teacher_name');
    await createIndexIfMissing('teachers', 'idx_teachers_district_teacher_name', 'district, teacher_name');
    await createIndexIfMissing('schools', 'idx_schools_district_school_name', 'district, school_name');

    console.log('✅ Indexes created or already present');
  } catch (e) {
    console.error('❌ Failed to create indexes:', e.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

run();


