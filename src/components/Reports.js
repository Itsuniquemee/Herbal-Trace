import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  Search,
  Eye,
  TrendingUp,
  BarChart3,
  Users,
  Package
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedType, setSelectedType] = useState('all');

  const reports = [
    {
      id: 1,
      title: 'Monthly Collection Summary',
      description: 'Complete overview of herb collections for the current month',
      type: 'collection',
      period: 'monthly',
      generatedDate: '2024-09-20',
      status: 'ready',
      fileSize: '2.3 MB'
    },
    {
      id: 2,
      title: 'Farmer Performance Report',
      description: 'Analysis of individual farmer performance and contributions',
      type: 'farmer',
      period: 'quarterly',
      generatedDate: '2024-09-15',
      status: 'ready',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Quality Assessment Report',
      description: 'Quality metrics and test results across all collections',
      type: 'quality',
      period: 'weekly',
      generatedDate: '2024-09-22',
      status: 'processing',
      fileSize: '3.1 MB'
    },
    {
      id: 4,
      title: 'Regional Analysis',
      description: 'Geographic distribution and regional performance analysis',
      type: 'regional',
      period: 'monthly',
      generatedDate: '2024-09-18',
      status: 'ready',
      fileSize: '4.2 MB'
    },
    {
      id: 5,
      title: 'Consumer Engagement Report',
      description: 'Consumer scanning patterns and engagement metrics',
      type: 'consumer',
      period: 'monthly',
      generatedDate: '2024-09-19',
      status: 'ready',
      fileSize: '1.5 MB'
    }
  ];

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'collection', label: 'Collection Reports' },
    { value: 'farmer', label: 'Farmer Reports' },
    { value: 'quality', label: 'Quality Reports' },
    { value: 'regional', label: 'Regional Reports' },
    { value: 'consumer', label: 'Consumer Reports' }
  ];

  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const filteredReports = reports.filter(report => {
    const typeMatch = selectedType === 'all' || report.type === selectedType;
    const periodMatch = selectedPeriod === 'all' || report.period === selectedPeriod;
    return typeMatch && periodMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'collection': return Package;
      case 'farmer': return Users;
      case 'quality': return BarChart3;
      case 'regional': return TrendingUp;
      case 'consumer': return Eye;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and download comprehensive reports</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Generate New Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Reports', value: '47', icon: FileText, color: 'bg-blue-500' },
          { title: 'Ready to Download', value: '12', icon: Download, color: 'bg-green-500' },
          { title: 'Processing', value: '3', icon: TrendingUp, color: 'bg-yellow-500' },
          { title: 'This Month', value: '8', icon: Calendar, color: 'bg-purple-500' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground min-w-[150px]"
          >
            {reportTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground min-w-[120px]"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground min-w-[250px]"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report, index) => {
          const TypeIcon = getTypeIcon(report.type);
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TypeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Generated: {new Date(report.generatedDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">Size: {report.fileSize}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 rounded-md hover:bg-accent transition-colors"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className={`p-2 rounded-md transition-colors ${
                      report.status === 'ready' 
                        ? 'hover:bg-accent text-foreground' 
                        : 'text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={report.status !== 'ready'}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No reports found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or generate a new report</p>
        </div>
      )}
    </div>
  );
};

export default Reports;