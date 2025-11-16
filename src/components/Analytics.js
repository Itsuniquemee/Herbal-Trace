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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  LineChartIcon,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

// Mock analytics data
const monthlyTrends = [
  { month: 'Jan', collections: 1200, quality: 95, farmers: 45 },
  { month: 'Feb', collections: 1900, quality: 97, farmers: 52 },
  { month: 'Mar', collections: 3000, quality: 94, farmers: 48 },
  { month: 'Apr', collections: 2800, quality: 96, farmers: 55 },
  { month: 'May', collections: 1890, quality: 98, farmers: 42 },
  { month: 'Jun', collections: 2390, quality: 95, farmers: 58 }
];

const herbTypes = [
  { name: 'Turmeric', value: 35, color: '#f59e0b' },
  { name: 'Ashwagandha', value: 25, color: '#10b981' },
  { name: 'Brahmi', value: 20, color: '#3b82f6' },
  { name: 'Neem', value: 12, color: '#8b5cf6' },
  { name: 'Others', value: 8, color: '#6b7280' }
];

const Analytics = () => {
  const [selectedChart, setSelectedChart] = useState('bar');
  const [timeRange, setTimeRange] = useState('6m');

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'line', label: 'Line Chart', icon: LineChartIcon },
    { id: 'pie', label: 'Pie Chart', icon: PieChartIcon }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
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
              <Line 
                type="monotone" 
                dataKey="collections" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={herbTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {herbTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends}>
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
              <Bar dataKey="collections" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Advanced analytics and insights for herb traceability</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="p-2 rounded-md hover:bg-accent transition-colors">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Collections', value: '12,470', change: 12.5, trend: 'up' },
          { title: 'Active Farmers', value: '342', change: 8.2, trend: 'up' },
          { title: 'Quality Score', value: '96.8%', change: -2.1, trend: 'down' },
          { title: 'Revenue', value: '₹2.4M', change: 15.3, trend: 'up' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
              {kpi.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}% from last month
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Controls */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-foreground">Chart Type:</span>
        {chartTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedChart(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedChart === type.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Collection Trends</h3>
          <button className="p-2 rounded-md hover:bg-accent transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
        <div className="h-80 w-full">
          {renderChart()}
        </div>
      </motion.div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Regions</h3>
          <div className="space-y-4">
            {[
              { region: 'Rajasthan', collections: 450, percentage: 35 },
              { region: 'Kerala', collections: 320, percentage: 25 },
              { region: 'Himachal', collections: 280, percentage: 22 },
              { region: 'Uttarakhand', collections: 150, percentage: 18 }
            ].map((item, index) => (
              <div key={item.region} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.region}</p>
                  <p className="text-sm text-muted-foreground">{item.collections} collections</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quality Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
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
                <Area 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;