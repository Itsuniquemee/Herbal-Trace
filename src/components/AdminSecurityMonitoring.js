import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  AlertTriangle,
  Eye,
  Activity,
  Users,
  Globe,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Target,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Ban,
  UserX,
  FileText,
  Key,
  Wifi,
  Server,
  Database,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Smartphone,
  Monitor
} from 'lucide-react';

const AdminSecurityMonitoring = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);

  // Mock security data
  const [securityData, setSecurityData] = useState({
    overview: {
      totalThreats: 23,
      blockedAttacks: 156,
      suspiciousLogins: 12,
      systemUptime: 99.97,
      lastIncident: '2024-01-14T15:30:00Z',
      threatLevel: 'medium'
    },
    threats: [
      {
        id: 1,
        type: 'Brute Force Attack',
        severity: 'high',
        source: '192.168.1.100',
        target: 'Login System',
        status: 'blocked',
        timestamp: '2024-01-15T14:30:00Z',
        attempts: 47,
        location: 'Russia',
        description: 'Multiple failed login attempts detected'
      },
      {
        id: 2,
        type: 'SQL Injection',
        severity: 'critical',
        source: '10.0.0.45',
        target: 'Database API',
        status: 'blocked',
        timestamp: '2024-01-15T13:45:00Z',
        attempts: 8,
        location: 'China',
        description: 'Malicious SQL queries detected in API requests'
      },
      {
        id: 3,
        type: 'Suspicious Login',
        severity: 'medium',
        source: '172.16.1.23',
        target: 'User Account',
        status: 'investigating',
        timestamp: '2024-01-15T12:15:00Z',
        attempts: 3,
        location: 'USA',
        description: 'Login from unusual location detected'
      },
      {
        id: 4,
        type: 'DDoS Attack',
        severity: 'high',
        source: 'Multiple IPs',
        target: 'Web Server',
        status: 'mitigated',
        timestamp: '2024-01-15T11:20:00Z',
        attempts: 1247,
        location: 'Various',
        description: 'Distributed denial of service attack mitigated'
      }
    ],
    auditLogs: [
      {
        id: 1,
        user: 'admin@example.com',
        action: 'User Created',
        resource: 'User Management',
        timestamp: '2024-01-15T14:35:00Z',
        ip: '192.168.1.10',
        status: 'success',
        details: 'Created new farmer account for john.doe@farm.com'
      },
      {
        id: 2,
        user: 'system',
        action: 'Security Policy Updated',
        resource: 'System Settings',
        timestamp: '2024-01-15T13:20:00Z',
        ip: 'localhost',
        status: 'success',
        details: 'Password policy changed to strong requirements'
      },
      {
        id: 3,
        user: 'processor@example.com',
        action: 'Failed Login',
        resource: 'Authentication',
        timestamp: '2024-01-15T12:45:00Z',
        ip: '10.0.0.25',
        status: 'failed',
        details: 'Invalid credentials provided'
      },
      {
        id: 4,
        user: 'admin@example.com',
        action: 'Data Export',
        resource: 'User Data',
        timestamp: '2024-01-15T11:30:00Z',
        ip: '192.168.1.10',
        status: 'success',
        details: 'Exported user analytics report'
      }
    ],
    compliance: {
      gdprCompliance: 95,
      dataRetention: 87,
      accessControls: 98,
      encryptionStatus: 100,
      auditCoverage: 92,
      lastAssessment: '2024-01-10T00:00:00Z'
    },
    riskMetrics: {
      vulnerabilities: 3,
      criticalPatches: 1,
      outdatedSystems: 2,
      weakPasswords: 8,
      unusedAccounts: 12,
      riskScore: 6.2
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'mitigated': return 'text-green-600 bg-green-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="text-red-500" size={20} />;
      case 'high': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'medium': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'low': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Activity className="text-gray-500" size={20} />;
    }
  };

  const SecurityMetricCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
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

  const ThreatCard = ({ threat }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer"
      onClick={() => setSelectedThreat(threat)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          {getSeverityIcon(threat.severity)}
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-gray-900">{threat.type}</h3>
            <p className="text-xs text-gray-500">{threat.source} → {threat.target}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(threat.severity)}`}>
            {threat.severity}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(threat.status)}`}>
            {threat.status}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{new Date(threat.timestamp).toLocaleString()}</span>
        <span>{threat.attempts} attempts</span>
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
              <Shield className="mr-3 text-blue-600" />
              Security Monitoring
            </h1>
            <p className="text-gray-600 mt-1">Monitor threats, audit logs, and compliance status</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              securityData.overview.threatLevel === 'low' ? 'bg-green-100 text-green-800' :
              securityData.overview.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <Shield size={20} />
              <span className="ml-2 font-medium">Threat Level: {securityData.overview.threatLevel}</span>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
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

        {/* Security Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
          <SecurityMetricCard
            title="Total Threats"
            value={securityData.overview.totalThreats}
            change={-12.5}
            icon={AlertTriangle}
            color="bg-red-500"
          />
          <SecurityMetricCard
            title="Blocked Attacks"
            value={securityData.overview.blockedAttacks}
            change={8.3}
            icon={Shield}
            color="bg-green-500"
          />
          <SecurityMetricCard
            title="Suspicious Logins"
            value={securityData.overview.suspiciousLogins}
            change={-5.2}
            icon={Users}
            color="bg-yellow-500"
          />
          <SecurityMetricCard
            title="System Uptime"
            value={`${securityData.overview.systemUptime}%`}
            icon={Activity}
            color="bg-blue-500"
          />
          <SecurityMetricCard
            title="Risk Score"
            value={securityData.riskMetrics.riskScore.toFixed(1)}
            change={-2.1}
            icon={Target}
            color="bg-purple-500"
          />
          <SecurityMetricCard
            title="Vulnerabilities"
            value={securityData.riskMetrics.vulnerabilities}
            change={-25.0}
            icon={Bug}
            color="bg-orange-500"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Threat Overview', icon: AlertTriangle },
                { id: 'audit', label: 'Audit Logs', icon: FileText },
                { id: 'compliance', label: 'Compliance', icon: CheckCircle },
                { id: 'risks', label: 'Risk Assessment', icon: Target }
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Threats</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search threats..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityData.threats.map(threat => (
                  <ThreatCard key={threat.id} threat={threat} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Download className="mr-2" size={16} />
                    Export
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityData.auditLogs.map((log) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(securityData.compliance).filter(([key]) => key !== 'lastAssessment').map(([key, value]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                      <div 
                        className={`absolute inset-0 rounded-full border-8 border-t-transparent ${
                          value >= 95 ? 'border-green-500' : value >= 85 ? 'border-yellow-500' : 'border-red-500'
                        }`}
                        style={{ transform: `rotate(${value * 3.6}deg)` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-900">{value}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">GDPR Compliance</p>
                      <p className="text-sm text-gray-600">Data protection regulations met</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">{securityData.compliance.gdprCompliance}%</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="text-yellow-500 mr-3" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">Data Retention</p>
                      <p className="text-sm text-gray-600">Some policies need attention</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-semibold">{securityData.compliance.dataRetention}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Vulnerabilities</h3>
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-red-600 mb-2">{securityData.riskMetrics.vulnerabilities}</p>
                <p className="text-sm text-gray-600">Critical security issues</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Weak Passwords</h3>
                  <Key className="text-yellow-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-yellow-600 mb-2">{securityData.riskMetrics.weakPasswords}</p>
                <p className="text-sm text-gray-600">Users with weak passwords</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Unused Accounts</h3>
                  <UserX className="text-gray-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-600 mb-2">{securityData.riskMetrics.unusedAccounts}</p>
                <p className="text-sm text-gray-600">Inactive user accounts</p>
              </motion.div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Critical Patches Needed</p>
                      <p className="text-sm text-gray-600">{securityData.riskMetrics.criticalPatches} security updates pending</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold">High Risk</span>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Outdated Systems</p>
                      <p className="text-sm text-gray-600">{securityData.riskMetrics.outdatedSystems} systems need updates</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-semibold">Medium Risk</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threat Detail Modal */}
        {selectedThreat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Threat Details</h2>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-gray-900">{selectedThreat.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severity</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedThreat.severity)}`}>
                      {selectedThreat.severity}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <p className="text-gray-900">{selectedThreat.source}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target</label>
                    <p className="text-gray-900">{selectedThreat.target}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{selectedThreat.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Attempts</label>
                    <p className="text-gray-900">{selectedThreat.attempts}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedThreat.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-gray-900">{new Date(selectedThreat.timestamp).toLocaleString()}</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedThreat(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Block Source
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Bug icon component (missing from lucide-react)
const Bug = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M6 13H2" />
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
    <path d="M22 13h-4" />
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
  </svg>
);

export default AdminSecurityMonitoring;