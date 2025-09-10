const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Create a fresh token for super admin
const payload = {
  userId: 2,
  username: 'superadmin',
  role: 'super_admin',
  email: 'superadmin@tms.gov.in'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

console.log('🔑 Fresh JWT Token created:');
console.log(token);
console.log('\n📋 Token details:');
console.log('  - userId:', payload.userId);
console.log('  - username:', payload.username);
console.log('  - role:', payload.role);
console.log('  - email:', payload.email);
console.log('  - expires in: 1 hour');

console.log('\n🧪 Test the token:');
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token is valid');
  console.log('  - role === "super_admin":', decoded.role === 'super_admin');
  console.log('  - Should pass requireAdmin:', decoded.role === 'admin' || decoded.role === 'super_admin');
} catch (error) {
  console.error('❌ Token verification failed:', error.message);
}
