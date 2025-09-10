const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function checkSuperAdmin() {
  let connection;
  
  try {
    console.log('🔍 Checking super admin user...');
    
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
    
    // Check all users
    const [allUsers] = await connection.execute('SELECT id, username, email, role, is_active FROM users');
    console.log('📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Active: ${user.is_active}`);
    });
    
    // Check super admin specifically
    const [superAdmins] = await connection.execute('SELECT * FROM users WHERE role = ?', ['super_admin']);
    console.log(`\n🎯 Super admin users found: ${superAdmins.length}`);
    
    if (superAdmins.length > 0) {
      const superAdmin = superAdmins[0];
      console.log('👤 Super admin details:');
      console.log(`  - ID: ${superAdmin.id}`);
      console.log(`  - Username: ${superAdmin.username}`);
      console.log(`  - Email: ${superAdmin.email}`);
      console.log(`  - Role: ${superAdmin.role}`);
      console.log(`  - Active: ${superAdmin.is_active}`);
      console.log(`  - Password hash: ${superAdmin.password.substring(0, 20)}...`);
      
      // Test password
      const passwordMatch = await bcrypt.compare('superadmin123', superAdmin.password);
      console.log(`🔑 Password 'superadmin123' matches: ${passwordMatch}`);
      
      if (!passwordMatch) {
        console.log('🔑 Testing other common passwords...');
        const testPasswords = ['password', 'admin', 'superadmin', '123456'];
        for (const pwd of testPasswords) {
          const match = await bcrypt.compare(pwd, superAdmin.password);
          if (match) {
            console.log(`✅ Password found: '${pwd}'`);
            break;
          }
        }
      }
    } else {
      console.log('❌ No super admin user found!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkSuperAdmin();
