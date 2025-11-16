import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Thermometer, 
  Droplets, 
  Package, 
  TestTube,
  Truck,
  FileText,
  Calendar,
  Timer,
  CheckCircle,
  AlertTriangle,
  Eye,
  Save,
  X,
  Beaker,
  Zap,
  Wind
} from 'lucide-react';

const ProcessorRecords = () => {
  const [processingRecords, setProcessingRecords] = useState([
    {
      id: 'PR_001',
      batchId: 'FB_TUL_2024_001',
      cropType: 'Tulsi (Holy Basil)',
      quantity: '500 kg',
      currentStep: 'drying',
      status: 'in-progress',
      startDate: '2024-01-20',
      estimatedCompletion: '2024-01-25',
      steps: [
        {
          id: 'wash_001',
          name: 'Washing',
          status: 'completed',
          startTime: '2024-01-20 09:00',
          endTime: '2024-01-20 11:00',
          duration: '2 hours',
          temperature: '25°C',
          waterUsed: '200L',
          operator: 'Amit Singh',
          notes: 'Thorough washing with purified water. No contamination detected.',
          parameters: {
            waterTemperature: '25°C',
            washCycles: 3,
            waterQuality: 'Purified',
            ph: '7.2'
          }
        },
        {
          id: 'dry_001',
          name: 'Drying',
          status: 'in-progress',
          startTime: '2024-01-20 12:00',
          endTime: null,
          duration: null,
          temperature: '45°C',
          humidity: '15%',
          operator: 'Sunita Devi',
          notes: 'Controlled drying in progress. Temperature maintained.',
          parameters: {
            targetMoisture: '8%',
            currentMoisture: '12%',
            airflow: 'Medium',
            expectedDuration: '48 hours'
          }
        },
        {
          id: 'extract_001',
          name: 'Extraction',
          status: 'pending',
          startTime: null,
          endTime: null,
          duration: null,
          temperature: null,
          operator: null,
          notes: null,
          parameters: {
            method: 'Steam Distillation',
            expectedYield: '2.5%',
            duration: '6 hours'
          }
        },
        {
          id: 'package_001',
          name: 'Packaging',
          status: 'pending',
          startTime: null,
          endTime: null,
          duration: null,
          operator: null,
          notes: null,
          parameters: {
            packageType: 'Vacuum Sealed',
            labelRequired: true,
            qrCodeGeneration: true
          }
        }
      ]
    },
    {
      id: 'PR_002',
      batchId: 'FB_GIN_2024_002',
      cropType: 'Ginger',
      quantity: '750 kg',
      currentStep: 'washing',
      status: 'in-progress',
      startDate: '2024-01-21',
      estimatedCompletion: '2024-01-28',
      steps: [
        {
          id: 'wash_002',
          name: 'Washing',
          status: 'in-progress',
          startTime: '2024-01-21 08:00',
          endTime: null,
          duration: null,
          temperature: '20°C',
          waterUsed: '150L',
          operator: 'Ramesh Kumar',
          notes: 'Initial cleaning phase. Removing soil and debris.',
          parameters: {
            waterTemperature: '20°C',
            washCycles: 2,
            waterQuality: 'Filtered',
            ph: '7.0'
          }
        }
      ]
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  const stepTypes = [
    { value: 'washing', label: 'Washing', icon: Droplets, color: 'bg-blue-100 text-blue-800' },
    { value: 'drying', label: 'Drying', icon: Wind, color: 'bg-orange-100 text-orange-800' },
    { value: 'extraction', label: 'Extraction', icon: Beaker, color: 'bg-purple-100 text-purple-800' },
    { value: 'packaging', label: 'Packaging', icon: Package, color: 'bg-green-100 text-green-800' },
    { value: 'quality-check', label: 'Quality Check', icon: TestTube, color: 'bg-pink-100 text-pink-800' },
    { value: 'sterilization', label: 'Sterilization', icon: Zap, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const getStepIcon = (stepName) => {
    const step = stepTypes.find(s => s.value === stepName.toLowerCase().replace(' ', '-'));
    const Icon = step?.icon || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getStepColor = (stepName) => {
    const step = stepTypes.find(s => s.value === stepName.toLowerCase().replace(' ', '-'));
    return step?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-gray-100 text-gray-800 border-gray-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'failed': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': Clock,
      'in-progress': Activity,
      'completed': CheckCircle,
      'on-hold': Timer,
      'failed': AlertTriangle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const calculateProgress = (steps) => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getCurrentStepDetails = (record) => {
    const currentStep = record.steps.find(step => step.status === 'in-progress');
    return currentStep || record.steps.find(step => step.status === 'pending');
  };

  const handleStartStep = (recordId, stepId) => {
    setProcessingRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          steps: record.steps.map(step => 
            step.id === stepId 
              ? { ...step, status: 'in-progress', startTime: new Date().toISOString() }
              : step
          )
        };
      }
      return record;
    }));
  };

  const handleCompleteStep = (recordId, stepId) => {
    setProcessingRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          steps: record.steps.map(step => 
            step.id === stepId 
              ? { 
                  ...step, 
                  status: 'completed', 
                  endTime: new Date().toISOString(),
                  duration: calculateDuration(step.startTime, new Date().toISOString())
                }
              : step
          )
        };
      }
      return record;
    }));
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return null;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Processing Records</h1>
            <p className="text-muted-foreground">Track and manage all processing steps for each batch</p>
          </div>
          <Activity className="h-8 w-8 text-primary" />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Active Batches</p>
                <p className="text-2xl font-bold text-blue-800">
                  {processingRecords.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completed Steps</p>
                <p className="text-2xl font-bold text-green-800">
                  {processingRecords.reduce((acc, record) => 
                    acc + record.steps.filter(step => step.status === 'completed').length, 0
                  )}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-800">
                  {processingRecords.reduce((acc, record) => 
                    acc + record.steps.filter(step => step.status === 'in-progress').length, 0
                  )}
                </p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Volume</p>
                <p className="text-2xl font-bold text-purple-800">
                  {processingRecords.reduce((acc, record) => 
                    acc + parseInt(record.quantity.replace(/[^\d]/g, '')), 0
                  )} kg
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            <FileText className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Processing Record</span>
        </button>
      </div>

      {/* Processing Records List */}
      <div className="space-y-6">
        {processingRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            {/* Record Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{record.batchId}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                    <span className="ml-1">{record.status.replace('-', ' ').toUpperCase()}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>{record.cropType} - {record.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {record.startDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Est. Completion: {record.estimatedCompletion}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                className="flex items-center space-x-2 px-3 py-1 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>{selectedRecord === record.id ? 'Hide' : 'View'} Details</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{calculateProgress(record.steps)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress(record.steps)}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step Info */}
            {(() => {
              const currentStep = getCurrentStepDetails(record);
              return currentStep && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStepColor(currentStep.name)}`}>
                        {getStepIcon(currentStep.name)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Current Step: {currentStep.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentStep.status === 'in-progress' ? 'In Progress' : 'Ready to Start'}
                          {currentStep.operator && ` • Operator: ${currentStep.operator}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {currentStep.status === 'pending' && (
                        <button
                          onClick={() => handleStartStep(record.id, currentStep.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          Start Step
                        </button>
                      )}
                      {currentStep.status === 'in-progress' && (
                        <button
                          onClick={() => handleCompleteStep(record.id, currentStep.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                        >
                          Complete Step
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Detailed Steps View */}
            {selectedRecord === record.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-foreground mb-4">Processing Steps</h4>
                
                {record.steps.map((step, stepIndex) => (
                  <div key={step.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStepColor(step.name)}`}>
                          {getStepIcon(step.name)}
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground">{step.name}</h5>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(step.status)}`}>
                              {step.status.replace('-', ' ').toUpperCase()}
                            </span>
                            {step.operator && <span>Operator: {step.operator}</span>}
                            {step.duration && <span>Duration: {step.duration}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingStep(step)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Step Parameters */}
                    {step.parameters && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        {Object.entries(step.parameters).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="ml-1 text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Step Notes */}
                    {step.notes && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="text-foreground mt-1">{step.notes}</p>
                      </div>
                    )}
                    
                    {/* Time Information */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-3">
                      {step.startTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Started: {new Date(step.startTime).toLocaleString()}</span>
                        </div>
                      )}
                      {step.endTime && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Completed: {new Date(step.endTime).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Processing Record</h3>
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
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter batch ID..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter crop type..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter quantity..."
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Create Record
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

export default ProcessorRecords;