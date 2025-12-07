import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Enhanced Authentication Service with OTP and Security Features
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Create axios instance for auth requests
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'An error occurred';
    if (error.response?.status !== 401) { // Don't show toast for auth errors
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

class EnhancedAuthService {
  
  /**
   * Register new user with email verification
   */
  static async register(userData) {
    try {
      const response = await authAPI.post('/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'farmer',
        phone: userData.phone || ''
      });

      toast.success('Registration initiated! Please check your email for verification.');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
        details: error.response?.data?.details || []
      };
    }
  }

  /**
   * Verify email with OTP
   */
  static async verifyEmail(email, otp) {
    try {
      const response = await authAPI.post('/verify-email', {
        identifier: email,
        otp: otp,
        method: 'email'
      });

      toast.success('Email verified successfully!');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Email verification failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Email verification failed'
      };
    }
  }

  /**
   * Login with email and password
   */
  static async login(email, password) {
    try {
      const response = await authAPI.post('/login', {
        email,
        password
      });

      const { user, tokens, sessionId } = response.data.data;

      // Store tokens and user data
      localStorage.setItem('herbalTrace_accessToken', tokens.accessToken);
      localStorage.setItem('herbalTrace_refreshToken', tokens.refreshToken);
      localStorage.setItem('herbalTrace_user', JSON.stringify(user));
      localStorage.setItem('herbalTrace_sessionId', sessionId);

      toast.success(`Welcome back, ${user.firstName}!`);
      
      return {
        success: true,
        user,
        tokens,
        sessionId
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
        code: error.response?.data?.code
      };
    }
  }

  /**
   * Send OTP via email or SMS
   */
  static async sendOTP(identifier, method = 'email', purpose = 'authentication') {
    try {
      const response = await authAPI.post('/send-otp', {
        identifier,
        method,
        purpose
      });

      const methodText = method === 'email' ? 'email' : 'phone';
      toast.success(`OTP sent to your ${methodText}!`);
      
      return {
        success: true,
        message: response.data.message,
        expiresIn: response.data.data.expiresIn
      };
    } catch (error) {
      console.error('OTP sending failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(identifier, otp, method = 'email', purpose = 'authentication') {
    try {
      const response = await authAPI.post('/verify-otp', {
        identifier,
        otp,
        method,
        purpose
      });

      toast.success('OTP verified successfully!');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('OTP verification failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'OTP verification failed'
      };
    }
  }

  /**
   * Login with OTP (passwordless)
   */
  static async loginWithOTP(identifier, otp, method = 'email') {
    try {
      // First verify OTP
      const otpResult = await this.verifyOTP(identifier, otp, method, 'authentication');
      
      if (!otpResult.success) {
        return otpResult;
      }

      // Then perform login (in real implementation, backend would handle this)
      // For now, we'll simulate a successful OTP login
      const mockUser = {
        id: 'user_otp_123',
        email: method === 'email' ? identifier : 'user@example.com',
        phone: method === 'sms' ? identifier : '',
        firstName: 'OTP',
        lastName: 'User',
        role: 'farmer',
        verified: true,
        loginMethod: 'OTP'
      };

      // Mock tokens (in real implementation, these would come from backend)
      const tokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: '15m'
      };

      // Store authentication data
      localStorage.setItem('herbalTrace_accessToken', tokens.accessToken);
      localStorage.setItem('herbalTrace_refreshToken', tokens.refreshToken);
      localStorage.setItem('herbalTrace_user', JSON.stringify(mockUser));
      localStorage.setItem('herbalTrace_sessionId', 'otp_session_' + Date.now());

      toast.success('Login successful!');
      
      return {
        success: true,
        user: mockUser,
        tokens,
        loginMethod: 'OTP'
      };
    } catch (error) {
      console.error('OTP login failed:', error);
      return {
        success: false,
        error: 'OTP login failed'
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('herbalTrace_refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.post('/refresh-token', {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;

      // Update stored tokens
      localStorage.setItem('herbalTrace_accessToken', accessToken);
      localStorage.setItem('herbalTrace_refreshToken', newRefreshToken);

      return {
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear invalid tokens
      this.logout();
      
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  /**
   * Logout user
   */
  static async logout() {
    try {
      await authAPI.post('/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API fails
    }

    // Clear local storage
    localStorage.removeItem('herbalTrace_accessToken');
    localStorage.removeItem('herbalTrace_refreshToken');
    localStorage.removeItem('herbalTrace_user');
    localStorage.removeItem('herbalTrace_sessionId');

    toast.success('Logged out successfully!');
    
    return { success: true };
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('herbalTrace_user');
      const accessToken = localStorage.getItem('herbalTrace_accessToken');
      
      if (userStr && accessToken) {
        return {
          success: true,
          user: JSON.parse(userStr),
          token: accessToken
        };
      }
      
      return {
        success: false,
        error: 'No user session found'
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      return {
        success: false,
        error: 'Invalid session data'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    const accessToken = localStorage.getItem('herbalTrace_accessToken');
    return !!accessToken;
  }

  /**
   * Get user profile from server
   */
  static async getProfile() {
    try {
      const token = localStorage.getItem('herbalTrace_accessToken');
      
      if (!token) {
        throw new Error('No access token');
      }

      const response = await authAPI.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        success: true,
        user: response.data.data.user
      };
    } catch (error) {
      console.error('Failed to get profile:', error);
      
      if (error.response?.status === 401) {
        // Try to refresh token
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          // Retry with new token
          return this.getProfile();
        } else {
          this.logout();
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get profile'
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('herbalTrace_accessToken');
      
      if (!token) {
        throw new Error('No access token');
      }

      const response = await authAPI.put('/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('herbalTrace_user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data.user };
      localStorage.setItem('herbalTrace_user', JSON.stringify(updatedUser));

      toast.success('Profile updated successfully!');
      
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      };
    }
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('herbalTrace_accessToken');
      
      if (!token) {
        throw new Error('No access token');
      }

      await authAPI.post('/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Password changed successfully!');
      
      return { success: true };
    } catch (error) {
      console.error('Password change failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Password change failed'
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email) {
    try {
      await authAPI.post('/forgot-password', { email });
      
      toast.success('Password reset instructions sent to your email!');
      
      return { success: true };
    } catch (error) {
      console.error('Password reset request failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to request password reset'
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token, newPassword) {
    try {
      await authAPI.post('/reset-password', {
        token,
        newPassword
      });

      toast.success('Password reset successfully!');
      
      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Password reset failed'
      };
    }
  }
}

export default EnhancedAuthService;