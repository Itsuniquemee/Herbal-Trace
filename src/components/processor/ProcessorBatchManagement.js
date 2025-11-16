import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  QrCode, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  FileText,
  TestTube2,
  Activity,
  Shield,
  Eye,
  RefreshCw,
  User,
  MapPin,
  Calendar,
  Scale,
  Droplets,
  Thermometer,
  Timer,
  Award,
  Truck,
  Filter,
  Search,
  Plus,
  Save,
  Download
} from 'lucide-react';

const ProcessorBatchManagement = () => {
  const [activeTab, setActiveTab] = useState('receive-batches');
  const [incomingBatches, setIncomingBatches] = useState([]);
  const [processingBatches, setProcessingBatches] = useState([]);
  const [completedBatches, setCompletedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [qualityTests, setQualityTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock processor info
  const processorInfo = {
    name: 'Suresh Patel',
    processorId: 'PR2024001',
    facilityName: 'Patel Herbal Processing Unit',
    location: 'Gujarat, India',
    license: 'FSSAI-10019022001234',
    certifications: ['GMP', 'ISO 22000', 'Organic Processing']
  };

  // Load data on component mount
  useEffect(() => {
    loadBatchData();
  }, []);

  const loadBatchData = () => {
    // Load incoming batches (from farmers)
    const farmerCropRecords = JSON.parse(localStorage.getItem('farmer_crop_records') || '[]');
    const pendingBatches = farmerCropRecords
      .filter(record => record.status === 'Pending Verification' || record.status === 'Ready for Processing')
      .map(record => ({
        ...record,
        id: record.id || `BATCH_${Date.now()}`,
        receivedDate: null,
        processingStatus: 'Pending Receipt',
        qrCode: `QR_${record.id}`,
        estimatedProcessingTime: '3-5 days'
      }));

    setIncomingBatches(pendingBatches);

    // Load existing processing and completed batches
    const savedProcessingBatches = JSON.parse(localStorage.getItem('processing_batches') || '[]');
    const savedCompletedBatches = JSON.parse(localStorage.getItem('completed_batches') || '[]');
    
    setProcessingBatches(savedProcessingBatches);
    setCompletedBatches(savedCompletedBatches);
  };

  const receiveBatch = (batch) => {
    const receivedBatch = {
      ...batch,
      receivedDate: new Date().toISOString(),
      processingStatus: 'In Processing',
      receivedBy: processorInfo.name,
      processingSteps: [
        {
          id: 1,
          step: 'Initial Inspection',
          status: 'Pending',
          startTime: null,
          endTime: null,
          notes: '',
          operator: processorInfo.name
        },
        {
          id: 2,
          step: 'Washing & Cleaning',
          status: 'Pending',
          startTime: null,
          endTime: null,
          notes: '',
          operator: processorInfo.name
        },
        {
          id: 3,
          step: 'Drying Process',
          status: 'Pending',
          startTime: null,
          endTime: null,
          notes: '',
          operator: processorInfo.name
        },
        {
          id: 4,
          step: 'Size Reduction',
          status: 'Pending',
          startTime: null,
          endTime: null,
          notes: '',
          operator: processorInfo.name
        },
        {
          id: 5,
          step: 'Quality Testing',
          status: 'Pending',
          startTime: null,
          endTime: null,
          notes: '',
          operator: processorInfo.name
        },
        {
          id: 6,
          step: 'Packaging',
          status: 'Pending',
          startTime: null,
          endTime: null,
          notes: '',
          operator: processorInfo.name
        }
      ],
      qualityTests: []
    };

    // Move from incoming to processing
    setIncomingBatches(prev => prev.filter(b => b.id !== batch.id));
    setProcessingBatches(prev => {
      const updated = [...prev, receivedBatch];
      localStorage.setItem('processing_batches', JSON.stringify(updated));
      return updated;
    });

    // Update farmer crop record status
    const farmerRecords = JSON.parse(localStorage.getItem('farmer_crop_records') || '[]');
    const updatedRecords = farmerRecords.map(record => 
      record.id === batch.id 
        ? { ...record, status: 'In Processing', processingStartDate: new Date().toISOString() }
        : record
    );
    localStorage.setItem('farmer_crop_records', JSON.stringify(updatedRecords));
  };

  const updateProcessingStep = (batchId, stepId, updates) => {
    setProcessingBatches(prev => {
      const updated = prev.map(batch => {
        if (batch.id === batchId) {
          const updatedSteps = batch.processingSteps.map(step => 
            step.id === stepId ? { ...step, ...updates } : step
          );
          return { ...batch, processingSteps: updatedSteps };
        }
        return batch;
      });
      localStorage.setItem('processing_batches', JSON.stringify(updated));
      return updated;
    });
  };

  const startProcessingStep = (batchId, stepId) => {
    updateProcessingStep(batchId, stepId, {
      status: 'In Progress',
      startTime: new Date().toISOString()
    });
  };

  const completeProcessingStep = (batchId, stepId, notes = '') => {
    updateProcessingStep(batchId, stepId, {
      status: 'Completed',
      endTime: new Date().toISOString(),
      notes
    });
  };

  const addQualityTest = (batchId, testData) => {
    setProcessingBatches(prev => {
      const updated = prev.map(batch => {
        if (batch.id === batchId) {
          const newTest = {
            id: Date.now(),
            ...testData,
            testedBy: processorInfo.name,
            testDate: new Date().toISOString()
          };
          return { 
            ...batch, 
            qualityTests: [...(batch.qualityTests || []), newTest] 
          };
        }
        return batch;
      });
      localStorage.setItem('processing_batches', JSON.stringify(updated));
      return updated;
    });
  };

  const completeBatchProcessing = (batchId) => {
    const batch = processingBatches.find(b => b.id === batchId);
    if (!batch) return;

    const completedBatch = {
      ...batch,
      processingStatus: 'Completed',
      completionDate: new Date().toISOString(),
      finalQRCode: `FINAL_QR_${batchId}_${Date.now()}`,
      chainOfCustody: {
        farmer: batch.farmerName,
        processor: processorInfo.name,
        facilityLocation: processorInfo.location,
        processingPeriod: {
          start: batch.receivedDate,
          end: new Date().toISOString()
        }
      }
    };

    setProcessingBatches(prev => prev.filter(b => b.id !== batchId));
    setCompletedBatches(prev => {
      const updated = [...prev, completedBatch];
      localStorage.setItem('completed_batches', JSON.stringify(updated));
      return updated;
    });

    // Update farmer crop record
    const farmerRecords = JSON.parse(localStorage.getItem('farmer_crop_records') || '[]');
    const updatedRecords = farmerRecords.map(record => 
      record.id === batchId 
        ? { ...record, status: 'Processing Completed', completionDate: new Date().toISOString() }
        : record
    );
    localStorage.setItem('farmer_crop_records', JSON.stringify(updatedRecords));
  };

  const filteredBatches = (batches) => {
    return batches.filter(batch => {
      const matchesSearch = batch.herbType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           batch.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           batch.batchId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           batch.processingStatus?.toLowerCase().includes(filterStatus.toLowerCase());
      
      return matchesSearch && matchesFilter;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'pending receipt': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepIcon = (step) => {
    switch (step.toLowerCase()) {
      case 'initial inspection': return <Eye className="h-4 w-4" />;
      case 'washing & cleaning': return <Droplets className="h-4 w-4" />;
      case 'drying process': return <Thermometer className="h-4 w-4" />;
      case 'size reduction': return <Activity className="h-4 w-4" />;
      case 'quality testing': return <TestTube2 className="h-4 w-4" />;
      case 'packaging': return <Package className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Batch Processing Management</h1>
            <p className="text-muted-foreground">Receive, process, and track herbal batches through the supply chain</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{processorInfo.name}</p>
            <p className="text-xs text-muted-foreground">ID: {processorInfo.processorId}</p>
          </div>
        </div>

        {/* Processor Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Facility</p>
              <p className="text-sm font-medium">{processorInfo.facilityName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{processorInfo.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">License</p>
              <p className="text-sm font-medium">{processorInfo.license}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Certifications</p>
              <p className="text-sm font-medium">{processorInfo.certifications.length} Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search batches by herb type, farmer, or batch ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">In Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('receive-batches')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'receive-batches'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Receive Batches ({incomingBatches.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('processing')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'processing'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>In Processing ({processingBatches.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed ({completedBatches.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('quality-tests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'quality-tests'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <TestTube2 className="h-4 w-4" />
            <span>Quality Tests</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('chain-custody')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chain-custody'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Chain of Custody</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Receive Batches Tab */}
        {activeTab === 'receive-batches' && (
          <div className="space-y-4">
            {filteredBatches(incomingBatches).length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Incoming Batches</h3>
                <p className="text-muted-foreground">New batches from farmers will appear here for processing</p>
                <button
                  onClick={loadBatchData}
                  className="mt-4 flex items-center space-x-2 mx-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBatches(incomingBatches).map((batch) => (
                  <div key={batch.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{batch.herbType}</h3>
                          <p className="text-sm text-muted-foreground">Batch: {batch.batchId}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.processingStatus)}`}>
                        {batch.processingStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Farmer: {batch.farmerName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span>Qty: {batch.quantity} {batch.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Harvested: {new Date(batch.harvestDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Grade: {batch.qualityGrade}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        <span>Est. Processing: {batch.estimatedProcessingTime}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="px-3 py-1 text-sm border border-border rounded hover:bg-accent transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => receiveBatch(batch)}
                          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        >
                          Receive Batch
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Processing Tab */}
        {activeTab === 'processing' && (
          <div className="space-y-4">
            {filteredBatches(processingBatches).length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Batches in Processing</h3>
                <p className="text-muted-foreground">Receive batches to start processing</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBatches(processingBatches).map((batch) => (
                  <div key={batch.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{batch.herbType}</h3>
                          <p className="text-sm text-muted-foreground">Batch: {batch.batchId}</p>
                          <p className="text-xs text-muted-foreground">
                            Received: {new Date(batch.receivedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.processingStatus)}`}>
                          {batch.processingStatus}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {batch.quantity} {batch.unit}
                        </p>
                      </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground mb-3">Processing Steps</h4>
                      {batch.processingSteps?.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                              {getStepIcon(step.step)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{step.step}</p>
                              {step.startTime && (
                                <p className="text-xs text-muted-foreground">
                                  Started: {new Date(step.startTime).toLocaleString()}
                                </p>
                              )}
                              {step.endTime && (
                                <p className="text-xs text-muted-foreground">
                                  Completed: {new Date(step.endTime).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {step.status === 'Pending' && (
                              <button
                                onClick={() => startProcessingStep(batch.id, step.id)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Start
                              </button>
                            )}
                            {step.status === 'In Progress' && (
                              <button
                                onClick={() => completeProcessingStep(batch.id, step.id)}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                            {step.status === 'Completed' && (
                              <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded">
                                ✓ Done
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="px-4 py-2 text-sm border border-border rounded hover:bg-accent transition-colors"
                      >
                        Add Quality Test
                      </button>
                      {batch.processingSteps?.every(step => step.status === 'Completed') && (
                        <button
                          onClick={() => completeBatchProcessing(batch.id)}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Complete Processing
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Tab */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {filteredBatches(completedBatches).length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Completed Batches</h3>
                <p className="text-muted-foreground">Completed batches will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBatches(completedBatches).map((batch) => (
                  <div key={batch.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{batch.herbType}</h3>
                          <p className="text-sm text-muted-foreground">Batch: {batch.batchId}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{batch.farmerName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span>{batch.quantity} {batch.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Completed: {new Date(batch.completionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span>QR Generated</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="px-3 py-1 text-sm border border-border rounded hover:bg-accent transition-colors"
                      >
                        View Details
                      </button>
                      <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                        Download QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quality Tests Tab */}
        {activeTab === 'quality-tests' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Quality Test Management</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Test Template</span>
              </button>
            </div>

            {/* Test Templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <TestTube2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Moisture Content</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Test for moisture levels in processed herbs
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Range: 8-12%</p>
                  <p>• Method: Oven drying</p>
                  <p>• Duration: 2 hours</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Active Compounds</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Analysis of key bioactive compounds
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Method: HPLC</p>
                  <p>• Parameters: 5-10</p>
                  <p>• Duration: 4 hours</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium">Contaminant Screening</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Check for pesticides and heavy metals
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Pesticides: 200+ compounds</p>
                  <p>• Heavy metals: Pb, Cd, As, Hg</p>
                  <p>• Duration: 6 hours</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chain of Custody Tab */}
        {activeTab === 'chain-custody' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Chain of Custody Records</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export Records</span>
              </button>
            </div>

            <div className="space-y-6">
              {completedBatches.map((batch) => (
                <div key={batch.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{batch.herbType} - {batch.batchId}</h3>
                      <p className="text-sm text-muted-foreground">Chain of Custody Record</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>

                  {/* Custody Chain */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">Farmer</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{batch.farmerName}</p>
                        <p className="text-xs text-muted-foreground">
                          Harvested: {new Date(batch.harvestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-0.5 h-6 bg-border"></div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Processor</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{processorInfo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Processed: {new Date(batch.receivedDate).toLocaleDateString()} - {new Date(batch.completionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signatures */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-medium">Digital Signature</p>
                        <p className="text-muted-foreground font-mono">
                          0x{Math.random().toString(16).substring(2, 10)}...
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Blockchain Hash</p>
                        <p className="text-muted-foreground font-mono">
                          0x{Math.random().toString(16).substring(2, 10)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {completedBatches.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Chain of Custody Records</h3>
                  <p className="text-muted-foreground">Complete batch processing to generate custody records</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProcessorBatchManagement;