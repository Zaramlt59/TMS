const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createSuperAdmin() {
  let connection;
  
  try {
    console.log('🔐 Creating Super Admin user...');
    
    // Database configuration (using the same config as the app)
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ttms_db',
      port: parseInt(process.env.DB_PORT || '3306')
    };
    
    console.log('📡 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');
    
    // Check if super admin already exists
    console.log('🔍 Checking for existing super admin...');
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE role = ?', 
      ['super_admin']
    );
    
    if (existingUsers.length > 0) {
      console.log('✅ Super Admin already exists!');
      console.log('📧 Username:', existingUsers[0].username);
      console.log('🎯 Role:', existingUsers[0].role);
      return;
    }
    
    // Create super admin user
    console.log('👤 Creating new super admin user...');
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      ['superadmin', 'superadmin@tms.gov.in', hashedPassword, 'super_admin', true]
    );
    
    console.log('✅ Super Admin created successfully!');
    console.log('📧 Username: superadmin');
    console.log('🔑 Password: superadmin123');
    console.log('🎯 Role: super_admin');
    console.log('⚠️  Please change the password after first login!');
    console.log('🆔 User ID:', result.insertId);
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Database table not found. Please run migrations first:');
      console.log('   npx prisma migrate dev');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Database access denied. Please check your database credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Cannot connect to database. Please make sure MySQL is running.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

createSuperAdmin();
