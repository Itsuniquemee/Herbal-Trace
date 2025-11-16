import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../config/api';
import QRCode from 'qrcode.react';
import { toast } from 'react-hot-toast';
import {
  QrCode,
  Download,
  Eye,
  Copy,
  Package,
  Leaf,
  Calendar,
  MapPin,
  Award,
  Share,
  Printer,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Clipboard,
  ExternalLink
} from 'lucide-react';

const FarmerQRGeneration = () => {
  const [batches, setBatches] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const qrRef = useRef();

  // Fetch farmer batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/farmer/batches');
      setBatches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  // Fetch generated QR codes
  const fetchQRCodes = async () => {
    try {
      const response = await apiClient.get('/farmer/qr-codes');
      setQrCodes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchQRCodes();
  }, []);

  // Generate QR code for batch
  const generateQR = async (batch) => {
    try {
      setGenerating(prev => ({ ...prev, [batch.id]: true }));
      
      const qrData = {
        batchId: batch.id,
        cropName: batch.cropName,
        harvestDate: batch.harvestDate,
        farmLocation: batch.farmLocation,
        organicCertified: batch.organicCertified,
        qualityGrade: batch.qualityGrade
      };

      const response = await apiClient.post('/farmer/generate-qr', {
        batchId: batch.id,
        qrData: qrData
      });

      const qrResult = response.data.data;
      setGeneratedQR(qrResult);
      setShowQRModal(true);
      
      toast.success('QR code generated successfully!');
      
      // Refresh data
      fetchBatches();
      fetchQRCodes();
      
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error(error.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setGenerating(prev => ({ ...prev, [batch.id]: false }));
    }
  };

  // Copy QR URL to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('QR URL copied to clipboard!');
    });
  };

  // Download QR code as image
  const downloadQR = () => {
    if (qrRef.current && generatedQR) {
      const canvas = qrRef.current.querySelector('canvas');
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = `QR_${generatedQR.batchId}.png`;
      link.href = url;
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  // Print QR code
  const printQR = () => {
    if (generatedQR) {
      const printWindow = window.open('', '_blank');
      const qrCanvas = qrRef.current.querySelector('canvas');
      const qrDataUrl = qrCanvas.toDataURL();
      
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${generatedQR.batchId}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { margin: 20px auto; }
              .batch-info { margin: 10px 0; }
              img { margin: 20px 0; }
            </style>
          </head>
          <body>
            <h2>TraceHerbss - Batch QR Code</h2>
            <div class="batch-info">
              <strong>Batch ID:</strong> ${generatedQR.batchId}<br>
              <strong>Generated:</strong> ${new Date(generatedQR.generatedAt).toLocaleDateString()}<br>
              <strong>Farmer:</strong> ${generatedQR.farmerName}<br>
              <strong>Location:</strong> ${generatedQR.farmLocation}
            </div>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>
            <p>Scan to verify authenticity and trace journey</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Filter batches and QR codes
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.batchId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Generation</h1>
            <p className="text-gray-600">Generate QR codes for your harvested batches to enable traceability</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">QR Generated</p>
                <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Active QRs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {qrCodes.filter(qr => qr.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search batches or QR codes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="harvested">Harvested</option>
              <option value="processed">Processed</option>
              <option value="shipped">Shipped</option>
            </select>

            <button
              onClick={() => {
                fetchBatches();
                fetchQRCodes();
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button className="py-2 px-1 border-b-2 border-primary text-primary font-medium">
            Generate QR Codes
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            My QR Codes
          </button>
        </nav>
      </div>

      {/* Batches Grid - Generate QR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredBatches.map((batch) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Batch Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{batch.cropName}</h3>
                  <p className="text-sm text-gray-600">{batch.variety}</p>
                </div>
              </div>
              
              {batch.organicCertified && (
                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                  <Award className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Organic</span>
                </div>
              )}
            </div>

            {/* Batch Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>Batch ID: <strong>{batch.id}</strong></span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Harvested: {new Date(batch.harvestDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{batch.farmLocation}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Quantity:</span>
                  <p className="font-medium">{batch.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-500">Grade:</span>
                  <p className="font-medium">{batch.qualityGrade}</p>
                </div>
              </div>
            </div>

            {/* Status and Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  batch.status === 'harvested' ? 'bg-green-400' :
                  batch.status === 'processed' ? 'bg-blue-400' :
                  batch.status === 'shipped' ? 'bg-purple-400' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-600 capitalize">{batch.status}</span>
              </div>

              {batch.qrGenerated ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">QR Generated</span>
                </div>
              ) : (
                <button
                  onClick={() => generateQR(batch)}
                  disabled={generating[batch.id]}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generating[batch.id] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <QrCode className="h-4 w-4" />
                  )}
                  {generating[batch.id] ? 'Generating...' : 'Generate QR'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generated QR Codes Section */}
      {qrCodes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generated QR Codes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQRCodes.map((qr) => (
              <div key={qr.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{qr.cropName}</h3>
                    <p className="text-sm text-gray-600">Batch: {qr.batchId}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    qr.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {qr.status}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <QRCode value={qr.qrUrl} size={120} />
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>Generated: {new Date(qr.generatedAt).toLocaleDateString()}</div>
                  <div>Scans: <strong>{qr.scanCount}</strong></div>
                  {qr.lastScanned && (
                    <div>Last scan: {new Date(qr.lastScanned).toLocaleDateString()}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(qr.qrUrl)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </button>
                  
                  <button
                    onClick={() => window.open(qr.qrUrl, '_blank')}
                    className="flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Generation Modal */}
      {showQRModal && generatedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Generated Successfully!</h3>
              <p className="text-gray-600 mb-6">Batch: {generatedQR.batchId}</p>

              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6" ref={qrRef}>
                <QRCode value={generatedQR.qrUrl} size={200} />
              </div>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>

                <button
                  onClick={printQR}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>

                <button
                  onClick={() => copyToClipboard(generatedQR.qrUrl)}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {filteredBatches.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by uploading your harvest data to generate QR codes'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerQRGeneration;