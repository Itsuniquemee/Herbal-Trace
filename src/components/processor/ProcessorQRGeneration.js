import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Download, 
  Eye, 
  Copy, 
  Package, 
  Barcode,
  FileText,
  Calendar,
  Share,
  Printer,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';

const ProcessorQRGeneration = () => {
  const [qrCodes, setQrCodes] = useState([
    {
      id: 'QR_TUL_PROC_001',
      batchId: 'FB_TUL_2024_001',
      productName: 'Tulsi Essential Oil',
      productType: 'Essential Oil',
      processingDate: '2024-01-25',
      expiryDate: '2025-01-25',
      quantity: '50 bottles (10ml each)',
      status: 'active',
      qrData: 'https://traceherbss.com/verify/QR_TUL_PROC_001',
      generatedBy: 'Suresh Patel',
      generatedDate: '2024-01-25',
      printCount: 50,
      scanCount: 0,
      certifications: ['Organic', 'AYUSH Approved'],
      processingSteps: ['Washing', 'Drying', 'Steam Distillation', 'Packaging'],
      qualityTests: ['Microbial Analysis', 'Heavy Metals'],
      nutritionalInfo: {
        purity: '99.5%',
        moisture: '0.1%',
        essentialOilContent: '2.8%'
      }
    },
    {
      id: 'QR_GIN_PROC_002',
      batchId: 'FB_GIN_2024_002',
      productName: 'Ginger Powder',
      productType: 'Dried Powder',
      processingDate: '2024-01-28',
      expiryDate: '2025-01-28',
      quantity: '100 packets (250g each)',
      status: 'pending',
      qrData: null,
      generatedBy: null,
      generatedDate: null,
      printCount: 0,
      scanCount: 0,
      certifications: ['Organic'],
      processingSteps: ['Washing', 'Drying', 'Grinding', 'Packaging'],
      qualityTests: ['Pesticide Residue', 'Moisture Content'],
      nutritionalInfo: {
        purity: '98%',
        moisture: '8%',
        gingerolContent: '3.2%'
      }
    },
    {
      id: 'QR_ASH_PROC_003',
      batchId: 'FB_ASH_2024_003',
      productName: 'Ashwagandha Extract',
      productType: 'Liquid Extract',
      processingDate: '2024-01-30',
      expiryDate: '2025-01-30',
      quantity: '200 bottles (30ml each)',
      status: 'expired',
      qrData: 'https://traceherbss.com/verify/QR_ASH_PROC_003',
      generatedBy: 'Amit Singh',
      generatedDate: '2024-01-30',
      printCount: 200,
      scanCount: 45,
      certifications: ['AYUSH Approved'],
      processingSteps: ['Washing', 'Drying', 'Extraction', 'Filtration', 'Packaging'],
      qualityTests: ['Aflatoxin Analysis', 'Heavy Metals'],
      nutritionalInfo: {
        withanolides: '5%',
        moisture: '2%',
        alcoholContent: '30%'
      }
    }
  ]);

  const [selectedQR, setSelectedQR] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qrSettings, setQrSettings] = useState({
    size: 'medium',
    format: 'png',
    errorCorrection: 'M',
    includeText: true,
    includeLogo: true
  });

  const canvasRef = useRef(null);

  const statusOptions = [
    { value: 'all', label: 'All QR Codes', count: qrCodes.length },
    { value: 'active', label: 'Active', count: qrCodes.filter(qr => qr.status === 'active').length },
    { value: 'pending', label: 'Pending', count: qrCodes.filter(qr => qr.status === 'pending').length },
    { value: 'expired', label: 'Expired', count: qrCodes.filter(qr => qr.status === 'expired').length }
  ];

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.batchId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || qr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      pending: Clock,
      expired: AlertTriangle,
      inactive: Clock
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const generateQRCode = (qrId) => {
    // Simulate QR code generation
    setQrCodes(prev => prev.map(qr => 
      qr.id === qrId 
        ? { 
            ...qr, 
            status: 'active',
            qrData: `https://traceherbss.com/verify/${qrId}`,
            generatedBy: 'Current User',
            generatedDate: new Date().toISOString().split('T')[0]
          }
        : qr
    ));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const downloadQR = (qrId) => {
    // Simulate QR code download
    console.log(`Downloading QR code: ${qrId}`);
  };

  const getTotalScans = () => {
    return qrCodes.reduce((total, qr) => total + qr.scanCount, 0);
  };

  const getActiveCount = () => {
    return qrCodes.filter(qr => qr.status === 'active').length;
  };

  // Mock QR Code component
  const QRCodePreview = ({ data, size = 200 }) => (
    <div 
      className="bg-white border-2 border-gray-300 flex items-center justify-center mx-auto"
      style={{ width: size, height: size }}
    >
      <div className="grid grid-cols-10 gap-px">
        {Array.from({ length: 100 }, (_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Generate QR Codes</h1>
            <p className="text-muted-foreground">Create and manage QR codes for processed products</p>
          </div>
          <QrCode className="h-8 w-8 text-primary" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total QR Codes</p>
                <p className="text-2xl font-bold text-blue-800">{qrCodes.length}</p>
              </div>
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active Codes</p>
                <p className="text-2xl font-bold text-green-800">{getActiveCount()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Scans</p>
                <p className="text-2xl font-bold text-purple-800">{getTotalScans()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Total Prints</p>
                <p className="text-2xl font-bold text-orange-800">
                  {qrCodes.reduce((total, qr) => total + qr.printCount, 0)}
                </p>
              </div>
              <Printer className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by QR ID, product name, or batch ID..."
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
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Generate QR</span>
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Codes List */}
      <div className="space-y-4">
        {filteredQRCodes.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No QR codes found</p>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredQRCodes.map((qr, index) => (
            <motion.div
              key={qr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  {/* QR Code Preview */}
                  <div className="flex-shrink-0">
                    {qr.status === 'active' ? (
                      <QRCodePreview data={qr.qrData} size={100} />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* QR Code Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{qr.id}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(qr.status)}`}>
                        {getStatusIcon(qr.status)}
                        <span className="ml-1">{qr.status.toUpperCase()}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Product: </span>
                        <span className="text-foreground font-medium">{qr.productName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Batch: </span>
                        <span className="text-foreground">{qr.batchId}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity: </span>
                        <span className="text-foreground">{qr.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Processing Date: </span>
                        <span className="text-foreground">{qr.processingDate}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {qr.certifications.map((cert, certIndex) => (
                        <span 
                          key={certIndex}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>

                    {qr.status === 'active' && (
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Printed: {qr.printCount} times</span>
                        <span>Scanned: {qr.scanCount} times</span>
                        <span>Generated: {qr.generatedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  {qr.status === 'pending' ? (
                    <button
                      onClick={() => generateQRCode(qr.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                    >
                      <QrCode className="h-3 w-3" />
                      <span>Generate</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedQR(selectedQR === qr.id ? null : qr.id)}
                        className="flex items-center space-x-1 px-3 py-1 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      
                      <button
                        onClick={() => downloadQR(qr.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(qr.qrData)}
                        className="flex items-center space-x-1 px-3 py-1 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedQR === qr.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border pt-4 mt-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Information */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Product Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product Type:</span>
                          <span className="text-foreground">{qr.productType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expiry Date:</span>
                          <span className="text-foreground">{qr.expiryDate}</span>
                        </div>
                        {Object.entries(qr.nutritionalInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{key}:</span>
                            <span className="text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Processing Information */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Processing Steps</h4>
                      <div className="space-y-2">
                        {qr.processingSteps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-foreground">{step}</span>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-semibold text-foreground mb-3 mt-4">Quality Tests</h4>
                      <div className="space-y-2">
                        {qr.qualityTests.map((test, testIndex) => (
                          <div key={testIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                            <span className="text-foreground">{test}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Generate QR Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generate New QR Code</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select processed batch...</option>
                  <option value="FB_TUL_2024_001">FB_TUL_2024_001 - Tulsi Essential Oil</option>
                  <option value="FB_GIN_2024_002">FB_GIN_2024_002 - Ginger Powder</option>
                  <option value="FB_ASH_2024_003">FB_ASH_2024_003 - Ashwagandha Extract</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter product name..."
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
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Generate QR Code
                </button>
                <button
                  onClick={() => setShowGenerateModal(false)}
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

export default ProcessorQRGeneration;