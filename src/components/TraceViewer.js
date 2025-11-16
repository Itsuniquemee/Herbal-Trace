import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Leaf,
  MapPin,
  Calendar,
  User,
  Package
} from 'lucide-react';
import qrService from '../utils/QRService';

const TraceViewer = () => {
  const { traceId } = useParams();
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (traceId) {
      // Get trace data from QRService
      const data = qrService.getFullData(traceId);
      
      if (data) {
        setTraceData(data);
        setError(null);
      } else {
        setError('Trace data not found. This trace may have been created on a different device or the data may have been cleared.');
      }
    } else {
      setError('No trace ID provided');
    }
    
    setLoading(false);
  }, [traceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trace data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center"
        >
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Trace Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (!traceData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Verified Authentic
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Product Verification</h1>
          <p className="text-muted-foreground">Trace ID: <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{traceId}</span></p>
        </motion.div>

        {/* Product Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{traceData.productInfo.name}</h2>
                <p className="text-muted-foreground">{traceData.productInfo.botanicalName}</p>
                <p className="text-sm text-muted-foreground">{traceData.productInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Quality Grade</div>
              <div className="text-lg font-semibold text-primary">{traceData.productInfo.quality}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Farmer</div>
                <div className="font-medium">{traceData.productInfo.farmer}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{traceData.productInfo.location}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Harvest Date</div>
                <div className="font-medium">{new Date(traceData.productInfo.harvestDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Batch</div>
                <div className="font-medium">{traceData.productInfo.batch}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{traceData.qualityMetrics.purity}</div>
            <div className="text-sm text-muted-foreground">Purity</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{traceData.testReports.moisture}</div>
            <div className="text-sm text-muted-foreground">Moisture</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{traceData.qualityMetrics.potency}</div>
            <div className="text-sm text-muted-foreground">Potency</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-muted-foreground">Organic Certified</div>
          </div>
        </motion.div>

        {/* Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Supply Chain Journey</h3>
          <div className="space-y-4">
            {traceData.journey.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{step.stage}</p>
                    <span className="text-sm text-muted-foreground">{new Date(step.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{step.location}</p>
                  <p className="text-sm text-foreground">{step.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">👤 {step.responsible}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Organic Certified</h4>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Authority:</span> {traceData.certifications.organic.certifyingBody}</div>
                <div><span className="font-medium">Certificate:</span> {traceData.certifications.organic.certificateNumber}</div>
                <div><span className="font-medium">Valid Until:</span> {new Date(traceData.certifications.organic.validUntil).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">FSSAI Licensed</h4>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">License:</span> {traceData.certifications.fssai.licenseNumber}</div>
                <div><span className="font-medium">Category:</span> {traceData.certifications.fssai.category}</div>
                <div><span className="font-medium">Valid Until:</span> {new Date(traceData.certifications.fssai.validUntil).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-muted/50 rounded-lg p-6 text-center"
        >
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-2">Verified by HerbalTrace</h4>
            <p className="text-sm text-muted-foreground">
              This product has been verified through our blockchain-based traceability system
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-foreground">Company</div>
              <div className="text-muted-foreground">{traceData.traceability.companyInfo.name}</div>
            </div>
            <div>
              <div className="font-medium text-foreground">Contact</div>
              <div className="text-muted-foreground">{traceData.traceability.companyInfo.contact}</div>
            </div>
            <div>
              <div className="font-medium text-foreground">Verification Date</div>
              <div className="text-muted-foreground">{new Date(traceData.traceability.generatedAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Blockchain Hash: <span className="font-mono">{traceData.traceability.blockchainHash}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TraceViewer;