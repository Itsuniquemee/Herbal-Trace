import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
  import { 
  Menu, 
  X, 
  Home, 
  Leaf, 
  Users, 
  BarChart3, 
  MapPin, 
  QrCode, 
  Settings, 
  Bell, 
  Sun, 
  Moon,
  LogOut,
  User,
  Shield,
  AlertTriangle,
  FileText,
  Camera,
  Maximize,
  Minimize,
  Upload,
  Download,
  Eye,
  Activity,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Zap,
  Database,
  TrendingUp,
  Award,
  Globe,
  Lock,
  RefreshCw,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toggleFullscreen, isFullscreen, onFullscreenChange, fixMobileViewport } from '../utils/fullscreen';

const MainLayout = ({ children, currentPage, onPageChange, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const getAppPath = (subPath = '') => {
    if (!subPath) return '/app';
    const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
    return `/app${normalized}`;
  };

  // Load notifications only once on mount
  useEffect(() => {
    const loadNotifications = () => {
      const storedNotifications = localStorage.getItem('herbaltrace_notifications');
      if (storedNotifications) {
        try {
          const parsed = JSON.parse(storedNotifications);
          setNotifications(parsed);
        } catch (error) {
          console.error('Error parsing stored notifications:', error);
          setNotifications([]);
        }
      } else {
        // Only show initial mock notifications on first load
        const initialNotifications = [
          { id: 1, type: 'warning', message: 'Quality test failed for batch #1234', time: '2 min ago', read: false, timestamp: Date.now() },
          { id: 2, type: 'info', message: 'New collection from Rajasthan region', time: '15 min ago', read: false, timestamp: Date.now() - 15 * 60 * 1000 },
          { id: 3, type: 'success', message: 'Recall simulation completed successfully', time: '1 hour ago', read: false, timestamp: Date.now() - 60 * 60 * 1000 }
        ];
        setNotifications(initialNotifications);
        localStorage.setItem('herbaltrace_notifications', JSON.stringify(initialNotifications));
      }
    };

    loadNotifications();
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('herbaltrace_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Functions to handle notifications
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown') && !event.target.closest('.notifications-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Setup fullscreen change listener
    const cleanup = onFullscreenChange(() => {
      setIsFullscreenMode(isFullscreen());
    });

    // Mobile viewport fixes
    const mobileCleanup = fixMobileViewport();

    // Handle window resize
    const handleResize = () => {
      const desktopBreakpoint = window.innerWidth >= 1024;
      setIsDesktop(desktopBreakpoint);
      
      // On desktop, sidebar should be open by default
      // On mobile, close sidebar if it was open
      if (desktopBreakpoint && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (!desktopBreakpoint && sidebarOpen) {
        // Only close if we're switching from desktop to mobile
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      cleanup();
      mobileCleanup();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Define all navigation items with comprehensive role-based features
  const allNavigationItems = [
    // Core Navigation
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: getAppPath('main-dashboard'), roles: ['admin', 'farmer', 'consumer', 'processor', 'regulator'] },
    
    // Farmer-specific features
    { id: 'crop-upload', label: 'Upload Crop Details', icon: Upload, path: getAppPath('farmer/crop-upload'), roles: ['farmer'] },
    { id: 'harvest-data', label: 'Harvest Records', icon: Leaf, path: getAppPath('farmer/harvest-data'), roles: ['farmer'] },
    { id: 'farm-documents', label: 'Farm Documents', icon: FileText, path: getAppPath('farmer/documents'), roles: ['farmer'] },
    { id: 'supply-tracking', label: 'Track My Produce', icon: TrendingUp, path: getAppPath('farmer/supply-tracking'), roles: ['farmer'] },
    { id: 'quality-feedback', label: 'Quality Feedback', icon: MessageSquare, path: getAppPath('farmer/feedback'), roles: ['farmer'] },
    { id: 'transparency-credits', label: 'Transparency Credits', icon: Award, path: getAppPath('farmer/credits'), roles: ['farmer'] },
    { id: 'farmer-generate-qr', label: 'Generate QR Codes', icon: QrCode, path: getAppPath('farmer/generate-qr'), roles: ['farmer'] },
    
    // Processor-specific features
    { id: 'batch-receiving', label: 'Receive Batches', icon: Package, path: getAppPath('processor/receive-batches'), roles: ['processor'] },
    { id: 'processing-steps', label: 'Processing Records', icon: Activity, path: getAppPath('processor/processing-steps'), roles: ['processor'] },
    { id: 'quality-tests', label: 'Quality Tests', icon: CheckCircle, path: getAppPath('processor/quality-tests'), roles: ['processor'] },
    { id: 'generate-qr', label: 'Generate QR Codes', icon: QrCode, path: getAppPath('processor/generate-qr'), roles: ['processor'] },
    { id: 'chain-custody', label: 'Chain of Custody', icon: Shield, path: getAppPath('processor/chain-custody'), roles: ['processor'] },
    
    // Regulator-specific features
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Eye, path: getAppPath('regulator/live-monitoring'), roles: ['regulator'] },
    { id: 'audit-trails', label: 'Audit Trails', icon: Search, path: getAppPath('regulator/audit-trails'), roles: ['regulator'] },
    { id: 'batch-approval', label: 'Batch Approval', icon: CheckCircle, path: getAppPath('regulator/batch-approval'), roles: ['regulator'] },
    { id: 'fraud-alerts', label: 'Fraud Detection', icon: AlertTriangle, path: getAppPath('regulator/fraud-alerts'), roles: ['regulator'] },
    { id: 'certification-verify', label: 'Verify Certifications', icon: Award, path: getAppPath('regulator/certifications'), roles: ['regulator'] },
    
    // Consumer-specific features
    { id: 'product-scanner', label: 'Scan Products', icon: Camera, path: getAppPath('consumer/scanner'), roles: ['consumer'] },
    { id: 'product-comparison', label: 'Compare Products', icon: BarChart3, path: getAppPath('consumer/compare'), roles: ['consumer'] },
    { id: 'authenticity-check', label: 'Authenticity Check', icon: Shield, path: getAppPath('consumer/authenticity'), roles: ['consumer'] },
    { id: 'product-reviews', label: 'Reviews & Ratings', icon: Star, path: getAppPath('consumer/reviews'), roles: ['consumer'] },
    { id: 'fraud-reporting', label: 'Report Fraud', icon: XCircle, path: getAppPath('consumer/report-fraud'), roles: ['consumer'] },
    
    // Admin-specific features
    { id: 'user-management', label: 'User Management', icon: Users, path: getAppPath('admin/users'), roles: ['admin'] },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: Clock, path: getAppPath('admin/pending-approvals'), roles: ['admin'] },
    { id: 'analytics-dashboard', label: 'Analytics Dashboard', icon: BarChart3, path: getAppPath('admin/analytics'), roles: ['admin'] },
    { id: 'ai-predictions', label: 'AI Predictions', icon: Zap, path: getAppPath('admin/ai-predictions'), roles: ['admin'] },
    { id: 'system-control', label: 'System Control', icon: Settings, path: getAppPath('admin/system'), roles: ['admin'] },
    { id: 'cybersecurity', label: 'Security Monitoring', icon: Lock, path: getAppPath('admin/security'), roles: ['admin'] },
    { id: 'integration-hub', label: 'Integration Hub', icon: Globe, path: getAppPath('admin/integrations'), roles: ['admin'] },
    
    // Shared features
    { id: 'qr-scanner', label: 'QR Scanner', icon: Camera, path: getAppPath('qr-scanner'), roles: ['admin', 'farmer', 'consumer', 'processor'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: getAppPath('analytics'), roles: ['admin', 'processor', 'regulator'] },
    { id: 'reports', label: 'Reports', icon: FileText, path: getAppPath('reports'), roles: ['admin', 'processor', 'regulator'] },
    { id: 'recall', label: 'Recall Simulation', icon: AlertTriangle, path: getAppPath('recall'), roles: ['admin', 'regulator'] },
    
    // Universal features
    { id: 'profile', label: 'Profile', icon: User, path: getAppPath('profile'), roles: ['admin', 'farmer', 'consumer', 'processor', 'regulator'] },
    { id: 'settings', label: 'Settings', icon: Settings, path: getAppPath('settings'), roles: ['admin', 'farmer', 'consumer', 'processor', 'regulator'] }
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => 
    item.roles.includes(user?.role || 'consumer')
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'success': return <Leaf className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const sidebarVariants = React.useMemo(() => ({
    open: { 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: isDesktop ? 0 : "-100%", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  }), [isDesktop]);

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background flex w-full overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Sidebar */}
      <motion.aside
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex flex-col",
          "bg-white dark:bg-gray-900 border-r border-emerald-100 dark:border-gray-700",
          "shadow-2xl backdrop-blur-md",
          "lg:relative lg:translate-x-0",
          !sidebarOpen && "lg:w-16"
        )}
        style={{
          background: darkMode 
            ? 'linear-gradient(145deg, #111827 0%, #1f2937 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Enhanced Brand/Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-emerald-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  HerbalTrace
                </span>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Supply Chain Tracking
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Core Navigation */}
            <div className="space-y-1 mb-8">
              <h3 className="px-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
                Core Features
              </h3>
              {navigationItems
                .filter(item => ['dashboard', 'qr-scanner', 'analytics', 'reports'].includes(item.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path ||
                                   (item.id === 'dashboard' && location.pathname === '/app');
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        if (!isDesktop) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                          : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                        isActive ? "text-white" : "group-hover:scale-110"
                      )} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      )}
                    </motion.button>
                  );
                })}
            </div>

            {/* Role-specific sections */}
            {user?.role && (
              <div className="space-y-1 mb-8">
                <div className="flex items-center space-x-2 px-4 mb-3">
                  <div className="h-1 w-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {user.role === 'farmer' && '🌱 Farm Management'}
                    {user.role === 'processor' && '⚙️ Processing'}
                    {user.role === 'regulator' && '🏛️ Regulatory'}
                    {user.role === 'consumer' && '🛒 Consumer Tools'}
                    {user.role === 'admin' && '👑 Administration'}
                  </h3>
                </div>
                {navigationItems
                  .filter(item => !['dashboard', 'qr-scanner', 'analytics', 'reports', 'profile', 'settings', 'recall'].includes(item.id))
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate(item.path);
                          if (!isDesktop) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                            : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300"
                        )}
                      >
                        <Icon className={cn(
                          "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                          isActive ? "text-white" : "group-hover:scale-110"
                        )} />
                        <span className="font-medium text-sm">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                        )}
                      </motion.button>
                    );
                  })}
              </div>
            )}

            {/* System & Settings */}
            <div className="space-y-1 pt-4 border-t border-emerald-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 px-4 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ⚙️ System & Settings
                </h3>
              </div>
              {navigationItems
                .filter(item => ['recall', 'profile', 'settings'].includes(item.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        if (!isDesktop) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                        isActive ? "text-white" : "group-hover:scale-110"
                      )} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      )}
                    </motion.button>
                  );
                })}
            </div>
          </nav>

          {/* Enhanced User section */}
          <div className="border-t border-emerald-100 dark:border-gray-700 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg ring-2 ring-emerald-100 dark:ring-emerald-800">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize font-semibold bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  {user?.role || 'Farmer'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Enhanced Top bar */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 border-b border-emerald-200 dark:border-gray-700 shadow-lg backdrop-blur-md">
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center space-x-6">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Menu className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              </button>
              
              {/* Page title with breadcrumb style */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <Leaf className="h-5 w-5" />
                  <span className="text-sm font-medium">TraceHerbs</span>
                  <span className="text-emerald-300 dark:text-gray-500">/</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
            {navigationItems.find(item => item.path === location.pathname)?.label || 
             navigationItems.find(item => item.id === 'dashboard')?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search button */}
              <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-all duration-200">
                <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Search...</span>
              </button>

              {/* Notifications with enhanced design */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="notifications-button p-3 rounded-xl hover:bg-emerald-100 dark:hover:bg-gray-700 relative transition-all duration-200 group"
                >
                  <Bell className="h-5 w-5 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Fullscreen toggle with better styling */}
              <button
                onClick={() => toggleFullscreen()}
                className="p-3 rounded-xl hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                title={isFullscreenMode ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreenMode ? (
                  <Minimize className="h-5 w-5 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <Maximize className="h-5 w-5 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                )}
              </button>

              {/* Dark mode toggle with sun/moon animation */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <div className="relative">
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-amber-500 group-hover:rotate-180 transition-all duration-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-emerald-700 dark:text-emerald-400 group-hover:-rotate-12 transition-all duration-300" />
                  )}
                </div>
              </button>

              {/* Enhanced User profile section */}
              <div className="flex items-center space-x-3 pl-3 border-l border-emerald-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg ring-2 ring-emerald-100 dark:ring-emerald-800 group-hover:ring-emerald-200 dark:group-hover:ring-emerald-700 transition-all duration-200">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                      {user?.role || 'Farmer'}
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="h-6 w-px bg-emerald-200 dark:bg-gray-600 mx-2"></div>
                    <button
                      onClick={onLogout}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full max-w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Enhanced Notifications dropdown */}
      <AnimatePresence>
        {showNotifications && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="notifications-dropdown fixed top-24 right-6 w-96 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-gray-600 rounded-2xl shadow-2xl z-50 backdrop-blur-md"
            style={{
              background: darkMode 
                ? 'linear-gradient(145deg, #1f2937 0%, #111827 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
            }}
          >
            <div className="p-6 border-b border-emerald-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-xl hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border-b border-emerald-100 dark:border-gray-700 last:border-b-0 hover:bg-emerald-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      notification.type === 'success' && "bg-green-100 dark:bg-green-900/30",
                      notification.type === 'warning' && "bg-yellow-100 dark:bg-yellow-900/30",
                      notification.type === 'info' && "bg-blue-100 dark:bg-blue-900/30",
                      notification.type === 'error' && "bg-red-100 dark:bg-red-900/30"
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{notification.message}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-gray-600 transition-colors duration-200"
                          title="Mark as read"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
                        title="Remove"
                      >
                        <X className="h-3 w-3 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-emerald-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-b-2xl">
              <button
                onClick={() => {
                  setNotifications([]);
                  setShowNotifications(false);
                }}
                className="w-full text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200 py-2"
              >
                🗑️ Clear all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;