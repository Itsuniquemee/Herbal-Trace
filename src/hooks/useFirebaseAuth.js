// Firebase Authentication Hook for TraceHerbs
import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseAuthService from '../services/firebaseAuth';
import FirebaseDataService from '../services/firebaseData';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

// Create Firebase Auth Context
const FirebaseAuthContext = createContext({});

// Firebase Auth Provider Component
export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const { success, user, profile } = await FirebaseAuthService.getCurrentUser();
        
        if (success && user && profile) {
          setUser(user);
          setProfile(profile);
          setIsAuthenticated(true);
          console.log('🔐 User authenticated:', profile.email);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('🔄 Auth state changed - user signed in');
        
        try {
          const { success, profile } = await FirebaseAuthService.getCurrentUser();
          if (success && profile) {
            setUser(firebaseUser);
            setProfile(profile);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('❌ Error getting user profile:', error);
        }
      } else {
        console.log('🔄 Auth state changed - user signed out');
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (userData) => {
    setLoading(true);
    
    try {
      const result = await FirebaseAuthService.signUp(userData);
      
      if (result.success) {
        setUser(result.user);
        setProfile(result.profile);
        setIsAuthenticated(true);
        
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create account'
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    
    try {
      const result = await FirebaseAuthService.signIn(email, password);
      
      if (result.success) {
        setUser(result.user);
        setProfile(result.profile);
        setIsAuthenticated(true);
        
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    
    try {
      const result = await FirebaseAuthService.signOut();
      
      if (result.success) {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to sign out'
      };
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updateData) => {
    if (!user) {
      return {
        success: false,
        message: 'No user authenticated'
      };
    }

    try {
      const result = await FirebaseAuthService.updateProfile(user.uid, updateData);
      
      if (result.success) {
        // Refresh profile data
        const { success, profile: updatedProfile } = await FirebaseAuthService.getCurrentUser();
        if (success && updatedProfile) {
          setProfile(updatedProfile);
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update profile'
      };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    return FirebaseAuthService.resetPassword(email);
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const { success, profile: updatedProfile } = await FirebaseAuthService.getCurrentUser();
      if (success && updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('❌ Refresh user error:', error);
    }
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return profile?.role === requiredRole;
  };

  // Check if user is admin
  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  // Check if user is farmer
  const isFarmer = () => {
    return profile?.role === 'farmer';
  };

  // Check if user is processor
  const isProcessor = () => {
    return profile?.role === 'processor';
  };

  // Check if user is consumer
  const isConsumer = () => {
    return profile?.role === 'consumer';
  };

  // Context value
  const value = {
    // State
    user,
    profile,
    loading,
    isAuthenticated,
    
    // Auth functions
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    refreshUser,
    
    // Role helpers
    hasRole,
    isAdmin,
    isFarmer,
    isProcessor,
    isConsumer,
    
    // Database service access
    dataService: FirebaseDataService
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

// Custom hook to use Firebase Auth
export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  
  return context;
};

// Alias for easier migration from Supabase
export const useSupabaseAuth = useFirebaseAuth;

export default FirebaseAuthContext;