const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function fixSuperAdmin() {
  let connection;
  
  try {
    console.log('🔧 Fixing super admin user...');
    
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
    
    // First, let's add the super_admin role to the enum
    console.log('🔄 Adding super_admin role to enum...');
    try {
      await connection.execute('ALTER TABLE users MODIFY COLUMN role ENUM("super_admin", "admin", "teacher") DEFAULT "admin"');
      console.log('✅ Role enum updated successfully');
    } catch (error) {
      console.log('⚠️  Role enum update failed (might already exist):', error.message);
    }
    
    // Update the super admin user role
    console.log('👤 Updating super admin user role...');
    const [result] = await connection.execute(
      'UPDATE users SET role = ? WHERE username = ?',
      ['super_admin', 'superadmin']
    );
    
    console.log(`✅ Updated ${result.affectedRows} user(s)`);
    
    // Verify the update
    const [users] = await connection.execute('SELECT id, username, role, is_active FROM users WHERE username = ?', ['superadmin']);
    if (users.length > 0) {
      const user = users[0];
      console.log('🎯 Super admin user updated:');
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Username: ${user.username}`);
      console.log(`  - Role: ${user.role}`);
      console.log(`  - Active: ${user.is_active}`);
      
      // Test password
      const [userWithPassword] = await connection.execute('SELECT password FROM users WHERE username = ?', ['superadmin']);
      if (userWithPassword.length > 0) {
        const passwordMatch = await bcrypt.compare('superadmin123', userWithPassword[0].password);
        console.log(`🔑 Password 'superadmin123' matches: ${passwordMatch}`);
        
        if (!passwordMatch) {
          // Update password to superadmin123
          console.log('🔑 Updating password to superadmin123...');
          const hashedPassword = await bcrypt.hash('superadmin123', 10);
          await connection.execute('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'superadmin']);
          console.log('✅ Password updated successfully');
        }
      }
    }
    
    console.log('\n🎉 Super admin user is now ready!');
    console.log('📧 Username: superadmin');
    console.log('🔑 Password: superadmin123');
    console.log('🎯 Role: super_admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixSuperAdmin();
