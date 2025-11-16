// Simple signup test - Create a farmer account for testing
// This creates test users directly in Firebase

async function createTestUsers() {
  try {
    console.log('🔥 Creating test users...');
    
    // Import Firebase Auth
    const { signUp } = await import('./src/hooks/useFirebaseAuth.js');
    
    const testUsers = [
      {
        email: 'farmer@test.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Farmer',
        role: 'farmer',
        phone: '+1234567890'
      },
      {
        email: 'admin@test.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        phone: '+1987654321'
      }
    ];
    
    for (const userData of testUsers) {
      console.log(`Creating ${userData.role}: ${userData.email}`);
      
      try {
        const result = await signUp(userData);
        if (result.success) {
          console.log(`✅ Created ${userData.role} successfully`);
        } else {
          console.log(`⚠️ ${userData.role} may already exist: ${result.message}`);
        }
      } catch (error) {
        console.log(`❌ Error creating ${userData.role}:`, error.message);
      }
    }
    
    console.log('✅ Test user creation complete!');
    console.log('🎯 You can now try logging in with:');
    console.log('   - farmer@test.com / Test123!');
    console.log('   - admin@test.com / Admin123!');
    
  } catch (error) {
    console.error('❌ Failed to create test users:', error);
  }
}

// Auto-run when script loads
if (typeof window !== 'undefined') {
  createTestUsers();
}