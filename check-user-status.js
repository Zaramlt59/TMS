const mysql = require('mysql2/promise');

async function checkUserStatus() {
  let connection;
  
  try {
    console.log('🔍 Checking user status...');
    
    // Database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ttms_db',
      port: parseInt(process.env.DB_PORT || '3306')
    };
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected');
    
    // Check all users and their status
    const [users] = await connection.execute(`
      SELECT id, username, email, role, is_active, created_at 
      FROM users 
      ORDER BY id
    `);
    
    console.log('📋 All users in database:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}`);
      console.log(`    Username: ${user.username}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Role: ${user.role}`);
      console.log(`    Active: ${user.is_active} (${typeof user.is_active})`);
      console.log(`    Created: ${user.created_at}`);
      console.log('    ---');
    });
    
    // Test the authentication logic
    console.log('\n🧪 Testing authentication logic:');
    const adminUser = users.find(u => u.username === 'admin');
    if (adminUser) {
      console.log(`Admin user found: ${adminUser.username}`);
      console.log(`is_active value: ${adminUser.is_active} (type: ${typeof adminUser.is_active})`);
      console.log(`!user.is_active: ${!adminUser.is_active}`);
      console.log(`user.is_active === false: ${adminUser.is_active === false}`);
      console.log(`user.is_active === 0: ${adminUser.is_active === 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUserStatus();
