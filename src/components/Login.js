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
  LogIn, 
  User, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Leaf
} from 'lucide-react';

const Login = ({ onLogin, onSignupClick, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(false);
  const navigate = useNavigate();
  
  // Use Firebase auth hook
  const { signIn, loading } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      role: 'farmer'
    }
  });

  const onSubmit = async (data) => {
    setLoginError('');
    
    try {
      console.log('🚀 Attempting login with:', { email: data.email });
      
      // Use Firebase authentication
      const { success, user, profile, error, message } = await signIn(
        data.email,
        data.password
      );

      if (!success) {
        throw new Error(message || error || 'Login failed');
      }

      console.log('✅ Login successful:', { user, profile });

      const userData = {
        id: user.uid,
        name: `${profile.firstName} ${profile.lastName}`,
        email: user.email,
        role: profile.role,
        avatar: profile.profilePicture,
        permissions: getRolePermissions(profile.role)
      };
      
      if (onLogin) {
        onLogin(userData);
      }

      // Redirect to dashboard - RoleBasedRedirect component will handle role-specific routing
      console.log('🎯 Redirecting to dashboard for user:', profile.role);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Set appropriate error message
      let displayError = error.message || 'Login failed. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/invalid-credential') {
        displayError = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/user-not-found') {
        displayError = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        displayError = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        displayError = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        displayError = 'Too many failed attempts. Please try again later.';
      }
      
      setLoginError(displayError);
    }
  };

  // Define role-based permissions with enhanced features
  const getRolePermissions = (role) => {
    const permissions = {
      admin: [
        // Core Access
        'view_dashboard', 'view_profile', 'view_settings',
        // User Management
        'manage_users', 'view_all_users', 'create_users', 'delete_users',
        // Analytics & Monitoring
        'view_analytics', 'view_fraud_detection', 'view_adulteration_trends', 'ai_predictions',
        // System Control
        'manage_system', 'cybersecurity_monitoring', 'role_permissions', 'integration_management',
        // QR & Products
        'generate_qr_codes', 'manage_products', 'view_qr_scanner',
        // All other features
        'view_supply_chain', 'view_audit_trails', 'batch_approval', 'payment_integration'
      ],
      farmer: [
        // Core Access
        'view_dashboard', 'view_profile', 'view_settings',
        // Crop Management
        'upload_crop_details', 'upload_harvest_data', 'gps_tagging', 'batch_creation',
        // Documentation
        'upload_organic_certificate', 'upload_soil_tests', 'upload_supporting_docs',
        // Supply Chain Visibility
        'track_produce_journey', 'view_supply_chain', 'view_qr_scanner',
        // Feedback & Incentives
        'receive_feedback', 'view_quality_ratings', 'transparency_credits'
      ],
      consumer: [
        // Core Access
        'view_dashboard', 'view_profile', 'view_settings',
        // Product Verification
        'scan_qr_codes', 'view_product_journey', 'check_authenticity', 'verify_certifications',
        // Comparison & Rating
        'compare_products', 'purity_scores', 'traceability_index', 'rate_products', 'write_reviews',
        // Fraud Reporting
        'report_fake_products', 'report_adulteration', 'consumer_portal'
      ],
      processor: [
        // Core Access
        'view_dashboard', 'view_profile', 'view_settings',
        // Batch Management
        'receive_raw_materials', 'scan_farmer_qr', 'blockchain_verification',
        // Processing Operations
        'record_processing_steps', 'washing_records', 'drying_records', 'extraction_records', 'packaging_records',
        // Quality Control
        'upload_quality_tests', 'upload_lab_certificates', 'quality_assurance',
        // QR Generation
        'generate_product_qr', 'chain_of_custody', 'batch_tracking', 'view_analytics'
      ],
      regulator: [
        // Core Access
        'view_dashboard', 'view_profile', 'view_settings',
        // Real-time Monitoring
        'real_time_dashboard', 'supply_chain_monitoring', 'movement_tracking',
        // Audit & Compliance
        'view_audit_trails', 'certification_verification', 'organic_verification', 'ayush_verification', 'gmp_verification',
        // Alerts & Detection
        'adulteration_alerts', 'mismatch_detection', 'automated_alerts',
        // Batch Management
        'batch_approval', 'batch_rejection', 'pre_market_verification',
        // Reporting
        'regulatory_reports', 'compliance_analytics'
      ]
    };
    return permissions[role] || [];
  };

  const roleOptions = [
    { 
      value: 'farmer', 
      label: 'Farmer', 
      icon: User,
      description: 'Upload crop details, organic certificates, track produce journey, get quality feedback',
      features: ['Crop Upload', 'GPS Tagging', 'Organic Certificates', 'Supply Chain Tracking']
    },
    { 
      value: 'processor', 
      label: 'Processor', 
      icon: Shield,
      description: 'Receive batches, record processing steps, upload quality reports, generate QR codes',
      features: ['Batch Processing', 'Quality Tests', 'Chain of Custody', 'QR Generation']
    },
    { 
      value: 'regulator', 
      label: 'Regulator', 
      icon: Shield,
      description: 'Real-time monitoring, audit trails, automated alerts, batch approval system',
      features: ['Live Dashboard', 'Audit Trails', 'Batch Approval', 'Fraud Detection']
    },
    { 
      value: 'consumer', 
      label: 'Consumer', 
      icon: User,
      description: 'Scan QR codes, check authenticity, compare products, report fake items',
      features: ['QR Scanning', 'Product Verification', 'Quality Rating', 'Fraud Reporting']
    },
    { 
      value: 'admin', 
      label: 'Admin', 
      icon: Shield,
      description: 'User management, analytics dashboard, AI predictions, cybersecurity monitoring',
      features: ['User Management', 'AI Analytics', 'System Control', 'Security Monitoring']
    }
  ];

  const demoAccounts = [
    { email: 'admin@traceherbss.com', password: 'Admin123!', role: 'admin', name: 'Admin User' },
    { email: 'farmer@traceherbss.com', password: 'Farmer123!', role: 'farmer', name: 'Demo Farmer' },
    { email: 'consumer@traceherbss.com', password: 'Consumer123!', role: 'consumer', name: 'Demo Consumer' },
    { email: 'processor@traceherbss.com', password: 'Processor123!', role: 'processor', name: 'Demo Processor' },
    { email: 'regulator@traceherbss.com', password: 'Regulator123!', role: 'regulator', name: 'Demo Regulator' }
  ];

  const handleDemoLogin = (account) => {
    reset({
      email: account.email,
      password: account.password,
      role: account.role
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">HerbalTrace</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label htmlFor="role-select" className="text-sm font-medium text-foreground">Role</label>
              <select
                id="role-select"
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
              
              {/* Role Description */}
              <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                {roleOptions.find(r => r.value === register('role').defaultValue || 'farmer') && (
                  <div>
                    <p className="text-sm text-foreground mb-2">
                      {roleOptions.find(r => r.value === register('role').defaultValue || 'farmer')?.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {roleOptions.find(r => r.value === register('role').defaultValue || 'farmer')?.features.map((feature, idx) => (
                        <span 
                          key={`feature-${idx}`}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isRememberMe}
                  onChange={(e) => setIsRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm link-primary hover:underline bg-transparent border-none p-0">
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{loginError}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account)}
                  className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/signup')}
                className="link-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Phone Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Or{' '}
              <button 
                type="button"
                onClick={() => navigate('/phone-login')}
                className="text-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
              >
                Login with Phone OTP
              </button>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Secure</h3>
            <p className="text-sm text-muted-foreground">End-to-end encryption</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Traceable</h3>
            <p className="text-sm text-muted-foreground">Complete supply chain</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Verified</h3>
            <p className="text-sm text-muted-foreground">Quality assured</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;