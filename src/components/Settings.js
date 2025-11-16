import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Smartphone,
  Palette,
  Monitor,
  Save,
  Eye,
  EyeOff,
  Key,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    profile: {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@traceherbss.com',
      phone: '+91 98765 43210',
      designation: 'System Administrator',
      avatar: null
    },
    // Security Settings
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: true,
      sessionTimeout: 30
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyReports: true,
      systemAlerts: true,
      marketingEmails: false
    },
    // Application Settings
    application: {
      theme: 'light',
      language: 'english',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR'
    },
    // Data Settings
    data: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: 365,
      exportFormat: 'json'
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'application', label: 'Application', icon: SettingsIcon },
    { id: 'data', label: 'Data & Backup', icon: Database }
  ];

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Change Avatar
          </button>
          <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Designation</label>
          <input
            type="text"
            value={settings.profile.designation}
            onChange={(e) => handleSettingChange('profile', 'designation', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Change Password</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={settings.security.currentPassword}
                onChange={(e) => handleSettingChange('security', 'currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-background text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={settings.security.newPassword}
              onChange={(e) => handleSettingChange('security', 'newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={settings.security.confirmPassword}
              onChange={(e) => handleSettingChange('security', 'confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Enable 2FA</p>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorEnabled}
              onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Session Management</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={480}>8 hours</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {[
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
        { key: 'systemAlerts', label: 'System Alerts', desc: 'Receive critical system alerts' },
        { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive product updates and news' }
      ].map((notification) => (
        <div key={notification.key} className="flex items-center justify-between py-4 border-b border-border">
          <div>
            <p className="font-medium text-foreground">{notification.label}</p>
            <p className="text-sm text-muted-foreground">{notification.desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications[notification.key]}
              onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderApplicationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
          <select
            value={settings.application.theme}
            onChange={(e) => handleSettingChange('application', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Language</label>
          <select
            value={settings.application.language}
            onChange={(e) => handleSettingChange('application', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="marathi">Marathi</option>
            <option value="gujarati">Gujarati</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
          <select
            value={settings.application.timezone}
            onChange={(e) => handleSettingChange('application', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
          <select
            value={settings.application.dateFormat}
            onChange={(e) => handleSettingChange('application', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
          <select
            value={settings.application.currency}
            onChange={(e) => handleSettingChange('application', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <RefreshCw className="h-5 w-5" />
          <span>Backup Settings</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Automatic Backup</p>
              <p className="text-sm text-muted-foreground">Automatically backup your data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.data.autoBackup}
                onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Backup Frequency</label>
            <select
              value={settings.data.backupFrequency}
              onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              disabled={!settings.data.autoBackup}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Retention (days)</label>
            <input
              type="number"
              value={settings.data.dataRetention}
              onChange={(e) => handleSettingChange('data', 'dataRetention', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              min="30"
              max="3650"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Export Format</label>
            <select
              value={settings.data.exportFormat}
              onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Create Backup</span>
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-sm text-red-700 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Delete All Data
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'security': return renderSecurityTab();
      case 'notifications': return renderNotificationsTab();
      case 'application': return renderApplicationTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;