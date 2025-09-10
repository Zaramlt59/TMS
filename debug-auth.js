const jwt = require('jsonwebtoken');

// Test JWT token from the logs
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkB0bXMuZ292LmluIiwiaWF0IjoxNzU3NDkyNzQ1LCJleHAiOjE3NTc0OTM2NDV9.uiuK5HsgrnTkpRZD2VHZdn_IM5qF8qCQL4aGO4MAa4k';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ JWT Token decoded successfully:');
  console.log('  - userId:', decoded.userId);
  console.log('  - username:', decoded.username);
  console.log('  - role:', decoded.role);
  console.log('  - email:', decoded.email);
  console.log('  - iat:', new Date(decoded.iat * 1000));
  console.log('  - exp:', new Date(decoded.exp * 1000));
  
  // Test the middleware logic
  console.log('\n🧪 Testing middleware logic:');
  console.log('  - req.user exists:', !!decoded);
  console.log('  - role === "admin":', decoded.role === 'admin');
  console.log('  - role === "super_admin":', decoded.role === 'super_admin');
  console.log('  - role !== "admin" && role !== "super_admin":', decoded.role !== 'admin' && decoded.role !== 'super_admin');
  console.log('  - Should pass requireAdmin:', decoded.role === 'admin' || decoded.role === 'super_admin');
  
} catch (error) {
  console.error('❌ JWT Token verification failed:', error.message);
}
