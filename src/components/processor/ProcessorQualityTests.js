import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Award,
  Eye,
  Download,
  Search,
  Filter,
  Plus,
  Calendar,
  BarChart3,
  Microscope,
  Shield,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

const ProcessorQualityTests = () => {
  const [qualityTests, setQualityTests] = useState([
    {
      id: 'QT_001',
      batchId: 'FB_TUL_2024_001',
      cropType: 'Tulsi (Holy Basil)',
      testType: 'Microbial Analysis',
      testDate: '2024-01-22',
      labName: 'AyurLab Certifications',
      status: 'completed',
      results: {
        overall: 'pass',
        parameters: [
          { name: 'Total Plate Count', value: '10^3 CFU/g', limit: '10^5 CFU/g', status: 'pass' },
          { name: 'E. coli', value: 'Absent', limit: 'Absent', status: 'pass' },
          { name: 'Salmonella', value: 'Absent', limit: 'Absent', status: 'pass' },
          { name: 'Yeast & Mold', value: '10^2 CFU/g', limit: '10^4 CFU/g', status: 'pass' }
        ]
      },
      certificates: ['microbial_cert.pdf'],
      cost: '₹2,500',
      validUntil: '2024-07-22'
    },
    {
      id: 'QT_002',
      batchId: 'FB_TUL_2024_001',
      cropType: 'Tulsi (Holy Basil)',
      testType: 'Heavy Metals',
      testDate: '2024-01-23',
      labName: 'MetalCheck Labs',
      status: 'completed',
      results: {
        overall: 'pass',
        parameters: [
          { name: 'Lead (Pb)', value: '0.5 ppm', limit: '2.0 ppm', status: 'pass' },
          { name: 'Cadmium (Cd)', value: '0.1 ppm', limit: '0.3 ppm', status: 'pass' },
          { name: 'Mercury (Hg)', value: '0.02 ppm', limit: '0.1 ppm', status: 'pass' },
          { name: 'Arsenic (As)', value: '0.8 ppm', limit: '1.0 ppm', status: 'pass' }
        ]
      },
      certificates: ['heavy_metals_cert.pdf'],
      cost: '₹3,200',
      validUntil: '2024-07-23'
    },
    {
      id: 'QT_003',
      batchId: 'FB_GIN_2024_002',
      cropType: 'Ginger',
      testType: 'Pesticide Residue',
      testDate: '2024-01-24',
      labName: 'AgriSafe Testing',
      status: 'in-progress',
      results: null,
      certificates: [],
      cost: '₹4,500',
      validUntil: null
    },
    {
      id: 'QT_004',
      batchId: 'FB_ASH_2024_003',
      cropType: 'Ashwagandha',
      testType: 'Aflatoxin Analysis',
      testDate: '2024-01-25',
      labName: 'ToxinScreen Labs',
      status: 'pending',
      results: null,
      certificates: [],
      cost: '₹2,800',
      validUntil: null
    }
  ]);

  const [selectedTest, setSelectedTest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [testTypeFilter, setTestTypeFilter] = useState('all');

  const testTypes = [
    'Microbial Analysis',
    'Heavy Metals',
    'Pesticide Residue',
    'Aflatoxin Analysis',
    'Nutritional Analysis',
    'Moisture Content',
    'pH Analysis',
    'Purity Test'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tests', count: qualityTests.length },
    { value: 'pending', label: 'Pending', count: qualityTests.filter(t => t.status === 'pending').length },
    { value: 'in-progress', label: 'In Progress', count: qualityTests.filter(t => t.status === 'in-progress').length },
    { value: 'completed', label: 'Completed', count: qualityTests.filter(t => t.status === 'completed').length }
  ];

  const filteredTests = qualityTests.filter(test => {
    const matchesSearch = test.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesType = testTypeFilter === 'all' || test.testType === testTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      'in-progress': TestTube,
      completed: CheckCircle,
      failed: AlertTriangle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getResultColor = (status) => {
    const colors = {
      pass: 'text-green-600',
      fail: 'text-red-600',
      warning: 'text-yellow-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const calculatePassRate = () => {
    const completedTests = qualityTests.filter(test => test.status === 'completed');
    const passedTests = completedTests.filter(test => test.results?.overall === 'pass');
    return completedTests.length > 0 ? Math.round((passedTests.length / completedTests.length) * 100) : 0;
  };

  const getTotalCost = () => {
    return qualityTests.reduce((total, test) => {
      const cost = parseInt(test.cost.replace(/[^\d]/g, ''));
      return total + cost;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quality Tests</h1>
            <p className="text-muted-foreground">Manage lab tests and quality certifications for processed batches</p>
          </div>
          <TestTube className="h-8 w-8 text-primary" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Tests</p>
                <p className="text-2xl font-bold text-blue-800">{qualityTests.length}</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Pass Rate</p>
                <p className="text-2xl font-bold text-green-800">{calculatePassRate()}%</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-800">
                  {qualityTests.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Cost</p>
                <p className="text-2xl font-bold text-purple-800">₹{getTotalCost().toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by batch ID, crop type, or test type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>

            <select
              value={testTypeFilter}
              onChange={(e) => setTestTypeFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Test Types</option>
              {testTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Test</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quality Tests List */}
      <div className="space-y-4">
        {filteredTests.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No quality tests found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-foreground">{test.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)}
                      <span className="ml-1">{test.status.replace('-', ' ').toUpperCase()}</span>
                    </span>
                    {test.results?.overall === 'pass' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                        <Shield className="h-3 w-3 inline mr-1" />
                        PASSED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{test.batchId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Microscope className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{test.testType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{test.testDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{test.cost}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    <span>Lab: {test.labName}</span>
                    {test.validUntil && <span className="ml-4">Valid until: {test.validUntil}</span>}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                    className="flex items-center space-x-1 px-3 py-1 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    <span>{selectedTest === test.id ? 'Hide' : 'View'} Details</span>
                  </button>
                  
                  {test.certificates.length > 0 && (
                    <button className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      <Download className="h-3 w-3" />
                      <span>Certificate</span>
                    </button>
                  )}
                  
                  {test.status === 'pending' && (
                    <button className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                      <Upload className="h-3 w-3" />
                      <span>Upload Results</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Test Results Details */}
              {selectedTest === test.id && test.results && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border pt-4 mt-4"
                >
                  <h4 className="font-semibold text-foreground mb-3">Test Results</h4>
                  
                  <div className="space-y-2">
                    {test.results.parameters.map((param, paramIndex) => (
                      <div key={paramIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-foreground">{param.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground">Value: <strong>{param.value}</strong></span>
                          <span className="text-muted-foreground">Limit: <strong>{param.limit}</strong></span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            param.status === 'pass' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {param.status === 'pass' ? (
                              <CheckCircle className="h-3 w-3 inline mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 inline mr-1" />
                            )}
                            {param.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Quality Test</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select batch...</option>
                  <option value="FB_TUL_2024_001">FB_TUL_2024_001 - Tulsi</option>
                  <option value="FB_GIN_2024_002">FB_GIN_2024_002 - Ginger</option>
                  <option value="FB_ASH_2024_003">FB_ASH_2024_003 - Ashwagandha</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select test type...</option>
                  {testTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter lab name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Cost</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter expected cost..."
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Schedule Test
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessorQualityTests;