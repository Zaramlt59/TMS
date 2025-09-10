const fetch = require('node-fetch');

async function testUserManagement() {
  try {
    console.log('🧪 Testing User Management API...');
    
    // First, let's login to get a fresh token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:5004/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'superadmin',
        password: 'superadmin123'
      })
    });
    
    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('❌ Login failed:', error);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('  - Token:', loginData.data.token.substring(0, 50) + '...');
    console.log('  - User:', loginData.data.user.username, loginData.data.user.role);
    
    // Now test the user management API
    console.log('\n2. Testing User Management API...');
    const userMgmtResponse = await fetch('http://localhost:5004/api/user-management', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.data.token}`
      }
    });
    
    console.log('  - Status:', userMgmtResponse.status);
    console.log('  - Status Text:', userMgmtResponse.statusText);
    
    if (userMgmtResponse.ok) {
      const userData = await userMgmtResponse.json();
      console.log('✅ User Management API working!');
      console.log('  - Users found:', userData.data.length);
    } else {
      const error = await userMgmtResponse.text();
      console.error('❌ User Management API failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUserManagement();
