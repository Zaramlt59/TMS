// Simple MySQL connection test using mysql2/promise
const mysql = require('mysql2/promise')
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') })

;(async () => {
  let conn
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ttms_db',
      port: Number(process.env.DB_PORT || 3306)
    }
    conn = await mysql.createConnection(config)
    const [rows] = await conn.execute('SELECT 1 AS ok')
    console.log('MySQL OK:', rows)
    process.exit(0)
  } catch (e) {
    console.error('MySQL ERROR:', e.message)
    process.exit(1)
  } finally {
    if (conn) await conn.end()
  }
})()


