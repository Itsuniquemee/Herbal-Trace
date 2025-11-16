import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  AlertTriangle,
  Shield,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Globe,
  Zap,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const AdminAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock data for analytics
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 1247,
      totalTransactions: 5632,
      totalRevenue: 234567,
      systemUptime: 99.8,
      trends: {
        users: 12.5,
        transactions: 8.3,
        revenue: 15.7,
        uptime: 0.2
      }
    },
    fraudDetection: {
      suspiciousActivities: 23,
      blockedTransactions: 45,
      falsePositives: 3,
      accuracyRate: 94.2,
      recentAlerts: [
        { id: 1, type: 'Multiple login attempts', user: 'john.doe@example.com', severity: 'high', time: '2 mins ago' },
        { id: 2, type: 'Unusual transaction pattern', user: 'sara.smith@example.com', severity: 'medium', time: '15 mins ago' },
        { id: 3, type: 'Geolocation anomaly', user: 'mike.wilson@example.com', severity: 'low', time: '1 hour ago' }
      ]
    },
    userEngagement: {
      activeUsers: 89.3,
      sessionDuration: 12.4,
      bounceRate: 23.1,
      conversionRate: 4.8,
      userActivity: [
        { time: '00:00', farmers: 45, processors: 23, consumers: 78, regulators: 12 },
        { time: '04:00', farmers: 32, processors: 18, consumers: 56, regulators: 8 },
        { time: '08:00', farmers: 89, processors: 45, consumers: 123, regulators: 25 },
        { time: '12:00', farmers: 156, processors: 67, consumers: 189, regulators: 34 },
        { time: '16:00', farmers: 134, processors: 58, consumers: 167, regulators: 29 },
        { time: '20:00', farmers: 98, processors: 42, consumers: 145, regulators: 21 }
      ]
    },
    systemPerformance: {
      cpuUsage: 67.5,
      memoryUsage: 82.3,
      diskUsage: 45.8,
      networkLatency: 23.4,
      apiResponseTime: 156,
      errorRate: 0.8,
      performance: [
        { metric: 'Response Time', value: 156, unit: 'ms', status: 'good' },
        { metric: 'Throughput', value: 2340, unit: 'req/s', status: 'excellent' },
        { metric: 'Error Rate', value: 0.8, unit: '%', status: 'good' },
        { metric: 'CPU Usage', value: 67.5, unit: '%', status: 'warning' },
        { metric: 'Memory Usage', value: 82.3, unit: '%', status: 'warning' },
        { metric: 'Disk Usage', value: 45.8, unit: '%', status: 'good' }
      ]
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm ml-1">{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ChartContainer = ({ title, children, actions }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
      {children}
    </div>
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
              <BarChart3 className="mr-3 text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Monitor system performance, user engagement, and security metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
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

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Users"
            value={analytics.overview.totalUsers.toLocaleString()}
            change={analytics.overview.trends.users}
            changeType="positive"
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="Transactions"
            value={analytics.overview.totalTransactions.toLocaleString()}
            change={analytics.overview.trends.transactions}
            changeType="positive"
            icon={Activity}
            color="bg-green-500"
          />
          <MetricCard
            title="Revenue"
            value={`$${(analytics.overview.totalRevenue / 1000).toFixed(0)}K`}
            change={analytics.overview.trends.revenue}
            changeType="positive"
            icon={DollarSign}
            color="bg-purple-500"
          />
          <MetricCard
            title="System Uptime"
            value={`${analytics.overview.systemUptime}%`}
            change={analytics.overview.trends.uptime}
            changeType="positive"
            icon={CheckCircle}
            color="bg-green-500"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'fraud', label: 'Fraud Detection', icon: Shield },
                { id: 'engagement', label: 'User Engagement', icon: Users },
                { id: 'performance', label: 'System Performance', icon: Zap }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMetric(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedMetric === tab.id
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

        {/* Content based on selected metric */}
        {selectedMetric === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer 
              title="User Growth Trend"
              actions={[
                <motion.button
                  key="download"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Download size={20} />
                </motion.button>
              ]}
            >
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">User Growth Chart</p>
                  <p className="text-sm text-gray-400">Interactive chart would be here</p>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Transaction Volume">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Activity className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">Transaction Volume Chart</p>
                  <p className="text-sm text-gray-400">Real-time transaction data</p>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Revenue Analytics">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <DollarSign className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">Revenue Analytics Chart</p>
                  <p className="text-sm text-gray-400">Financial performance metrics</p>
                </div>
              </div>
            </ChartContainer>

            <ChartContainer title="Geographic Distribution">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Globe className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">World Map</p>
                  <p className="text-sm text-gray-400">User distribution by location</p>
                </div>
              </div>
            </ChartContainer>
          </div>
        )}

        {selectedMetric === 'fraud' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Suspicious Activities"
                value={analytics.fraudDetection.suspiciousActivities}
                change={-5.2}
                changeType="positive"
                icon={AlertTriangle}
                color="bg-red-500"
              />
              <MetricCard
                title="Blocked Transactions"
                value={analytics.fraudDetection.blockedTransactions}
                change={-8.1}
                changeType="positive"
                icon={XCircle}
                color="bg-orange-500"
              />
              <MetricCard
                title="False Positives"
                value={analytics.fraudDetection.falsePositives}
                change={-12.3}
                changeType="positive"
                icon={Eye}
                color="bg-yellow-500"
              />
              <MetricCard
                title="Accuracy Rate"
                value={`${analytics.fraudDetection.accuracyRate}%`}
                change={2.1}
                changeType="positive"
                icon={CheckCircle}
                color="bg-green-500"
              />
            </div>

            <ChartContainer title="Recent Security Alerts">
              <div className="space-y-4">
                {analytics.fraudDetection.recentAlerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        alert.severity === 'high' ? 'bg-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{alert.type}</p>
                        <p className="text-sm text-gray-500">{alert.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ChartContainer>
          </div>
        )}

        {selectedMetric === 'engagement' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Users"
                value={`${analytics.userEngagement.activeUsers}%`}
                change={3.2}
                changeType="positive"
                icon={Users}
                color="bg-blue-500"
              />
              <MetricCard
                title="Avg Session Duration"
                value={`${analytics.userEngagement.sessionDuration}m`}
                change={1.8}
                changeType="positive"
                icon={Clock}
                color="bg-green-500"
              />
              <MetricCard
                title="Bounce Rate"
                value={`${analytics.userEngagement.bounceRate}%`}
                change={-2.1}
                changeType="positive"
                icon={TrendingDown}
                color="bg-orange-500"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${analytics.userEngagement.conversionRate}%`}
                change={0.8}
                changeType="positive"
                icon={TrendingUp}
                color="bg-purple-500"
              />
            </div>

            <ChartContainer title="User Activity by Role">
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Users className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">User Activity Chart</p>
                  <p className="text-sm text-gray-400">Activity breakdown by user roles</p>
                </div>
              </div>
            </ChartContainer>
          </div>
        )}

        {selectedMetric === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent" 
                         style={{ transform: `rotate(${analytics.systemPerformance.cpuUsage * 3.6}deg)` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">{analytics.systemPerformance.cpuUsage}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent" 
                         style={{ transform: `rotate(${analytics.systemPerformance.memoryUsage * 3.6}deg)` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">{analytics.systemPerformance.memoryUsage}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent" 
                         style={{ transform: `rotate(${analytics.systemPerformance.diskUsage * 3.6}deg)` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">{analytics.systemPerformance.diskUsage}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Disk Usage</p>
                </div>
              </div>
            </div>

            <ChartContainer title="Performance Metrics">
              <div className="space-y-4">
                {analytics.systemPerformance.performance.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        metric.status === 'excellent' ? 'bg-green-500' :
                        metric.status === 'good' ? 'bg-blue-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium text-gray-900">{metric.metric}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                      <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminAnalyticsDashboard;