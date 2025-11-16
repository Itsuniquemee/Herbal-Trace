import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Server,
  Database,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Power,
  Pause,
  Play,
  RotateCcw,
  HardDrive,
  Cpu,
  Memory,
  Network,
  Globe,
  Lock,
  Key,
  Users,
  Mail,
  Bell,
  Save,
  MoreHorizontal,
  Calendar,
  Clock,
  Zap,
  Hammer
} from 'lucide-react';

const AdminSystemControl = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('healthy');

  // Mock system data
  const [systemData, setSystemData] = useState({
    overview: {
      uptime: '99.98%',
      responseTime: '145ms',
      activeConnections: 1247,
      totalRequests: 456789,
      errorRate: '0.02%',
      lastMaintenance: '2024-01-10T02:00:00Z'
    },
    services: [
      { name: 'Web Server', status: 'running', uptime: '30d 14h', cpu: 45, memory: 67 },
      { name: 'Database', status: 'running', uptime: '30d 14h', cpu: 23, memory: 78 },
      { name: 'API Gateway', status: 'running', uptime: '30d 14h', cpu: 34, memory: 56 },
      { name: 'Authentication', status: 'running', uptime: '30d 14h', cpu: 12, memory: 34 },
      { name: 'File Storage', status: 'running', uptime: '30d 14h', cpu: 8, memory: 23 },
      { name: 'Background Jobs', status: 'warning', uptime: '2h 15m', cpu: 67, memory: 89 }
    ],
    configuration: {
      system: {
        maintenanceMode: false,
        debugMode: false,
        logLevel: 'info',
        sessionTimeout: 1800,
        maxConnections: 5000,
        backupFrequency: 'daily'
      },
      security: {
        passwordPolicy: 'strong',
        twoFactorAuth: true,
        sessionExpiry: 24,
        ipWhitelist: true,
        encryptionLevel: 'AES-256'
      },
      notifications: {
        emailAlerts: true,
        smsAlerts: false,
        webhookUrl: 'https://api.example.com/webhook',
        alertThreshold: 80
      }
    },
    maintenance: {
      scheduledTasks: [
        { id: 1, name: 'Database Backup', schedule: 'Daily 2:00 AM', lastRun: '2024-01-15T02:00:00Z', status: 'completed' },
        { id: 2, name: 'Log Rotation', schedule: 'Weekly Sunday 3:00 AM', lastRun: '2024-01-14T03:00:00Z', status: 'completed' },
        { id: 3, name: 'Cache Cleanup', schedule: 'Daily 1:00 AM', lastRun: '2024-01-15T01:00:00Z', status: 'completed' },
        { id: 4, name: 'System Update Check', schedule: 'Weekly Monday 4:00 AM', lastRun: '2024-01-15T04:00:00Z', status: 'running' }
      ],
      upcomingMaintenance: [
        { id: 1, name: 'Security Patch Update', scheduled: '2024-01-20T02:00:00Z', duration: '2 hours', impact: 'medium' },
        { id: 2, name: 'Database Migration', scheduled: '2024-01-25T01:00:00Z', duration: '4 hours', impact: 'high' }
      ]
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleServiceAction = (serviceName, action) => {
    setSystemData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.name === serviceName
          ? { ...service, status: action === 'restart' ? 'restarting' : action }
          : service
      )
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'stopped': return 'text-gray-600 bg-gray-100';
      case 'restarting': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error': return <XCircle className="text-red-500" size={20} />;
      case 'stopped': return <Pause className="text-gray-500" size={20} />;
      case 'restarting': return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      default: return <Activity className="text-gray-500" size={20} />;
    }
  };

  const ServiceCard = ({ service }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getStatusIcon(service.status)}
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
              {service.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleServiceAction(service.name, 'restart')}
            className="text-blue-600 hover:text-blue-800"
          >
            <RotateCcw size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 hover:text-gray-800"
          >
            <MoreHorizontal size={18} />
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Uptime:</span>
          <span className="font-medium text-gray-900">{service.uptime}</span>
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">CPU Usage:</span>
            <span className="font-medium text-gray-900">{service.cpu}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${service.cpu > 70 ? 'bg-red-500' : service.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${service.cpu}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">Memory Usage:</span>
            <span className="font-medium text-gray-900">{service.memory}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${service.memory > 80 ? 'bg-red-500' : service.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${service.memory}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 text-blue-600" />
              System Control
            </h1>
            <p className="text-gray-600 mt-1">Monitor and control system services and configuration</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              systemStatus === 'healthy' ? 'bg-green-100 text-green-800' :
              systemStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {systemStatus === 'healthy' ? <CheckCircle size={20} /> :
               systemStatus === 'warning' ? <AlertTriangle size={20} /> : <XCircle size={20} />}
              <span className="ml-2 font-medium">System {systemStatus}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={20} />
              Refresh
            </motion.button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{systemData.overview.uptime}</p>
              </div>
              <Activity className="text-green-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{systemData.overview.responseTime}</p>
              </div>
              <Zap className="text-blue-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connections</p>
                <p className="text-2xl font-bold text-gray-900">{systemData.overview.activeConnections.toLocaleString()}</p>
              </div>
              <Network className="text-purple-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{systemData.overview.totalRequests.toLocaleString()}</p>
              </div>
              <Server className="text-orange-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">{systemData.overview.errorRate}</p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Maintenance</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(systemData.overview.lastMaintenance).toLocaleDateString()}
                </p>
              </div>
              <Hammer className="text-gray-600" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Services', icon: Server },
                { id: 'configuration', label: 'Configuration', icon: Settings },
                { id: 'maintenance', label: 'Maintenance', icon: Hammer }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2" size={20} />
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemData.services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        )}

        {activeTab === 'configuration' && (
          <div className="space-y-6">
            {/* System Configuration */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="mr-2 text-blue-600" />
                System Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        checked={systemData.configuration.system.maintenanceMode}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Debug Mode</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        checked={systemData.configuration.system.debugMode}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Log Level</label>
                    <select 
                      value={systemData.configuration.system.logLevel}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Session Timeout (seconds)</label>
                    <input 
                      type="number" 
                      value={systemData.configuration.system.sessionTimeout}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Max Connections</label>
                    <input 
                      type="number" 
                      value={systemData.configuration.system.maxConnections}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Backup Frequency</label>
                    <select 
                      value={systemData.configuration.system.backupFrequency}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Configuration */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2 text-green-600" />
                Security Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Password Policy</label>
                    <select 
                      value={systemData.configuration.security.passwordPolicy}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="weak">Weak</option>
                      <option value="medium">Medium</option>
                      <option value="strong">Strong</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        checked={systemData.configuration.security.twoFactorAuth}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Session Expiry (hours)</label>
                    <input 
                      type="number" 
                      value={systemData.configuration.security.sessionExpiry}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">IP Whitelist</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        checked={systemData.configuration.security.ipWhitelist}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Encryption Level</label>
                    <select 
                      value={systemData.configuration.security.encryptionLevel}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="AES-128">AES-128</option>
                      <option value="AES-256">AES-256</option>
                      <option value="RSA-2048">RSA-2048</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="mr-2" size={20} />
                Save Configuration
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            {/* Scheduled Tasks */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="mr-2 text-blue-600" />
                  Scheduled Tasks
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {systemData.maintenance.scheduledTasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.schedule}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.lastRun).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Play size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Settings size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Maintenance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 text-orange-600" />
                Upcoming Maintenance
              </h2>
              <div className="space-y-4">
                {systemData.maintenance.upcomingMaintenance.map((maintenance) => (
                  <motion.div
                    key={maintenance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{maintenance.name}</h3>
                        <p className="text-sm text-gray-600">
                          Scheduled: {new Date(maintenance.scheduled).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Duration: {maintenance.duration}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(maintenance.impact)}`}>
                        {maintenance.impact} impact
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const getImpactColor = (impact) => {
  switch (impact) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default AdminSystemControl;