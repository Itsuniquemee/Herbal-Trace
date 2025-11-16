// Firebase Authentication Test Script
// Run this in the browser console to test Firebase connection

console.log('🔥 Testing Firebase Authentication...');

// Test Firebase configuration
if (typeof window !== 'undefined') {
  // Check if Firebase is loaded
  import('./src/config/firebase.js').then((firebase) => {
    console.log('✅ Firebase config loaded');
    
    // Test authentication service
    import('./src/services/firebaseAuth.js').then((authService) => {
      console.log('✅ Firebase Auth service loaded');
      
      // Create a test farmer user
      const testFarmer = {
        email: 'test-farmer@traceherbs.com',
        password: 'TestFarmer123!',
        firstName: 'Test',
        lastName: 'Farmer',
        role: 'farmer',
        phone: '+1234567890'
      };
      
      console.log('🌱 Creating test farmer account...');
      
      authService.default.signUp(testFarmer)
        .then((result) => {
          if (result.success) {
            console.log('✅ Test farmer created successfully:', result);
          } else {
            console.log('⚠️ Farmer already exists or error:', result.message);
            
            // Try to sign in instead
            console.log('🔐 Trying to sign in...');
            return authService.default.signIn(testFarmer.email, testFarmer.password);
          }
        })
        .then((signInResult) => {
          if (signInResult && signInResult.success) {
            console.log('✅ Test farmer signed in successfully:', signInResult);
            console.log('🎯 User role:', signInResult.profile?.role);
          } else if (signInResult) {
            console.log('❌ Sign in failed:', signInResult.message);
          }
        })
        .catch((error) => {
          console.error('❌ Authentication test failed:', error);
        });
      
    }).catch((error) => {
      console.error('❌ Failed to load Firebase Auth service:', error);
    });
    
  }).catch((error) => {
    console.error('❌ Failed to load Firebase config:', error);
  });
} else {
  console.log('❌ This script must be run in a browser environment');
}