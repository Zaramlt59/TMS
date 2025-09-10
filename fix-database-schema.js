const mysql = require('mysql2/promise');

async function fixDatabaseSchema() {
  let connection;
  
  try {
    console.log('🔧 Fixing database schema to add super_admin role...');
    
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
    
    // Update the user_role enum to include super_admin
    console.log('🔄 Updating user_role enum...');
    await connection.execute(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('super_admin', 'admin', 'teacher') 
      DEFAULT 'admin'
    `);
    console.log('✅ User role enum updated successfully');
    
    // Verify the update
    console.log('🔍 Verifying the update...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role'
    `, [dbConfig.database]);
    
    if (columns.length > 0) {
      console.log('✅ Role column type:', columns[0].COLUMN_TYPE);
    }
    
    // Check if super admin user exists and update its role
    console.log('👤 Checking super admin user...');
    const [users] = await connection.execute(
      'SELECT id, username, role FROM users WHERE username = ?', 
      ['superadmin']
    );
    
    if (users.length > 0) {
      const user = users[0];
      console.log(`Found user: ${user.username}, current role: ${user.role}`);
      
      if (user.role !== 'super_admin') {
        console.log('🔄 Updating super admin user role...');
        await connection.execute(
          'UPDATE users SET role = ? WHERE username = ?',
          ['super_admin', 'superadmin']
        );
        console.log('✅ Super admin user role updated');
      } else {
        console.log('✅ Super admin user already has correct role');
      }
    } else {
      console.log('❌ Super admin user not found');
    }
    
    console.log('\n🎉 Database schema fixed successfully!');
    console.log('📧 You can now login with:');
    console.log('   Username: superadmin');
    console.log('   Password: superadmin123');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixDatabaseSchema();
