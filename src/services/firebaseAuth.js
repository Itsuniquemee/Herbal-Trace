// Firebase Authentication Service for TraceHerbs
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

class FirebaseAuthService {
  
  // Sign up with email and password
  static async signUp(userData) {
    try {
      const { email, password, firstName, lastName, role = 'farmer', phone } = userData;
      
      console.log('🔐 Creating Firebase user account...');
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user profile in Firestore
      const profileData = {
        id: user.uid,
        userId: user.uid,
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role,
        phone: phone || '',
        profilePicture: '',
        address: {},
        isActive: true,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'profiles', user.uid), profileData);
      
      // Create role-specific profile if farmer
      if (role === 'farmer') {
        const farmerProfileData = {
          userId: user.uid,
          farmName: '',
          farmSizeAcres: 0,
          primaryCrops: [],
          organicCertified: false,
          organicCertNumber: '',
          farmLocation: {},
          yearsExperience: 0,
          farmingMethods: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'farmerProfiles', user.uid), farmerProfileData);
      }
      
      console.log('✅ User account created successfully');
      toast.success('Account created! Please verify your email.');
      
      return {
        success: true,
        user: user,
        profile: profileData,
        message: 'Account created successfully! Please check your email for verification.'
      };
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      console.log('🔐 Signing in user...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Wait a bit for Firebase Auth to propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user profile from Firestore with better error handling
      const profileRef = doc(db, 'profiles', user.uid);
      let profileDoc;
      
      try {
        profileDoc = await getDoc(profileRef);
      } catch (firestoreError) {
        console.warn('⚠️ Firestore access error, creating profile...', firestoreError.message);
        // If Firestore access fails, create a default profile
        profileDoc = null;
      }

      // Auto-create profile for users added directly from Firebase console or if access failed
      if (!profileDoc || !profileDoc.exists()) {
        console.warn('⚠️ User profile missing, provisioning default profile...');
        
        const defaultProfile = {
          id: user.uid,
          userId: user.uid,
          email: user.email || '',
          firstName: user.displayName?.split(' ')[0] || 'Trace',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || 'Farmer',
          role: 'farmer',
          phone: user.phoneNumber || '',
          profilePicture: user.photoURL || '',
          address: {},
          isActive: true,
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        try {
          await setDoc(profileRef, defaultProfile);

          // Ensure farmer specific profile exists for default farmers
          await setDoc(doc(db, 'farmerProfiles', user.uid), {
            userId: user.uid,
            farmName: '',
            farmSizeAcres: 0,
            primaryCrops: [],
            organicCertified: false,
            organicCertNumber: '',
            farmLocation: {},
            yearsExperience: 0,
            farmingMethods: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });

          // Re-fetch the profile
          profileDoc = await getDoc(profileRef);
        } catch (createError) {
          console.error('❌ Failed to create profile:', createError);
          // Return success anyway with a basic profile
          return {
            success: true,
            user: user,
            profile: defaultProfile,
            message: 'Sign in successful (profile created locally)'
          };
        }
      }

      const profile = profileDoc?.data() || {};
      
      console.log('✅ Sign in successful');
      toast.success(`Welcome back, ${profile.firstName || 'User'}!`);
      
      return {
        success: true,
        user: user,
        profile: profile,
        message: 'Sign in successful'
      };
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.message && error.message.includes('permissions')) {
        errorMessage = 'Database permissions issue. Please try again or contact support.';
      }
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // Sign out current user
  static async signOut() {
    try {
      await signOut(auth);
      console.log('✅ User signed out successfully');
      toast.success('Signed out successfully');
      
      return {
        success: true,
        message: 'Signed out successfully'
      };
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
      toast.error('Failed to sign out');
      
      return {
        success: false,
        error: error.code,
        message: 'Failed to sign out'
      };
    }
  }

  // Get current user and profile
  static async getCurrentUser() {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        return {
          success: false,
          user: null,
          profile: null,
          message: 'No user authenticated'
        };
      }
      
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      
      if (!profileDoc.exists()) {
        return {
          success: false,
          user: user,
          profile: null,
          message: 'User profile not found'
        };
      }
      
      const profile = profileDoc.data();
      
      return {
        success: true,
        user: user,
        profile: profile,
        message: 'User authenticated'
      };
      
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return {
        success: false,
        user: null,
        profile: null,
        message: 'Failed to get current user'
      };
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const profileRef = doc(db, 'profiles', userId);
      
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(profileRef, dataToUpdate);
      
      console.log('✅ Profile updated successfully');
      toast.success('Profile updated successfully');
      
      return {
        success: true,
        message: 'Profile updated successfully'
      };
      
    } catch (error) {
      console.error('❌ Update profile error:', error);
      toast.error('Failed to update profile');
      
      return {
        success: false,
        error: error.code,
        message: 'Failed to update profile'
      };
    }
  }

  // Send password reset email
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      
      console.log('✅ Password reset email sent');
      toast.success('Password reset email sent! Check your inbox.');
      
      return {
        success: true,
        message: 'Password reset email sent'
      };
      
    } catch (error) {
      console.error('❌ Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  // Listen to authentication state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
}

export default FirebaseAuthService;