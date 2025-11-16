// Firebase Connection Test for TraceHerbs
// Run this in your browser console after updating firebase config

import { auth, db } from './src/config/firebase.js';

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...');
  console.log('====================================');
  
  try {
    // Test Firebase Auth
    console.log('📱 Auth Instance:', auth ? '✅ Connected' : '❌ Failed');
    
    // Test Firestore
    console.log('💾 Firestore Instance:', db ? '✅ Connected' : '❌ Failed');
    
    // Test if we can access Firestore (will fail if config is wrong)
    const { collection, getDocs } = await import('firebase/firestore');
    const testCollection = collection(db, 'profiles');
    
    console.log('🔍 Testing Firestore Access...');
    await getDocs(testCollection);
    console.log('✅ Firestore Access: Working');
    
    console.log('====================================');
    console.log('🎉 Firebase Connection Successful!');
    console.log('✅ Your app is ready to use Firebase!');
    
  } catch (error) {
    console.error('❌ Firebase Connection Failed:', error.message);
    console.error('🔧 Check your firebase.js config file');
  }
}

// Run the test
testFirebaseConnection();