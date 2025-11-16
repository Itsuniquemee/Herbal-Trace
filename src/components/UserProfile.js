import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Camera,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Calendar,
  Award,
  Activity
} from 'lucide-react';

const UserProfile = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      organization: user?.organization || '',
      location: user?.location || '',
      bio: user?.bio || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        location: data.location,
        bio: data.bio
      };

      if (onUpdate) {
        onUpdate(updatedUser);
      }

      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'farmer':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'processor':
        return <Building className="h-5 w-5 text-blue-500" />;
      case 'regulator':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'consumer':
        return <User className="h-5 w-5 text-orange-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'farmer':
        return 'bg-green-100 text-green-800';
      case 'processor':
        return 'bg-blue-100 text-blue-800';
      case 'regulator':
        return 'bg-purple-100 text-purple-800';
      case 'consumer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { label: 'Collections', value: '24', icon: Leaf },
    { label: 'Quality Score', value: '98%', icon: Award },
    { label: 'Days Active', value: '45', icon: Calendar },
    { label: 'Total Scans', value: '1,247', icon: Activity }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-primary-foreground" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {getRoleIcon(user?.role)}
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {updateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-6"
          >
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">{updateSuccess}</span>
          </motion.div>
        )}

        {updateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6"
          >
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">{updateError}</span>
          </motion.div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              disabled={!isEditing}
              type="email"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input
                {...register('phone')}
                disabled={!isEditing}
                type="tel"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Organization</label>
              <input
                {...register('organization')}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter organization"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <input
              {...register('location')}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter location"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              {...register('bio')}
              disabled={!isEditing}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Tell us about yourself..."
            />
          </div>
        </form>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors">
            Change Password
          </button>
          <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors">
            Download Data
          </button>
          <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors">
            Privacy Settings
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;