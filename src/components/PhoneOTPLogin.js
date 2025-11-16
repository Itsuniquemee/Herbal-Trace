import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Import Firebase phone authentication
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import FirebaseAuthService from '../services/firebaseAuth';
import { 
  Phone, 
  MessageSquare, 
  Shield,
  ArrowLeft,
  Leaf
} from 'lucide-react';
import toast from 'react-hot-toast';

const PhoneOTPLogin = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const { register: registerPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors } } = useForm();
  const { register: registerOTP, handleSubmit: handleOTPSubmit, formState: { errors: otpErrors } } = useForm();

  // Initialize reCAPTCHA for Firebase phone auth
  React.useEffect(() => {
    const initializeRecaptcha = async () => {
      if (!window.recaptchaVerifier) {
        try {
          console.log('🔧 Initializing reCAPTCHA...');
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
              console.log('✅ reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('⚠️ reCAPTCHA expired');
              toast.error('Security check expired. Please try again.');
            }
          });
          console.log('✅ reCAPTCHA initialized successfully');
        } catch (error) {
          console.error('❌ reCAPTCHA setup error:', error);
          toast.error('Security verification setup failed. Please refresh the page.');
        }
      }
    };

    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
          console.log('🧹 reCAPTCHA cleaned up');
        } catch (error) {
          console.error('❌ reCAPTCHA cleanup error:', error);
        }
      }
    };
  }, []);

  const sendOTP = async (data) => {
    setIsLoading(true);
    try {
      const formattedPhone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`;
      console.log('📱 Sending OTP to:', formattedPhone);

      // Ensure reCAPTCHA is ready
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      // Firebase Phone Authentication
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      
      setConfirmationResult(confirmationResult);
      setPhoneNumber(formattedPhone);
      setStep('otp');
      toast.success('OTP sent successfully! Check your SMS.');
      
    } catch (error) {
      console.error('OTP send error:', error);
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data) => {
    setIsLoading(true);
    try {
      console.log('🔐 Verifying OTP for:', phoneNumber);

      if (!confirmationResult) {
        throw new Error('No confirmation result found');
      }

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(data.otp);
      const user = result.user;

      console.log('✅ OTP verified successfully');

      // Create/update user profile
      const profileData = {
        id: user.uid,
        userId: user.uid,
        email: user.email || `${phoneNumber.replace('+91', '')}@phone.temp`,
        firstName: 'Farmer',
        lastName: 'User',
        role: 'farmer',
        phone: phoneNumber,
        emailVerified: false,
        isActive: true
      };

      await FirebaseAuthService.updateProfile(user.uid, profileData);

      toast.success('Login successful!');
      console.log('🎯 Redirecting to farmer dashboard');
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);

    } catch (error) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'Failed to verify OTP';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP expired. Please request a new one.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToEmail = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Phone Login
          </h1>
          <p className="text-gray-600">
            {step === 'phone' ? 'Enter your mobile number' : 'Enter OTP sent to your phone'}
          </p>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handlePhoneSubmit(sendOTP)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  {...registerPhone('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+91|91)?[6789]\d{9}$/,
                      message: 'Enter a valid Indian mobile number'
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              {phoneErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{phoneErrors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 btn-primary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send OTP
                </div>
              )}
            </button>
          </motion.form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleOTPSubmit(verifyOTP)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  {...registerOTP('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Enter a valid 6-digit OTP'
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-wider"
                  placeholder="000000"
                  maxLength="6"
                />
              </div>
              {otpErrors.otp && (
                <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>
              )}
              
              <div className="text-center mt-2">
                <p className="text-sm text-gray-600">
                  OTP sent to <span className="font-medium">{phoneNumber}</span>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 btn-primary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Verify OTP
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
            >
              ← Change phone number
            </button>
          </motion.form>
        )}

        {/* Back to Email Login */}
        <div className="mt-6 text-center">
          <button
            onClick={goBackToEmail}
            className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Use Email Login Instead
          </button>
        </div>

        {/* reCAPTCHA Container */}
        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
};

export default PhoneOTPLogin;