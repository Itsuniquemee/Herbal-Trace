import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Flashlight,
  FlashlightOff,
  X,
  Plus,
  Download,
  Search,
  MapPin,
  Calendar,
  User,
  Package,
  Leaf,
  Eye,
  History,
  RefreshCw,
  Database,
  Upload
} from 'lucide-react';
import { productTracker, trackingUtils } from '../utils/productTracker';
import { collectionsService } from '../utils/collectionsData';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import qrService from '../utils/QRService';

// Mock product database
const mockProducts = [
  {
    id: 'TURMERIC_001',
    name: 'Organic Turmeric',
    farmer: 'Rajesh Kumar',
    location: 'Rajasthan',
    harvestDate: '2024-08-15',
    quality: 'Premium',
    batch: 'TUR001',
    status: 'Verified',
    journey: [
      { stage: 'Cultivation', date: '2024-03-01', location: 'Farm - Rajasthan', status: 'Completed' },
      { stage: 'Harvest', date: '2024-08-15', location: 'Farm - Rajasthan', status: 'Completed' },
      { stage: 'Processing', date: '2024-08-20', location: 'Processing Unit - Jaipur', status: 'Completed' },
      { stage: 'Testing', date: '2024-08-22', location: 'Quality Lab - Jaipur', status: 'Completed' },
      { stage: 'Packaging', date: '2024-08-25', location: 'Packaging Unit - Delhi', status: 'In Progress' }
    ]
  },
  {
    id: 'ASHWAGANDHA_002',
    name: 'Wild Ashwagandha',
    farmer: 'Priya Sharma',
    location: 'Himachal Pradesh',
    harvestDate: '2024-09-01',
    quality: 'Premium',
    batch: 'ASH002',
    status: 'Verified',
    journey: [
      { stage: 'Wild Collection', date: '2024-09-01', location: 'Hills - Himachal Pradesh', status: 'Completed' },
      { stage: 'Initial Processing', date: '2024-09-03', location: 'Collection Center - Shimla', status: 'Completed' },
      { stage: 'Quality Testing', date: '2024-09-05', location: 'Testing Lab - Chandigarh', status: 'In Progress' }
    ]
  }
];

const QRScanner = () => {
  // Core scanner state
  const [activeTab, setActiveTab] = useState('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // QR Generation state (Admin only)
  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    farmer: '',
    location: '',
    harvestDate: '',
    quality: 'Premium',
    batch: ''
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedInfoTab, setSelectedInfoTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Collections data state
  const [availableCollections, setAvailableCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState('');
  
  // QR Image Upload state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedQRData, setUploadedQRData] = useState(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Mock user - in real app, get from context
  const mockUser = { role: 'admin', name: 'Dr. Admin Singh' };

  useEffect(() => {
    // Load scan history from localStorage
    const savedHistory = localStorage.getItem('qr_scan_history');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }

    // Load generated QRs from localStorage
    const savedQRs = localStorage.getItem('generated_qrs');
    if (savedQRs) {
      setGeneratedQRs(JSON.parse(savedQRs));
    }

    // Load available collections
    const collections = collectionsService.getCollectionsByStatus('Available');
    setAvailableCollections(collections);

    // Clean up mixed data types in scannedCodes - reset to empty for fresh start
    setScannedCodes([]);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied or not available');
      console.error('Camera error:', err);
    }
  };

  const startScanning = () => {
    if (hasPermission && videoRef.current) {
      setIsScanning(true);
      setError(null);
      
      // Simulate QR code detection
      // In a real app, you would use a QR code detection library like jsQR
      setTimeout(() => {
        const mockQRCode = 'TURMERIC_001';
        handleQRCodeDetected(mockQRCode);
      }, 2000);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleQRCodeDetected = (code) => {
    if (!scannedCodes.some(scan => (typeof scan === 'string' ? scan : scan.code) === code)) {
      // Check if it's our new optimized format
      const validation = qrService.validateQRData(code);
      let product = null;
      let actualCode = code;
      
      if (validation.isValid) {
        // Get full data using trace ID
        const fullData = qrService.getFullData(validation.traceId);
        if (fullData) {
          product = fullData.productInfo;
          actualCode = validation.traceId;
        }
      } else {
        // Try to find product using legacy method
        product = getProductInfo(code);
      }
      
      // Create scan object for consistency
      const newScan = {
        id: `camera_${Date.now()}`,
        code: actualCode,
        data: code,
        timestamp: Date.now(),
        scannedBy: 'Camera Scan',
        product: product
      };
      
      setScannedCodes(prev => [newScan, ...prev]);
      
      // Add to scan history
      const scanRecord = {
        id: Date.now(),
        code: actualCode,
        timestamp: new Date().toISOString(),
        scannedBy: mockUser.name,
        product: product
      };
      
      setScanHistory(prev => {
        const updated = [scanRecord, ...prev.slice(0, 49)]; // Keep last 50 scans
        localStorage.setItem('qr_scan_history', JSON.stringify(updated));
        return updated;
      });
      
      // Show success feedback
      setTimeout(() => {
        setIsScanning(false);
        if (product) {
          // For new format, create a compatible product object
          if (validation.isValid) {
            const fullData = qrService.getFullData(validation.traceId);
            if (fullData) {
              const compatibleProduct = {
                ...fullData.productInfo,
                id: validation.traceId,
                status: 'Verified',
                journey: fullData.journey || [],
                testReports: fullData.testReports,
                certifications: fullData.certifications,
                farmDetails: fullData.farmDetails,
                qualityMetrics: fullData.qualityMetrics,
                traditionalUse: fullData.usageInformation?.traditionalUse
              };
              setSelectedProduct(compatibleProduct);
            }
          } else {
            setSelectedProduct(product);
          }
        }
      }, 2000);
    }
  };

  // QR Generation functions (Admin only) - Now using QRService

  // Handle collection selection and auto-populate form
  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    setNewProduct({
      name: collection.herbType,
      farmer: collection.farmerName,
      location: `${collection.location.address}`,
      harvestDate: collection.harvestDate,
      quality: collection.qualityGrade,
      batch: collection.batchNumber || `${collection.herbType.substring(0,3).toUpperCase()}_${Date.now()}`
    });
    setShowCollectionSelector(false);
    
    // Also update collection status to 'In Processing'
    collectionsService.updateCollectionStatus(collection.id, 'In Processing');
  };

  // Reset form and collection selection
  const resetForm = () => {
    setNewProduct({
      name: '',
      farmer: '',
      location: '',
      harvestDate: '',
      quality: 'Premium',
      batch: ''
    });
    setSelectedCollection(null);
  };

  // Filter collections based on search term
  const filteredCollections = availableCollections.filter(collection =>
    collection.herbType.toLowerCase().includes(collectionFilter.toLowerCase()) ||
    collection.farmerName.toLowerCase().includes(collectionFilter.toLowerCase()) ||
    collection.location.address.toLowerCase().includes(collectionFilter.toLowerCase())
  );

  // Helper functions for UI display
  const getActiveCompounds = (herbName) => {
    const compounds = {
      'Tulsi': [
        { name: 'Eugenol', content: '0.8-1.2%', function: 'Antimicrobial, anti-inflammatory' },
        { name: 'Rosmarinic acid', content: '0.2-0.5%', function: 'Antioxidant' }
      ],
      'Neem': [
        { name: 'Azadirachtin', content: '0.2-0.6%', function: 'Insecticidal, antimicrobial' },
        { name: 'Nimbidin', content: '0.4-0.8%', function: 'Anti-inflammatory' }
      ],
      'Turmeric': [
        { name: 'Curcumin', content: '2.5-3.8%', function: 'Anti-inflammatory, antioxidant' },
        { name: 'Demethoxycurcumin', content: '0.8-1.2%', function: 'Anti-inflammatory' }
      ],
      'Ginger': [
        { name: 'Gingerol', content: '1.0-3.0%', function: 'Anti-inflammatory, digestive aid' },
        { name: 'Shogaol', content: '0.1-0.2%', function: 'Antioxidant' }
      ],
      'Ashwagandha': [
        { name: 'Withanolides', content: '0.3-3.0%', function: 'Adaptogenic, stress relief' },
        { name: 'Alkaloids', content: '0.13-0.31%', function: 'Nervous system support' }
      ]
    };
    return compounds[herbName] || [
      { name: 'Primary active compounds', content: 'Under analysis', function: 'Therapeutic properties' }
    ];
  };

  const getGPSCoordinates = (location) => {
    const coordinates = {
      'Maharashtra': '19.7515° N, 75.7139° E',
      'Karnataka': '15.3173° N, 75.7139° E',
      'Kerala': '10.8505° N, 76.2711° E',
      'Tamil Nadu': '11.1271° N, 78.6569° E',
      'Rajasthan': '27.0238° N, 74.2179° E',
      'Gujarat': '22.2587° N, 71.1924° E'
    };
    return coordinates[location] || '20.5937° N, 78.9629° E';
  };

  const getNextDate = (dateString, daysAfter) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + daysAfter);
      return fallbackDate.toISOString().split('T')[0];
    }
    date.setDate(date.getDate() + daysAfter);
    return date.toISOString().split('T')[0];
  };

  // QR data creation now handled by QRService

  const handleGenerateQR = async () => {
    if (!newProduct.name || !newProduct.farmer || !newProduct.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Use QRService to create optimized QR data
      const qrResult = qrService.createQRData(newProduct, selectedCollection);
      
      // Check if this exact product already exists
      const existingQR = generatedQRs.find(qr => qr.traceId === qrResult.traceId);
      if (existingQR) {
        setError(`QR Code for this product already exists: ${qrResult.traceId}`);
        return;
      }

      // Generate QR code image using the optimized string (much shorter!)
      const qrCodeDataURL = await QRCode.toDataURL(qrResult.qrString, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      // Create product with QR image and trace data
      const productData = {
        id: qrResult.traceId,
        traceId: qrResult.traceId,
        ...newProduct,
        createdBy: mockUser.name,
        collectionId: selectedCollection?.id || null,
        collectionData: selectedCollection || null,
        qrCode: qrCodeDataURL,
        qrData: qrResult.qrString, // Store the short URL instead of full data
        fullData: qrResult.fullData, // Keep reference to full data
        createdAt: new Date().toISOString()
      };

      // Add to generated QRs state
      setGeneratedQRs(prev => [productData, ...prev]);

      // Save to localStorage (legacy storage for compatibility)
      const savedQRs = JSON.parse(localStorage.getItem('generated_qrs') || '[]');
      savedQRs.unshift(productData);
      localStorage.setItem('generated_qrs', JSON.stringify(savedQRs));

      // Reset form
      resetForm();
      setShowProductForm(false);
      setError(null);
      
      // Refresh available collections
      const collections = collectionsService.getCollectionsByStatus('Available');
      setAvailableCollections(collections);
      
      console.log(`✅ QR Code generated successfully! Trace ID: ${qrResult.traceId}`);
      console.log(`📊 QR String length: ${qrResult.qrString.length} characters (well below limit)`);
      
    } catch (error) {
      setError('Failed to generate QR code: ' + error.message);
      console.error('QR Generation error:', error);
    }
  };

    const downloadQR = (productId) => {
    const qrProduct = generatedQRs.find(qr => qr.id === productId);
    if (!qrProduct || !qrProduct.qrCode) {
      setError('QR Code not found');
      return;
    }

    try {
      // Create a canvas to add product info to the QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions (QR code + space for text)
        canvas.width = 600;
        canvas.height = 700;
        
        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR code centered
        const qrSize = 400;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 50;
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        
        // Add product information below QR code
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        
        // Title
        ctx.fillText('HerbalTrace Product Verification', canvas.width / 2, qrY + qrSize + 40);
        
        // Product details
        ctx.font = '18px Arial';
        const startY = qrY + qrSize + 70;
        const lineHeight = 25;
        
        ctx.fillText(`Product: ${qrProduct.name}`, canvas.width / 2, startY);
        ctx.fillText(`Farmer: ${qrProduct.farmer}`, canvas.width / 2, startY + lineHeight);
        ctx.fillText(`Location: ${qrProduct.location}`, canvas.width / 2, startY + lineHeight * 2);
        ctx.fillText(`Quality: ${qrProduct.quality}`, canvas.width / 2, startY + lineHeight * 3);
        ctx.fillText(`Product ID: ${qrProduct.id}`, canvas.width / 2, startY + lineHeight * 4);
        
        // Instructions
        ctx.font = '14px Arial';
        ctx.fillText('Scan this QR code to verify product authenticity', canvas.width / 2, startY + lineHeight * 6);
        ctx.fillText('Generated by HerbalTrace System', canvas.width / 2, startY + lineHeight * 7);
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `QR-${qrProduct.name.replace(/[^a-zA-Z0-9]/g, '_')}-${qrProduct.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      
      img.onerror = () => {
        setError('Failed to load QR code image');
      };
      
      img.src = qrProduct.qrCode;
    } catch (error) {
      setError('Failed to download QR code: ' + error.message);
    }
  };

  const getProductInfo = (code) => {
    // First check tracked products
    const trackedProduct = productTracker.getProduct(code);
    if (trackedProduct) return trackedProduct;

    // Fallback to mock products
    return mockProducts.find(p => p.id === code);
  };

  const toggleFlashlight = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.getCapabilities().torch) {
        videoTrack.applyConstraints({
          advanced: [{ torch: !flashlightOn }]
        }).then(() => {
          setFlashlightOn(!flashlightOn);
        }).catch(err => {
          console.error('Flashlight error:', err);
        });
      }
    }
  };



  const resetScanner = () => {
    stopScanning();
    setTimeout(() => {
      requestCameraPermission();
    }, 500);
    setUploadedImage(null);
    setUploadedQRData(null);
    setUploadError(null);
  };

  // Handle QR image upload and processing
  const handleQRImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous states
    setUploadError(null);
    setUploadedQRData(null);
    setIsProcessingUpload(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file (PNG, JPG, etc.)');
      }

      // Create image preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Create an image element to read QR code
      const img = new Image();
      img.onload = () => {
        try {
          // Create canvas to extract image data
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Multiple detection attempts for better reliability
          let qrCode = null;
          let detectionAttempt = 1;

          // Attempt 1: Scan full image
          console.log(`QR Detection Attempt ${detectionAttempt}: Full image scan`);
          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          // Attempt 2: If our generated QR format (600x700 with QR at center), crop the QR area
          if (!qrCode && canvas.width === 600 && canvas.height === 700) {
            detectionAttempt++;
            console.log(`QR Detection Attempt ${detectionAttempt}: Cropped QR area for HerbalTrace format`);
            // Our QR code is at (100, 50) with size 400x400
            const qrX = Math.max(0, 100 - 20); // Add some padding
            const qrY = Math.max(0, 50 - 20);
            const qrWidth = Math.min(440, canvas.width - qrX); // QR size + padding
            const qrHeight = Math.min(440, canvas.height - qrY);
            
            imageData = ctx.getImageData(qrX, qrY, qrWidth, qrHeight);
            qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });
          }

          // Attempt 3: Try center crop for any image size
          if (!qrCode) {
            detectionAttempt++;
            console.log(`QR Detection Attempt ${detectionAttempt}: Center crop approach`);
            const cropSize = Math.min(canvas.width, canvas.height) * 0.8;
            const cropX = (canvas.width - cropSize) / 2;
            const cropY = (canvas.height - cropSize) / 2;
            
            imageData = ctx.getImageData(cropX, cropY, cropSize, cropSize);
            qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });
          }

          // Attempt 4: Try with different inversion settings on full image
          if (!qrCode) {
            detectionAttempt++;
            console.log(`QR Detection Attempt ${detectionAttempt}: Full image with inversion`);
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });
          }

          // Attempt 5: Try grayscale conversion
          if (!qrCode) {
            detectionAttempt++;
            console.log(`QR Detection Attempt ${detectionAttempt}: Grayscale conversion`);
            
            // Convert to grayscale
            const grayscaleCanvas = document.createElement('canvas');
            const grayscaleCtx = grayscaleCanvas.getContext('2d');
            grayscaleCanvas.width = canvas.width;
            grayscaleCanvas.height = canvas.height;
            
            grayscaleCtx.drawImage(canvas, 0, 0);
            imageData = grayscaleCtx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Convert to grayscale
            for (let i = 0; i < imageData.data.length; i += 4) {
              const gray = imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114;
              imageData.data[i] = gray;     // Red
              imageData.data[i + 1] = gray; // Green
              imageData.data[i + 2] = gray; // Blue
            }
            
            qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });
          }
          
          if (qrCode) {
            console.log(`QR Code detected successfully on attempt ${detectionAttempt}`);
            console.log('QR Data:', qrCode.data);
            
            // First check if it's our new optimized format (URL-based)
            const validation = qrService.validateQRData(qrCode.data);
            
            if (validation.isValid) {
              // Get full data using trace ID
              const fullData = qrService.getFullData(validation.traceId);
              
              if (fullData) {
                setUploadedQRData(fullData);
                setUploadError(null);
                
                // Add to scan history
                const newScan = {
                  id: `upload_${Date.now()}`,
                  code: validation.traceId,
                  data: qrCode.data,
                  timestamp: Date.now(),
                  scannedBy: 'File Upload',
                  product: fullData.productInfo
                };
                
                setScannedCodes(prev => [newScan, ...prev]);
                
                // Save to localStorage
                const history = JSON.parse(localStorage.getItem('qr_scan_history') || '[]');
                history.unshift(newScan);
                localStorage.setItem('qr_scan_history', JSON.stringify(history));
                
              } else {
                setUploadError(`Valid HerbalTrace QR code found, but trace data not available locally. Trace ID: ${validation.traceId}`);
              }
            } else {
              // Try legacy format (full JSON)
              try {
                const qrData = JSON.parse(qrCode.data);
                
                // Validate if this is our old HerbalTrace QR code
                if (qrData.productId && qrData.productInfo && qrData.traceability) {
                  setUploadedQRData(qrData);
                  setUploadError(null);
                  
                  // Add to scan history
                  const newScan = {
                    id: `upload_${Date.now()}`,
                    code: typeof qrData.productId === 'string' ? qrData.productId : String(qrData.productId),
                    data: qrCode.data,
                    timestamp: Date.now(),
                    scannedBy: 'File Upload (Legacy)',
                    product: qrData.productInfo
                  };
                  
                  setScannedCodes(prev => [newScan, ...prev]);
                  
                  // Save to localStorage
                  const history = JSON.parse(localStorage.getItem('qr_scan_history') || '[]');
                  history.unshift(newScan);
                  localStorage.setItem('qr_scan_history', JSON.stringify(history));
                  
                } else {
                  throw new Error('This QR code was not generated by HerbalTrace system');
                }
              } catch (parseError) {
                console.error('QR parsing error:', parseError);
                setUploadError('This QR code was not generated by HerbalTrace system. Only QR codes created through our platform can be verified.');
              }
            }
          } else {
            console.log(`QR Code detection failed after ${detectionAttempt} attempts`);
            console.log('Image dimensions:', canvas.width, 'x', canvas.height);
            setUploadError('No QR code found in the uploaded image. Please ensure the image contains a clear, readable QR code.');
          }
          
          // Clean up
          URL.revokeObjectURL(imageUrl);
        } catch (error) {
          console.error('QR processing error:', error);
          setUploadError('Failed to process the uploaded image: ' + error.message);
          URL.revokeObjectURL(imageUrl);
        } finally {
          setIsProcessingUpload(false);
        }
      };
      
      img.onerror = () => {
        setUploadError('Failed to load the uploaded image. Please try a different image.');
        setIsProcessingUpload(false);
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
    } catch (error) {
      setUploadError(error.message);
      setIsProcessingUpload(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Code Management</h1>
          <p className="text-muted-foreground">Scan QR codes to verify products or generate new ones</p>
        </div>
        {mockUser.role === 'admin' && (
          <button
            onClick={() => setShowProductForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Generate QR</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('scan')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scan'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>Scan QR</span>
          </div>
        </button>
        {mockUser.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>Generated QRs</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Scan History</span>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Scan Tab */}
        {activeTab === 'scan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scanner Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">QR Code Scanner</h2>
              
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
                {hasPermission === null && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Requesting camera permission...</p>
                    </div>
                  </div>
                )}

                {hasPermission === false && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center max-w-sm">
                      <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
                      <p className="text-gray-300 mb-4">
                        Please allow camera access to scan QR codes
                      </p>
                      <button
                        onClick={requestCameraPermission}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Enable Camera
                      </button>
                    </div>
                  </div>
                )}

                {hasPermission && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Scanning Frame */}
                        <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                          {/* Corner indicators */}
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                          
                          {/* Scanning Line */}
                          {isScanning && (
                            <motion.div
                              className="absolute left-0 right-0 h-1 bg-primary"
                              animate={{ y: [0, 192, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <p className="text-red-400">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanner Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {hasPermission && (
                  <>
                    <button
                      onClick={isScanning ? stopScanning : startScanning}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                        isScanning 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {isScanning ? (
                        <CameraOff className="h-5 w-5" />
                      ) : (
                        <Camera className="h-5 w-5" />
                      )}
                      <span>{isScanning ? 'Stop Scanning' : 'Start Scanning'}</span>
                    </button>

                    <button
                      onClick={toggleFlashlight}
                      className="p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                      {flashlightOn ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
                    </button>

                    <button
                      onClick={resetScanner}
                      className="p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* QR Image Upload Section */}
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload QR Image
                </h3>
                
                <div className="space-y-4">
                  {/* File Upload Input */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="qr-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> a QR code image
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 10MB)</p>
                      </div>
                      <input
                        id="qr-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleQRImageUpload}
                        disabled={isProcessingUpload}
                      />
                    </label>
                  </div>

                  {/* Processing Indicator */}
                  {isProcessingUpload && (
                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                      <span className="text-sm text-muted-foreground">Processing QR code image...</span>
                    </div>
                  )}

                  {/* Upload Error */}
                  {uploadError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">{uploadError}</span>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Image Preview */}
                  {uploadedImage && (
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Uploaded Image:</h4>
                      <img
                        src={uploadedImage}
                        alt="Uploaded QR Code"
                        className="max-w-full h-32 object-contain border border-border rounded"
                      />
                    </div>
                  )}

                  {/* Upload Success - QR Data Display */}
                  {uploadedQRData && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold text-green-800">QR Code Successfully Scanned!</span>
                        </div>
                        <button
                          onClick={() => {
                            // Normalize the uploadedQRData structure to match selectedProduct expectations
                            const normalizedProduct = {
                              ...uploadedQRData.productInfo,
                              id: uploadedQRData.productId,
                              status: 'Verified',
                              journey: uploadedQRData.journey || [],
                              testReports: uploadedQRData.testReports,
                              certifications: uploadedQRData.certifications,
                              farmDetails: uploadedQRData.farmDetails,
                              qualityMetrics: uploadedQRData.qualityMetrics,
                              traditionalUse: uploadedQRData.usageInformation?.traditionalUse,
                              // Ensure harvestDate is properly formatted
                              harvestDate: uploadedQRData.productInfo?.harvestDate || new Date().toISOString().split('T')[0]
                            };
                            setSelectedProduct(normalizedProduct);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          View Full Details
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-green-800">Product:</span>
                          <span className="ml-2 text-green-700">{uploadedQRData.productInfo.name}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Quality:</span>
                          <span className="ml-2 text-green-700">{uploadedQRData.productInfo.quality}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Farmer:</span>
                          <span className="ml-2 text-green-700">{uploadedQRData.productInfo.farmer}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Product ID:</span>
                          <span className="ml-2 text-green-700">{uploadedQRData.productId}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-white rounded border text-xs">
                        <div className="font-medium text-green-800 mb-1">Verification Status:</div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">✓ Authentic HerbalTrace Product</span>
                          <span className="text-green-600">Blockchain Verified</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Scans */}
              {scannedCodes.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-foreground">Recent Scans</h3>
                  {scannedCodes.slice(-3).reverse().map((scan, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                          {typeof scan === 'string' ? scan : (typeof scan.code === 'string' ? scan.code : (scan.product?.name || scan.code?.toString() || 'Unknown Product'))}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {typeof scan === 'string' ? 'Legacy Scan' : scan.scannedBy} • {typeof scan === 'string' ? 'Unknown' : new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Product Information</h2>
              
              {selectedProduct ? (
                <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                  {/* Product Header */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{selectedProduct.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedProduct.botanicalName || selectedProduct.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedProduct.status === 'Verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        ✓ Verified Authentic
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Farmer: {selectedProduct.farmer}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Location: {selectedProduct.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Harvest: {selectedProduct.harvestDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Batch: {selectedProduct.batch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information Tabs */}
                  <div className="bg-card border border-border rounded-lg">
                    <div className="border-b border-border">
                      <nav className="flex space-x-8 px-6" aria-label="Product Info Tabs">
                        {['overview', 'journey', 'tests', 'certifications', 'farm'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setSelectedInfoTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                              selectedInfoTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                            }`}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div className="p-6">
                      {/* Overview Tab */}
                      {selectedInfoTab === 'overview' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Product Details</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Category:</span> {selectedProduct.category || 'Medicinal Herbs'}</div>
                                <div><span className="font-medium">Quality Grade:</span> {selectedProduct.quality}</div>
                                <div><span className="font-medium">Shelf Life:</span> {selectedProduct.shelfLife || '24 months'}</div>
                                <div><span className="font-medium">Storage:</span> {selectedProduct.storageConditions || 'Cool, dry place'}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Usage Information</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Traditional Use:</span></div>
                                <p className="text-muted-foreground">{selectedProduct.traditionalUse || 'Traditional medicinal herb'}</p>
                                <div><span className="font-medium">Preparation:</span> Powder, decoction, or capsule</div>
                                <div><span className="font-medium">Dosage:</span> As per practitioner advice</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quality Metrics */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Quality Metrics</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="bg-muted rounded p-3 text-center">
                                <div className="font-medium text-lg text-green-600">98.5%</div>
                                <div className="text-muted-foreground">Purity</div>
                              </div>
                              <div className="bg-muted rounded p-3 text-center">
                                <div className="font-medium text-lg text-blue-600">8.2%</div>
                                <div className="text-muted-foreground">Moisture</div>
                              </div>
                              <div className="bg-muted rounded p-3 text-center">
                                <div className="font-medium text-lg text-purple-600">6.8%</div>
                                <div className="text-muted-foreground">Ash Content</div>
                              </div>
                              <div className="bg-muted rounded p-3 text-center">
                                <div className="font-medium text-lg text-orange-600">High</div>
                                <div className="text-muted-foreground">Potency</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Journey Tab */}
                      {selectedInfoTab === 'journey' && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground mb-4">Complete Supply Chain Journey</h4>
                          <div className="space-y-4">
                            {selectedProduct.journey && selectedProduct.journey.map((step, index) => (
                              <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                                <div className={`p-2 rounded-full ${
                                  step.status === 'Completed' 
                                    ? 'bg-green-100 text-green-600' 
                                    : step.status === 'In Progress'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-foreground">{step.stage}</p>
                                    <span className="text-sm text-muted-foreground">{step.date}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">{step.location}</p>
                                  <p className="text-sm text-foreground">{step.details}</p>
                                  <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>👤 {step.responsible}</span>
                                    {step.gpsLocation && <span>📍 {step.gpsLocation}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tests Tab */}
                      {selectedInfoTab === 'tests' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Laboratory Test Reports</h4>
                            <div className="bg-muted/50 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Lab:</span> National Testing Laboratory</div>
                                <div><span className="font-medium">Test Date:</span> {new Date().toISOString().split('T')[0]}</div>
                                <div><span className="font-medium">Report No:</span> RPT{Date.now().toString().slice(-6)}</div>
                                <div><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">✓ All Tests Passed</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Test Results */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-foreground mb-3">Pesticide Analysis</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Organochlorines:</span>
                                  <span className="text-green-600">Not Detected</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Organophosphates:</span>
                                  <span className="text-green-600">Not Detected</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Detection Limit:</span>
                                  <span>&lt;0.01 ppm</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Result:</span>
                                  <span className="text-green-600">✓ Passed</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-foreground mb-3">Heavy Metals</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Lead:</span>
                                  <span className="text-green-600">0.05 ppm (&lt;2.5)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Mercury:</span>
                                  <span className="text-green-600">0.02 ppm (&lt;0.1)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Cadmium:</span>
                                  <span className="text-green-600">0.03 ppm (&lt;0.3)</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Result:</span>
                                  <span className="text-green-600">✓ Within Limits</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-foreground mb-3">Microbiology</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Total Viable Count:</span>
                                  <span className="text-green-600">2.1×10³ CFU/g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Yeast & Mold:</span>
                                  <span className="text-green-600">1.8×10² CFU/g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>E.coli:</span>
                                  <span className="text-green-600">Absent</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Result:</span>
                                  <span className="text-green-600">✓ Passed</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-foreground mb-3">Active Compounds</h5>
                              <div className="space-y-2 text-sm">
                                {getActiveCompounds(selectedProduct.name).map((compound, idx) => (
                                  <div key={idx} className="border-b border-border pb-2">
                                    <div className="flex justify-between font-medium">
                                      <span>{compound.name}:</span>
                                      <span className="text-blue-600">{compound.content}</span>
                                    </div>
                                    <div className="text-muted-foreground text-xs">{compound.function}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Certifications Tab */}
                      {selectedInfoTab === 'certifications' && (
                        <div className="space-y-6">
                          <h4 className="font-semibold text-foreground mb-4">Certifications & Compliance</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <h5 className="font-semibold text-green-800">Organic Certified</h5>
                              </div>
                              <div className="text-sm space-y-1">
                                <div><span className="font-medium">Authority:</span> India Organic Certification Agency</div>
                                <div><span className="font-medium">Certificate No:</span> IOCA-ORG-2024-{Math.random().toString(36).substring(2, 6).toUpperCase()}</div>
                                <div><span className="font-medium">Valid Until:</span> {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <h5 className="font-semibold text-blue-800">FSSAI Licensed</h5>
                              </div>
                              <div className="text-sm space-y-1">
                                <div><span className="font-medium">License No:</span> 10{Math.random().toString().substring(2, 15)}</div>
                                <div><span className="font-medium">Category:</span> Nutraceuticals</div>
                                <div><span className="font-medium">Valid Until:</span> {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</div>
                              </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-5 h-5 text-purple-600" />
                                </div>
                                <h5 className="font-semibold text-purple-800">ISO 22000:2018</h5>
                              </div>
                              <div className="text-sm space-y-1">
                                <div><span className="font-medium">Standard:</span> Food Safety Management</div>
                                <div><span className="font-medium">Certificate No:</span> ISO22000-2024-{Math.random().toString(36).substring(2, 6).toUpperCase()}</div>
                                <div><span className="font-medium">Valid Until:</span> {new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</div>
                              </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-5 h-5 text-orange-600" />
                                </div>
                                <h5 className="font-semibold text-orange-800">GMP Certified</h5>
                              </div>
                              <div className="text-sm space-y-1">
                                <div><span className="font-medium">Authority:</span> Dept. of AYUSH, Govt. of India</div>
                                <div><span className="font-medium">Certificate No:</span> GMP-AYUSH-2024-{Math.random().toString(36).substring(2, 6).toUpperCase()}</div>
                                <div><span className="font-medium">Standard:</span> Good Manufacturing Practices</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-4">
                            <h5 className="font-semibold text-foreground mb-3">Additional Compliance</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-green-600 font-medium">✓ WHO Guidelines</div>
                                <div className="text-muted-foreground">Herbal Medicines</div>
                              </div>
                              <div className="text-center">
                                <div className="text-green-600 font-medium">✓ Export Quality</div>
                                <div className="text-muted-foreground">International Standards</div>
                              </div>
                              <div className="text-center">
                                <div className="text-green-600 font-medium">✓ Halal Certified</div>
                                <div className="text-muted-foreground">Islamic Standards</div>
                              </div>
                              <div className="text-center">
                                <div className="text-green-600 font-medium">✓ Kosher Certified</div>
                                <div className="text-muted-foreground">Jewish Standards</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Farm Tab */}
                      {selectedInfoTab === 'farm' && (
                        <div className="space-y-6">
                          <h4 className="font-semibold text-foreground mb-4">Farm Details</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-foreground mb-3">Farm Information</h5>
                              <div className="space-y-3 text-sm">
                                <div><span className="font-medium">Farm Name:</span> {selectedProduct.farmer}'s Organic Farm</div>
                                <div><span className="font-medium">Farmer ID:</span> F{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
                                <div><span className="font-medium">Farm Size:</span> 5.2 hectares</div>
                                <div><span className="font-medium">GPS Location:</span> {getGPSCoordinates(selectedProduct.location)}</div>
                                <div><span className="font-medium">Soil Type:</span> Loamy with 3.2% organic content</div>
                                <div><span className="font-medium">Irrigation:</span> Drip irrigation with rainwater harvesting</div>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-foreground mb-3">Cultivation Practices</h5>
                              <div className="space-y-3 text-sm">
                                <div><span className="font-medium">Organic Status:</span> <span className="text-green-600">✓ Certified Organic</span></div>
                                <div><span className="font-medium">Pesticides:</span> None used</div>
                                <div><span className="font-medium">Fertilizers:</span> Organic compost only</div>
                                <div><span className="font-medium">Seeds:</span> Non-GMO traditional varieties</div>
                                <div><span className="font-medium">Harvest Method:</span> Hand-picked at optimal maturity</div>
                                <div><span className="font-medium">Water Source:</span> Natural spring water</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-4">
                            <h5 className="font-semibold text-foreground mb-3">Processing Details</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="mb-2"><span className="font-medium">Drying Method:</span> Shade dried at 40-45°C</div>
                                <div className="mb-2"><span className="font-medium">Drying Duration:</span> 48-72 hours</div>
                                <div><span className="font-medium">Processing Date:</span> {selectedProduct.harvestDate ? getNextDate(selectedProduct.harvestDate, 2) : 'Date not available'}</div>
                              </div>
                              <div>
                                <div className="mb-2"><span className="font-medium">Storage:</span> Moisture-proof containers</div>
                                <div className="mb-2"><span className="font-medium">Quality Checks:</span> Visual, moisture, microbial</div>
                                <div><span className="font-medium">Processing Location:</span> Certified facility</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Verification */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">Verification & Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="mb-2"><span className="font-medium">Company:</span> TraceHerbss Pvt Ltd</div>
                        <div className="mb-2"><span className="font-medium">Customer Care:</span> 1800-123-HERB (4372)</div>
                        <div><span className="font-medium">Email:</span> verify@traceherbss.com</div>
                      </div>
                      <div>
                        <div className="mb-2"><span className="font-medium">Verification URL:</span></div>
                        <div className="text-blue-600 text-xs break-all">https://traceherbss.com/verify/{selectedProduct.id}</div>
                        <div className="mt-2"><span className="font-medium">Blockchain Hash:</span></div>
                        <div className="text-muted-foreground text-xs font-mono">0x{Math.random().toString(16).substring(2, 42)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Product Selected</h3>
                  <p className="text-muted-foreground">Scan a QR code to view product information</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Tab (Admin Only) */}
        {activeTab === 'generate' && mockUser.role === 'admin' && (
          <div className="space-y-6">
            {/* Generated QRs List */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Generated QR Codes</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product & QR Preview</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product ID</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Farmer</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(generatedQRs.length > 0 ? generatedQRs : []).filter(qr => 
                      qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      qr.id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((qr, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {qr.qrCode ? (
                              <img 
                                src={qr.qrCode} 
                                alt="QR Code" 
                                className="h-12 w-12 border border-border rounded"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Leaf className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">{qr.name}</p>
                              <p className="text-sm text-muted-foreground">Quality: {qr.quality}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{qr.id}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{qr.farmer}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{qr.location}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(qr.createdAt || qr.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => downloadQR(qr.id)}
                              className="p-1 rounded hover:bg-accent transition-colors"
                              title="Download QR Code Image"
                            >
                              <Download className="h-4 w-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => setSelectedProduct(qr)}
                              className="p-1 rounded hover:bg-accent transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {generatedQRs.length === 0 && (
                <div className="text-center py-12">
                  <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No QR Codes Generated</h3>
                  <p className="text-muted-foreground">Create your first QR code to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab (Admin Only) */}
        {activeTab === 'history' && mockUser.role === 'admin' && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Scan History</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product Code</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Scanned By</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scanHistory.map((scan) => (
                    <tr key={scan.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {typeof scan.code === 'string' ? scan.code : (scan.product?.name || scan.code?.toString() || 'Unknown Product')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">
                            {scan.product ? scan.product.name : 'Unknown Product'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{scan.scannedBy}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(scan.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scan.product ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {scan.product ? 'Verified' : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {scanHistory.length === 0 && (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Scan History</h3>
                <p className="text-muted-foreground">Scanned QR codes will appear here</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Product Form Modal (Admin Only) */}
      <AnimatePresence>
        {showProductForm && mockUser.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Generate New QR Code</h3>
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    resetForm();
                  }}
                  className="p-1 rounded-md hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Collection Selector */}
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>Auto-Fill from Collections</span>
                  </h4>
                  <button
                    onClick={() => setShowCollectionSelector(!showCollectionSelector)}
                    className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {showCollectionSelector ? 'Hide' : 'Show'} Collections
                  </button>
                </div>
                
                {selectedCollection && (
                  <div className="mb-3 p-3 bg-background rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">{selectedCollection.herbType}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedCollection.farmerName} • {selectedCollection.quantity}{selectedCollection.unit}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={resetForm}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {showCollectionSelector && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search collections by herb type, farmer, or location..."
                        value={collectionFilter}
                        onChange={(e) => setCollectionFilter(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                      />
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {filteredCollections.length > 0 ? (
                        filteredCollections.slice(0, 3).map(collection => (
                          <div
                            key={collection.id}
                            onClick={() => handleCollectionSelect(collection)}
                            className="p-3 bg-background rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Leaf className="h-4 w-4 text-green-600" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{collection.herbType}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {collection.farmerName} • {collection.location.state}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {collection.quantity}{collection.unit} • Grade: {collection.qualityGrade}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(collection.collectionDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No collections found
                        </p>
                      )}
                      
                      {filteredCollections.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Showing first 3 of {filteredCollections.length} collections
                        </p>
                      )}
                    </div>
                  </div>
                )}
                </div>

                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Product Name * 
                        {selectedCollection && <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>}
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border border-border rounded-md text-foreground ${
                          selectedCollection 
                            ? 'bg-muted/50 border-green-200' 
                            : 'bg-background'
                        }`}
                        placeholder="e.g., Organic Turmeric"
                        readOnly={!!selectedCollection}
                      />
                    </div>                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Farmer Name * 
                        {selectedCollection && <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>}
                      </label>
                      <input
                        type="text"
                        value={newProduct.farmer}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, farmer: e.target.value }))}
                        className={`w-full px-3 py-2 border border-border rounded-md text-foreground ${
                          selectedCollection 
                            ? 'bg-muted/50 border-green-200' 
                            : 'bg-background'
                        }`}
                        placeholder="e.g., Rajesh Kumar"
                        readOnly={!!selectedCollection}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Location * 
                        {selectedCollection && <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>}
                      </label>
                      <input
                        type="text"
                        value={newProduct.location}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, location: e.target.value }))}
                        className={`w-full px-3 py-2 border border-border rounded-md text-foreground ${
                          selectedCollection 
                            ? 'bg-muted/50 border-green-200' 
                            : 'bg-background'
                        }`}
                        placeholder="e.g., Rajasthan"
                        readOnly={!!selectedCollection}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Harvest Date 
                        {selectedCollection && <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>}
                      </label>
                      <input
                        type="date"
                        value={newProduct.harvestDate}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, harvestDate: e.target.value }))}
                        className={`w-full px-3 py-2 border border-border rounded-md text-foreground ${
                          selectedCollection 
                            ? 'bg-muted/50 border-green-200' 
                            : 'bg-background'
                        }`}
                        readOnly={!!selectedCollection}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Quality Grade 
                        {selectedCollection && <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>}
                      </label>
                      <select
                        value={newProduct.quality}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, quality: e.target.value }))}
                        className={`w-full px-3 py-2 border border-border rounded-md text-foreground ${
                          selectedCollection 
                            ? 'bg-muted/50 border-green-200' 
                            : 'bg-background'
                        }`}
                        disabled={!!selectedCollection}
                      >
                        <option value="Premium">Premium</option>
                        <option value="Standard">Standard</option>
                        <option value="Basic">Basic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Batch Number 
                        {selectedCollection && <span className="text-xs text-green-600 ml-2">(Auto-filled from collection)</span>}
                      </label>
                      <input
                        type="text"
                        value={newProduct.batch}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, batch: e.target.value }))}
                        className={`w-full px-3 py-2 border border-border rounded-md text-foreground ${
                          selectedCollection 
                            ? 'bg-muted/50 border-green-200' 
                            : 'bg-background'
                        }`}
                        placeholder="e.g., TUR001"
                      />
                      {selectedCollection && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original Collection ID: {selectedCollection.id}
                        </p>
                      )}
                    </div>

                    {/* Additional Collection Info */}
                    {selectedCollection && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Collection Details
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                          <div>
                            <span className="font-medium">Quantity:</span> {selectedCollection.quantity}{selectedCollection.unit}
                          </div>
                          <div>
                            <span className="font-medium">Collection Date:</span> {new Date(selectedCollection.collectionDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Moisture:</span> {selectedCollection.qualityMetrics.moisture}%
                          </div>
                          <div>
                            <span className="font-medium">pH:</span> {selectedCollection.qualityMetrics.ph}
                          </div>
                          {selectedCollection.certifications && selectedCollection.certifications.length > 0 && (
                            <div className="col-span-2">
                              <span className="font-medium">Certifications:</span> {selectedCollection.certifications.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">{error}</span>
                      </div>
                    )}
                  </div>
                </div>

              {/* Fixed Footer with Buttons */}
              <div className="border-t border-border p-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowProductForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const collections = collectionsService.getCollectionsByStatus('Available');
                      setAvailableCollections(collections);
                    }}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center space-x-2"
                    title="Refresh Collections"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleGenerateQR}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Generate QR
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Feedback */}
      <AnimatePresence>
        {scannedCodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                QR Code Scanned!
              </h3>
              <p className="text-muted-foreground mb-4">
                Product Code: {typeof scannedCodes[scannedCodes.length - 1] === 'string' 
                  ? scannedCodes[scannedCodes.length - 1] 
                  : (scannedCodes[scannedCodes.length - 1]?.code || 'Unknown')}
              </p>
              <button
                onClick={() => {
                  const lastScan = scannedCodes[scannedCodes.length - 1];
                  const lastCode = typeof lastScan === 'string' ? lastScan : lastScan?.code;
                  const product = getProductInfo(lastCode);
                  setSelectedProduct(product);
                  setScannedCodes(prev => prev.slice(0, -1));
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRScanner;