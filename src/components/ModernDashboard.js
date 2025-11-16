import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  RefreshCw,
  Download
} from 'lucide-react';

// Mock data
const harvestData = [
  { month: 'Jan', volume: 1200, quality: 95 },
  { month: 'Feb', volume: 1900, quality: 97 },
  { month: 'Mar', volume: 3000, quality: 94 },
  { month: 'Apr', volume: 2800, quality: 96 },
  { month: 'May', volume: 1890, quality: 98 },
  { month: 'Jun', volume: 2390, quality: 95 }
];

const qualityTestData = [
  { name: 'Passed', value: 94, color: '#10b981' },
  { name: 'Failed', value: 6, color: '#ef4444' }
];

const regionData = [
  { region: 'Rajasthan', collections: 450 },
  { region: 'Kerala', collections: 320 },
  { region: 'Himachal', collections: 280 },
  { region: 'Uttarakhand', collections: 250 }
];

const ModernDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into your herb traceability system</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-md hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '₹2.4M', change: 12.5, trend: 'up' },
          { title: 'Active Users', value: '1,247', change: 8.2, trend: 'up' },
          { title: 'Quality Score', value: '96.8%', change: -2.1, trend: 'down' },
          { title: 'Geographic Reach', value: '15 States', change: 0, trend: 'neutral' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi.trend === 'up' ? 'text-green-600' : 
                  kpi.trend === 'down' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                   kpi.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
                   <MapPin className="h-4 w-4" />}
                  <span>{Math.abs(kpi.change)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvest Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Harvest Volume by Month</h3>
          <div className="h-80 w-full chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harvestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quality Test Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Quality Test Results</h3>
          <div className="h-80 w-full chart-container flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityTestData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qualityTestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {qualityTestData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Regional Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Regional Performance</h3>
        <div className="h-80 w-full chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                dataKey="region" 
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="collections" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernDashboard;