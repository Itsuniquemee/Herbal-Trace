import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  QrCode, 
  Scan, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin,
  Calendar,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Camera,
  Barcode,
  Truck,
  Shield,
  Award,
  Plus
} from 'lucide-react';

const ProcessorReceiveBatches = () => {
  const [batches, setBatches] = useState([
    {
      id: 'FB_TUL_2024_001',
      farmerId: 'farmer123',
      farmerName: 'Rajesh Kumar',
      cropType: 'Tulsi (Holy Basil)',
      quantity: '500 kg',
      harvestDate: '2024-01-15',
      receivedDate: '2024-01-20',
      status: 'received',
      qrCode: 'QR_TUL_001',
      location: 'Uttarakhand, India',
      organicCertified: true,
      qualityGrade: 'A+',
      moistureContent: '12%',
      documents: ['organic_cert.pdf', 'soil_test.pdf']
    },
    {
      id: 'FB_GIN_2024_002',
      farmerId: 'farmer456',
      farmerName: 'Priya Sharma',
      cropType: 'Ginger',
      quantity: '750 kg',
      harvestDate: '2024-01-18',
      receivedDate: null,
      status: 'pending',
      qrCode: 'QR_GIN_002',
      location: 'Kerala, India',
      organicCertified: true,
      qualityGrade: 'A',
      moistureContent: '15%',
      documents: ['organic_cert.pdf']
    },
    {
      id: 'FB_ASH_2024_003',
      farmerId: 'farmer789',
      farmerName: 'Suresh Patel',
      cropType: 'Ashwagandha',
      quantity: '300 kg',
      harvestDate: '2024-01-12',
      receivedDate: '2024-01-17',
      status: 'verified',
      qrCode: 'QR_ASH_003',
      location: 'Madhya Pradesh, India',
      organicCertified: false,
      qualityGrade: 'B+',
      moistureContent: '10%',
      documents: ['soil_test.pdf', 'harvest_report.pdf']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const scannerRef = useRef(null);

  const statusOptions = [
    { value: 'all', label: 'All Batches', count: batches.length },
    { value: 'pending', label: 'Pending Receipt', count: batches.filter(b => b.status === 'pending').length },
    { value: 'received', label: 'Received', count: batches.filter(b => b.status === 'received').length },
    { value: 'verified', label: 'Verified', count: batches.filter(b => b.status === 'verified').length }
  ];

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.cropType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      received: 'bg-blue-100 text-blue-800 border-blue-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      received: Package,
      verified: CheckCircle,
      rejected: AlertTriangle
    };
    const Icon = icons[status] || Package;
    return <Icon className="h-4 w-4" />;
  };

  const handleScanQR = () => {
    setShowScanner(true);
  };

  const handleScanComplete = (result) => {
    setScanResult(result);
    setShowScanner(false);
    
    // Find batch by QR code
    const batch = batches.find(b => b.qrCode === result);
    if (batch) {
      setSelectedBatch(batch);
    }
  };

  const handleReceiveBatch = (batchId) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { ...batch, status: 'received', receivedDate: new Date().toISOString().split('T')[0] }
        : batch
    ));
  };

  const handleVerifyBatch = (batchId) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { ...batch, status: 'verified' }
        : batch
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Receive Batches</h1>
            <p className="text-muted-foreground">Scan QR codes and manage incoming farmer batches</p>
          </div>
          <Package className="h-8 w-8 text-primary" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusOptions.map((option, index) => (
            <div key={option.value} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{option.label}</p>
                  <p className="text-2xl font-bold text-foreground">{option.count}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-gray-100 text-gray-600' :
                  index === 1 ? 'bg-yellow-100 text-yellow-600' :
                  index === 2 ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {index === 0 ? <Package className="h-5 w-5" /> :
                   index === 1 ? <Clock className="h-5 w-5" /> :
                   index === 2 ? <Package className="h-5 w-5" /> :
                   <CheckCircle className="h-5 w-5" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by batch ID, farmer, or crop type..."
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleScanQR}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span>Scan QR Code</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Plus className="h-4 w-4" />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batches List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Incoming Batches</h2>
        
        {filteredBatches.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No batches found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBatches.map((batch, index) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{batch.id}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(batch.status)}`}>
                        {getStatusIcon(batch.status)}
                        <span className="ml-1">{batch.status.toUpperCase()}</span>
                      </span>
                      {batch.organicCertified && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                          <Award className="h-3 w-3 inline mr-1" />
                          Organic
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{batch.farmerName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{batch.cropType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{batch.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{batch.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Harvest: {batch.harvestDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Grade: {batch.qualityGrade}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Moisture: {batch.moistureContent}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Barcode className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">QR: {batch.qrCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setSelectedBatch(batch)}
                      className="flex items-center space-x-1 px-3 py-1 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    
                    {batch.status === 'pending' && (
                      <button
                        onClick={() => handleReceiveBatch(batch.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        <Package className="h-3 w-3" />
                        <span>Receive</span>
                      </button>
                    )}
                    
                    {batch.status === 'received' && (
                      <button
                        onClick={() => handleVerifyBatch(batch.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Verify</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-1 px-3 py-1 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                      <Download className="h-3 w-3" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Position the QR code within the camera frame</p>
              
              {/* Simulated scan result */}
              <input
                type="text"
                placeholder="Enter QR code manually..."
                value={scanResult}
                onChange={(e) => setScanResult(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleScanComplete(scanResult)}
                  disabled={!scanResult}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process Scan
                </button>
                <button
                  onClick={() => setShowScanner(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Batch Details</h3>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Batch ID</label>
                  <p className="text-foreground">{selectedBatch.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedBatch.status)}`}>
                    {selectedBatch.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Farmer</label>
                  <p className="text-foreground">{selectedBatch.farmerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Crop Type</label>
                  <p className="text-foreground">{selectedBatch.cropType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Quantity</label>
                  <p className="text-foreground">{selectedBatch.quantity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Quality Grade</label>
                  <p className="text-foreground">{selectedBatch.qualityGrade}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Documents</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedBatch.documents.map((doc, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                {selectedBatch.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleReceiveBatch(selectedBatch.id);
                      setSelectedBatch(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Mark as Received
                  </button>
                )}
                {selectedBatch.status === 'received' && (
                  <button
                    onClick={() => {
                      handleVerifyBatch(selectedBatch.id);
                      setSelectedBatch(null);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Verify Batch
                  </button>
                )}
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessorReceiveBatches;