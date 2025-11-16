import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Link,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Cloud,
  Server,
  Wifi,
  RefreshCw,
  Download,
  Upload,
  Search,
  Eye,
  Play,
  Pause,
  Zap,
  Key,
  Bell,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

const AdminIntegrationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [modalType, setModalType] = useState('view');

  // Mock integration data
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Weather API',
      type: 'External API',
      provider: 'OpenWeatherMap',
      status: 'active',
      lastSync: '2024-01-15T14:30:00Z',
      requestsToday: 1247,
      requestsMonth: 45632,
      uptime: 99.8,
      latency: 145,
      description: 'Real-time weather data for crop monitoring',
      endpoint: 'https://api.openweathermap.org/data/2.5',
      authType: 'API Key',
      category: 'weather'
    },
    {
      id: 2,
      name: 'Payment Gateway',
      type: 'Payment Service',
      provider: 'Stripe',
      status: 'active',
      lastSync: '2024-01-15T14:25:00Z',
      requestsToday: 234,
      requestsMonth: 8965,
      uptime: 99.9,
      latency: 89,
      description: 'Secure payment processing for transactions',
      endpoint: 'https://api.stripe.com/v1',
      authType: 'OAuth 2.0',
      category: 'payment'
    },
    {
      id: 3,
      name: 'SMS Service',
      type: 'Messaging',
      provider: 'Twilio',
      status: 'warning',
      lastSync: '2024-01-15T13:45:00Z',
      requestsToday: 456,
      requestsMonth: 12378,
      uptime: 97.5,
      latency: 234,
      description: 'SMS notifications for alerts and updates',
      endpoint: 'https://api.twilio.com/2010-04-01',
      authType: 'Basic Auth',
      category: 'messaging'
    },
    {
      id: 4,
      name: 'Email Service',
      type: 'Email Provider',
      provider: 'SendGrid',
      status: 'active',
      lastSync: '2024-01-15T14:20:00Z',
      requestsToday: 789,
      requestsMonth: 23456,
      uptime: 99.7,
      latency: 123,
      description: 'Email delivery and marketing campaigns',
      endpoint: 'https://api.sendgrid.com/v3',
      authType: 'Bearer Token',
      category: 'messaging'
    },
    {
      id: 5,
      name: 'IoT Platform',
      type: 'IoT Service',
      provider: 'AWS IoT',
      status: 'inactive',
      lastSync: '2024-01-14T10:30:00Z',
      requestsToday: 0,
      requestsMonth: 5432,
      uptime: 0,
      latency: 0,
      description: 'IoT device management and data collection',
      endpoint: 'https://iot.us-east-1.amazonaws.com',
      authType: 'AWS Signature',
      category: 'iot'
    },
    {
      id: 6,
      name: 'Analytics Service',
      type: 'Analytics',
      provider: 'Google Analytics',
      status: 'active',
      lastSync: '2024-01-15T14:10:00Z',
      requestsToday: 156,
      requestsMonth: 4789,
      uptime: 99.6,
      latency: 178,
      description: 'Web analytics and user behavior tracking',
      endpoint: 'https://analyticsreporting.googleapis.com/v4',
      authType: 'OAuth 2.0',
      category: 'analytics'
    }
  ]);

  const apiMetrics = {
    totalIntegrations: 6,
    activeIntegrations: 4,
    totalRequests: 2882,
    errorRate: 0.8,
    averageLatency: 156,
    uptime: 98.9
  };

  const statuses = ['all', 'active', 'warning', 'inactive', 'error'];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleToggleStatus = (integrationId) => {
    setIntegrations(integrations.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'active' ? 'inactive' : 'active',
            uptime: integration.status === 'active' ? 0 : 99.5,
            requestsToday: integration.status === 'active' ? 0 : integration.requestsToday
          }
        : integration
    ));
  };

  const handleViewIntegration = (integration) => {
    setSelectedIntegration(integration);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditIntegration = (integration) => {
    setSelectedIntegration(integration);
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreateIntegration = () => {
    setSelectedIntegration({
      name: '',
      type: '',
      provider: '',
      status: 'inactive',
      description: '',
      endpoint: '',
      authType: 'API Key',
      category: 'other'
    });
    setModalType('create');
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'inactive': return <XCircle className="text-gray-500" size={16} />;
      case 'error': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'weather': return <Cloud className="text-blue-500" size={20} />;
      case 'payment': return <CreditCard className="text-green-500" size={20} />;
      case 'messaging': return <Bell className="text-purple-500" size={20} />;
      case 'iot': return <Wifi className="text-orange-500" size={20} />;
      case 'analytics': return <BarChart3 className="text-indigo-500" size={20} />;
      default: return <Globe className="text-gray-500" size={20} />;
    }
  };

  const IntegrationCard = ({ integration }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {getCategoryIcon(integration.category)}
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
            <p className="text-sm text-gray-600">{integration.provider}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(integration.status)}
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
            {integration.status}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Requests Today</p>
          <p className="text-lg font-semibold text-gray-900">{integration.requestsToday.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Uptime</p>
          <p className="text-lg font-semibold text-gray-900">{integration.uptime}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Latency</p>
          <p className="text-lg font-semibold text-gray-900">{integration.latency}ms</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Sync</p>
          <p className="text-sm text-gray-900">
            {new Date(integration.lastSync).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleViewIntegration(integration)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEditIntegration(integration)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <Edit size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleToggleStatus(integration.id)}
            className={integration.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
          >
            {integration.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
        >
          Test Connection
        </motion.button>
      </div>
    </motion.div>
  );

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm ml-1">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
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
              <Globe className="mr-3 text-blue-600" />
              Integration Hub
            </h1>
            <p className="text-gray-600 mt-1">Manage API connections and third-party services</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={20} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateIntegration}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Add Integration
            </motion.button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <MetricCard
            title="Total Integrations"
            value={apiMetrics.totalIntegrations}
            icon={Globe}
            color="bg-blue-500"
          />
          <MetricCard
            title="Active Services"
            value={apiMetrics.activeIntegrations}
            change={12.5}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <MetricCard
            title="Total Requests"
            value={apiMetrics.totalRequests.toLocaleString()}
            change={8.3}
            icon={Activity}
            color="bg-purple-500"
          />
          <MetricCard
            title="Error Rate"
            value={`${apiMetrics.errorRate}%`}
            change={-2.1}
            icon={AlertTriangle}
            color="bg-red-500"
          />
          <MetricCard
            title="Avg Latency"
            value={`${apiMetrics.averageLatency}ms`}
            change={-5.2}
            icon={Zap}
            color="bg-yellow-500"
          />
          <MetricCard
            title="System Uptime"
            value={`${apiMetrics.uptime}%`}
            icon={Server}
            color="bg-indigo-500"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'All Integrations', icon: Globe },
                { id: 'api-keys', label: 'API Keys', icon: Key },
                { id: 'webhooks', label: 'Webhooks', icon: Link },
                { id: 'monitoring', label: 'Monitoring', icon: Activity }
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
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {statuses.filter(s => s !== 'all').map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Download className="mr-2" size={16} />
                    Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Upload className="mr-2" size={16} />
                    Import
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </div>
        )}

        {/* Integration Modal */}
        {showModal && selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === 'create' ? 'Add Integration' : 
                   modalType === 'edit' ? 'Edit Integration' : 'Integration Details'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedIntegration.name}
                      readOnly={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input
                      type="text"
                      value={selectedIntegration.provider}
                      readOnly={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <input
                      type="text"
                      value={selectedIntegration.type}
                      readOnly={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedIntegration.status}
                      disabled={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={selectedIntegration.description}
                    readOnly={modalType === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                  <input
                    type="url"
                    value={selectedIntegration.endpoint}
                    readOnly={modalType === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auth Type</label>
                    <select
                      value={selectedIntegration.authType}
                      disabled={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="API Key">API Key</option>
                      <option value="OAuth 2.0">OAuth 2.0</option>
                      <option value="Basic Auth">Basic Auth</option>
                      <option value="Bearer Token">Bearer Token</option>
                      <option value="AWS Signature">AWS Signature</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedIntegration.category}
                      disabled={modalType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="weather">Weather</option>
                      <option value="payment">Payment</option>
                      <option value="messaging">Messaging</option>
                      <option value="iot">IoT</option>
                      <option value="analytics">Analytics</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {modalType === 'view' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requests Today</label>
                      <p className="text-gray-900">{selectedIntegration.requestsToday?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requests This Month</label>
                      <p className="text-gray-900">{selectedIntegration.requestsMonth?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uptime</label>
                      <p className="text-gray-900">{selectedIntegration.uptime}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Average Latency</label>
                      <p className="text-gray-900">{selectedIntegration.latency}ms</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </motion.button>
                  {modalType !== 'view' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {modalType === 'create' ? 'Create Integration' : 'Save Changes'}
                    </motion.button>
                  )}
                  {modalType === 'view' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Test Connection
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// CreditCard icon component (missing from lucide-react in some versions)
const CreditCard = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

export default AdminIntegrationHub;