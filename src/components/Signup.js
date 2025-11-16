import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Import Firebase auth hook
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  MapPin,
  Building,
  UserPlus,
  AlertTriangle,
  Leaf
} from 'lucide-react';

const Signup = ({ onSignup, onBackToLogin, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  
  // Use Firebase auth hook
  const { signUp, loading } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'farmer',
      organization: '',
      location: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setSignupError('');
    
    if (!acceptTerms) {
      setSignupError('Please accept the terms and conditions');
      return;
    }
    
    try {
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        address: data.location ? {
          city: data.location,
          country: 'India'
        } : undefined
      };

      const { success, user, profile, error, message } = await signUp(userData);
      
      if (!success) {
        throw new Error(message || error || 'Registration failed');
      }

      // Check if approval is required
      const requiresApproval = data.role !== 'consumer';
      
      if (requiresApproval) {
        // Show approval pending message
        alert(`Registration successful! Your ${data.role} account is pending admin approval. You will be notified once approved.`);
      } else {
        // Auto-approved consumer registration
        if (onSignup) {
          onSignup({
            id: user.uid,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            role: data.role,
            avatar: null
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message) {
        setSignupError(error.message);
      } else {
        setSignupError('Network error. Please check your connection and try again.');
      }
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'processor', label: 'Processor' },
    { value: 'regulator', label: 'Regulator' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Join HerbalTrace</h1>
          <p className="text-muted-foreground">Create your account to start tracking herbs</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Account Type *</label>
              <select
                {...register('role', { required: 'Please select a role' })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name *</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name *</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email *</label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter phone number"
              />
            </div>

            {/* Organization and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Organization</label>
                <input
                  {...register('organization')}
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter organization"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <input
                  {...register('location')}
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password *</label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password *</label>
              <input
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type="password"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms and Conditions
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {signupError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{signupError}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="link-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;