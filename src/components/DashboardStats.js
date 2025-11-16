import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  MapPin, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Package,
  Globe,
  Clock
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = 'primary', delay = 0 }) => {
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-500 text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <div className={`flex items-center space-x-1 text-sm ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              <TrendingUp className={`h-4 w-4 ${change < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

const QuickStats = ({ data }) => {
  const stats = [
    {
      title: 'Total Collections',
      value: data?.totalCollections || '1,247',
      change: 12.5,
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'Active Farmers',
      value: data?.activeFarmers || '342',
      change: 8.2,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Quality Tests Passed',
      value: data?.qualityTestsPassed || '98.7%',
      change: 2.1,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Geographic Coverage',
      value: data?.geographicCoverage || '15 States',
      change: 0,
      icon: MapPin,
      color: 'orange'
    },
    {
      title: 'Products Tracked',
      value: data?.productsTracked || '2,891',
      change: 15.3,
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Consumer Scans',
      value: data?.consumerScans || '45,672',
      change: 23.8,
      icon: Activity,
      color: 'blue'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'collection',
      message: 'New collection from Rajasthan region',
      time: '2 minutes ago',
      icon: Leaf,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'quality',
      message: 'Quality test completed for batch #1234',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Temperature alert in storage facility',
      time: '1 hour ago',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'scan',
      message: 'Consumer scanned product QR code',
      time: '2 hours ago',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      id: 5,
      type: 'location',
      message: 'New farmer registered from Kerala',
      time: '3 hours ago',
      icon: MapPin,
      color: 'text-purple-600'
    }
  ];

  const activitiesToShow = activities.length > 0 ? activities : defaultActivities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-4">
        {activitiesToShow.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className={`p-2 rounded-full bg-accent ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const SystemHealth = ({ healthData }) => {
  const healthMetrics = [
    {
      label: 'Blockchain Sync',
      value: healthData?.blockchainSync || 99.8,
      status: 'healthy',
      color: 'bg-green-500'
    },
    {
      label: 'API Response',
      value: healthData?.apiResponse || 98.5,
      status: 'healthy',
      color: 'bg-green-500'
    },
    {
      label: 'Database',
      value: healthData?.database || 99.2,
      status: 'healthy',
      color: 'bg-green-500'
    },
    {
      label: 'File Storage',
      value: healthData?.fileStorage || 95.8,
      status: 'warning',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">System Health</h3>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">All systems operational</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
              <span className="text-sm text-muted-foreground">{metric.value}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${metric.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DashboardStats = ({ data, healthData, activities }) => {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <QuickStats data={data} />
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} />
        <SystemHealth healthData={healthData} />
      </div>
    </div>
  );
};

export default DashboardStats;