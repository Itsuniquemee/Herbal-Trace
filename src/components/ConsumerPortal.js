import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Camera, 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Leaf, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Heart,
  Share2,
  Download,
  ExternalLink,
  Clock,
  Thermometer,
  Droplets,
  Sun
} from 'lucide-react';
import ConsumerProductStory from './ConsumerProductStory';
import './ConsumerPortal.css';

const ConsumerPortal = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock product data
  const mockProductData = {
    id: 'TURMERIC_001',
    name: 'Organic Turmeric Powder',
    brand: 'Ayurvedic Heritage',
    herbType: 'Turmeric',
    batchNumber: 'TUR2024001',
    manufacturingDate: '2024-01-15',
    expiryDate: '2025-01-15',
    farmer: {
      name: 'Rajesh Kumar',
      location: 'Rajasthan, India',
      certification: 'Organic Certified',
      experience: '15 years'
    },
    qualityMetrics: {
      moisture: 8.5,
      temperature: 25,
      ph: 6.8,
      color: 'Excellent',
      aroma: 'Strong'
    },
    sustainability: {
      score: 92,
      carbonFootprint: 'Low',
      waterUsage: 'Efficient',
      packaging: 'Biodegradable'
    },
    healthBenefits: [
      { name: 'Anti-inflammatory', icon: '🩹' },
      { name: 'Antioxidant', icon: '🛡️' },
      { name: 'Digestive Health', icon: '🍃' },
      { name: 'Immune Support', icon: '💪' }
    ],
    ingredients: [
      { name: 'Organic Turmeric', percentage: 100 }
    ],
    certifications: [
      'Organic Certified',
      'FSSAI Approved',
      'ISO 22000',
      'Fair Trade'
    ],
    traceability: {
      collectionDate: '2024-01-10',
      processingDate: '2024-01-12',
      packagingDate: '2024-01-15',
      distributionDate: '2024-01-16'
    }
  };

  const handleQRScan = (code) => {
    setScannedCode(code);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setProductData(mockProductData);
      setIsLoading(false);
    }, 1500);
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      setIsLoading(true);
      setSearchQuery(query);
      
      // Simulate search
      setTimeout(() => {
        setProductData(mockProductData);
        setIsLoading(false);
      }, 1000);
    }
  };

  const getHerbIcon = (herbType) => {
    const icons = {
      'Turmeric': '🟡',
      'Ashwagandha': '🌿',
      'Ginger': '🟠',
      'Tulsi': '🟢',
      'Neem': '🌳',
      'Amla': '🟤'
    };
    return icons[herbType] || '🌿';
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="consumer-portal min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-foreground">Consumer Portal</h1>
          <p className="text-lg text-muted-foreground">
            Scan QR codes to discover the complete journey of your Ayurvedic herbs
          </p>
        </motion.div>

        {/* QR Scanner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-8"
        >
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-primary rounded-full">
                <QrCode className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Scan Product QR Code
              </h2>
              <p className="text-muted-foreground">
                Point your camera at the QR code on your product to view its complete story
              </p>
            </div>

            <div className="qr-scan-area">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {isScanning ? 'Scanning...' : 'Ready to Scan'}
              </p>
              <p className="text-muted-foreground mb-4">
                Position the QR code within the camera view
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsScanning(!isScanning)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {isScanning ? 'Stop Scanning' : 'Start Camera'}
                </button>
                <button
                  onClick={() => handleQRScan('TURMERIC_001')}
                  className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Demo Scan
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Or Search by Product Code</h3>
            <div className="max-w-md mx-auto flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter product code (e.g., TURMERIC_001)"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading product information...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Information */}
        <AnimatePresence>
          {productData && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Product Header */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="herb-icon turmeric">
                      {getHerbIcon(productData.herbType)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{productData.name}</h2>
                      <p className="text-muted-foreground">{productData.brand}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Batch: {productData.batchNumber}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Expires: {new Date(productData.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <Share2 className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <Download className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quality Metrics */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Quality Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="metric-card">
                    <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="metric-value">{productData.qualityMetrics.moisture}%</div>
                    <div className="metric-label">Moisture</div>
                  </div>
                  <div className="metric-card">
                    <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <div className="metric-value">{productData.qualityMetrics.temperature}°C</div>
                    <div className="metric-label">Temperature</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{productData.qualityMetrics.ph}</div>
                    <div className="metric-label">pH Level</div>
                  </div>
                  <div className="metric-card">
                    <div className={`metric-value ${getQualityColor(productData.qualityMetrics.color)}`}>
                      {productData.qualityMetrics.color}
                    </div>
                    <div className="metric-label">Color</div>
                  </div>
                  <div className="metric-card">
                    <div className={`metric-value ${getQualityColor(productData.qualityMetrics.aroma)}`}>
                      {productData.qualityMetrics.aroma}
                    </div>
                    <div className="metric-label">Aroma</div>
                  </div>
                </div>
              </div>

              {/* Sustainability Score */}
              <div className="sustainability-score">
                <h3 className="text-xl font-semibold mb-4">Sustainability Score</h3>
                <div className="score-circle">
                  {productData.sustainability.score}
                </div>
                <p className="text-sm opacity-90">
                  This product has a {productData.sustainability.score}% sustainability score
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <div className="font-medium">Carbon Footprint</div>
                    <div className="opacity-90">{productData.sustainability.carbonFootprint}</div>
                  </div>
                  <div>
                    <div className="font-medium">Water Usage</div>
                    <div className="opacity-90">{productData.sustainability.waterUsage}</div>
                  </div>
                  <div>
                    <div className="font-medium">Packaging</div>
                    <div className="opacity-90">{productData.sustainability.packaging}</div>
                  </div>
                </div>
              </div>

              {/* Health Benefits */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Health Benefits</h3>
                <div className="health-benefits">
                  {productData.healthBenefits.map((benefit, index) => (
                    <div key={index} className="benefit-card">
                      <div className="benefit-icon">
                        <span className="text-xl">{benefit.icon}</span>
                      </div>
                      <div className="font-medium text-foreground">{benefit.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {productData.certifications.map((cert, index) => (
                    <span key={index} className="certificate-badge">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Story */}
              <ConsumerProductStory productData={productData} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Product State */}
        {!productData && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Product Scanned
            </h3>
            <p className="text-muted-foreground">
              Scan a QR code or search for a product to view its information
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPortal;