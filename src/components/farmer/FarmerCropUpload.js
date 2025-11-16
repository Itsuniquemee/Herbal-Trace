import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  MapPin, 
  Calendar, 
  Leaf, 
  Package, 
  Award, 
  TestTube2,
  Camera,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Save,
  Eye,
  Download,
  Globe
} from 'lucide-react';

const FarmerCropUpload = () => {
  const [activeTab, setActiveTab] = useState('crop-details');
  const [cropData, setCropData] = useState({
    herbType: '',
    variety: '',
    plantingDate: '',
    harvestDate: '',
    quantity: '',
    unit: 'kg',
    batchId: '',
    fieldLocation: '',
    gpsCoordinates: '',
    soilType: '',
    irrigationMethod: '',
    organicStatus: true,
    qualityGrade: 'Premium'
  });
  
  const [documents, setDocuments] = useState({
    organicCertificate: null,
    soilTestReport: null,
    seedCertificate: null,
    harvestPhotos: [],
    fieldPhotos: []
  });
  
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const fileInputRefs = {
    organic: useRef(null),
    soilTest: useRef(null),
    seedCert: useRef(null),
    harvestPhotos: useRef(null),
    fieldPhotos: useRef(null)
  };

  // Mock farmer data
  const farmerInfo = {
    name: 'Rajesh Kumar',
    farmerId: 'F2024001',
    farmName: 'Kumar Organic Farm',
    farmSize: '5.2 hectares',
    location: 'Rajasthan, India',
    organicCertified: true
  };

  const handleInputChange = (field, value) => {
    setCropData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleInputChange('gpsCoordinates', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setGpsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGpsLoading(false);
          alert('Unable to get current location. Please enter GPS coordinates manually.');
        }
      );
    } else {
      setGpsLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFileUpload = (fileType, files) => {
    const fileArray = Array.from(files);
    
    // Simulate upload progress
    fileArray.forEach((file, index) => {
      const fileKey = `${fileType}_${index}`;
      setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));
      
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileKey] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileKey]: currentProgress + 10 };
        });
      }, 200);
    });

    // Update documents state
    if (fileType === 'harvestPhotos' || fileType === 'fieldPhotos') {
      setDocuments(prev => ({
        ...prev,
        [fileType]: [...(prev[fileType] || []), ...fileArray]
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [fileType]: files[0]
      }));
    }
  };

  const removeFile = (fileType, index = null) => {
    if (index !== null) {
      setDocuments(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [fileType]: null
      }));
    }
  };

  const validateForm = () => {
    const required = ['herbType', 'plantingDate', 'harvestDate', 'quantity', 'batchId', 'fieldLocation'];
    return required.every(field => cropData[field]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage for demo
      const cropRecord = {
        id: `CROP_${Date.now()}`,
        farmerId: farmerInfo.farmerId,
        farmerName: farmerInfo.name,
        ...cropData,
        documents: {
          organicCertificate: documents.organicCertificate?.name,
          soilTestReport: documents.soilTestReport?.name,
          seedCertificate: documents.seedCertificate?.name,
          harvestPhotos: documents.harvestPhotos.map(file => file.name),
          fieldPhotos: documents.fieldPhotos.map(file => file.name)
        },
        submittedAt: new Date().toISOString(),
        status: 'Pending Verification'
      };
      
      const existingRecords = JSON.parse(localStorage.getItem('farmer_crop_records') || '[]');
      existingRecords.unshift(cropRecord);
      localStorage.setItem('farmer_crop_records', JSON.stringify(existingRecords));
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Crop details uploaded successfully! Your submission is under review.' 
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        setCropData({
          herbType: '',
          variety: '',
          plantingDate: '',
          harvestDate: '',
          quantity: '',
          unit: 'kg',
          batchId: '',
          fieldLocation: '',
          gpsCoordinates: '',
          soilType: '',
          irrigationMethod: '',
          organicStatus: true,
          qualityGrade: 'Premium'
        });
        setDocuments({
          organicCertificate: null,
          soilTestReport: null,
          seedCertificate: null,
          harvestPhotos: [],
          fieldPhotos: []
        });
        setActiveTab('crop-details');
      }, 2000);
      
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to upload crop details. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateBatchId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const herbPrefix = cropData.herbType.substring(0, 3).toUpperCase();
    const batchId = `${herbPrefix}_${timestamp}`;
    handleInputChange('batchId', batchId);
  };

  const herbTypes = [
    'Tulsi', 'Neem', 'Turmeric', 'Ginger', 'Ashwagandha', 'Brahmi', 
    'Giloy', 'Amla', 'Aloe Vera', 'Moringa', 'Mint', 'Basil'
  ];

  const soilTypes = [
    'Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky'
  ];

  const irrigationMethods = [
    'Drip Irrigation', 'Sprinkler System', 'Manual Watering', 'Rain-fed', 'Flood Irrigation'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upload Crop Details</h1>
            <p className="text-muted-foreground">Record your harvest and upload supporting documents</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{farmerInfo.name}</p>
            <p className="text-xs text-muted-foreground">ID: {farmerInfo.farmerId}</p>
          </div>
        </div>

        {/* Farm Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Farm</p>
              <p className="text-sm font-medium">{farmerInfo.farmName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{farmerInfo.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">Farm Size</p>
              <p className="text-sm font-medium">{farmerInfo.farmSize}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-medium text-green-600">Organic Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('crop-details')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'crop-details'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4" />
            <span>Crop Details</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'photos'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>Photos</span>
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
        {/* Crop Details Tab */}
        {activeTab === 'crop-details' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Crop Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Herb Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Herb Type *</label>
                <select
                  value={cropData.herbType}
                  onChange={(e) => handleInputChange('herbType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select herb type</option>
                  {herbTypes.map(herb => (
                    <option key={herb} value={herb}>{herb}</option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Variety</label>
                <input
                  type="text"
                  value={cropData.variety}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  placeholder="e.g., Krishna Tulsi, Rama Tulsi"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Planting Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Planting Date *</label>
                <input
                  type="date"
                  value={cropData.plantingDate}
                  onChange={(e) => handleInputChange('plantingDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Harvest Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Harvest Date *</label>
                <input
                  type="date"
                  value={cropData.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantity *</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={cropData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="Enter quantity"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <select
                    value={cropData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="quintals">quintals</option>
                  </select>
                </div>
              </div>

              {/* Batch ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Batch ID *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={cropData.batchId}
                    onChange={(e) => handleInputChange('batchId', e.target.value)}
                    placeholder="Enter or generate batch ID"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={generateBatchId}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Field Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Field Location *</label>
                <input
                  type="text"
                  value={cropData.fieldLocation}
                  onChange={(e) => handleInputChange('fieldLocation', e.target.value)}
                  placeholder="e.g., North Field, Plot A-3"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* GPS Coordinates */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">GPS Coordinates</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={cropData.gpsCoordinates}
                    onChange={(e) => handleInputChange('gpsCoordinates', e.target.value)}
                    placeholder="Latitude, Longitude"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gpsLoading}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {gpsLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Soil Type</label>
                <select
                  value={cropData.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select soil type</option>
                  {soilTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Irrigation Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Irrigation Method</label>
                <select
                  value={cropData.irrigationMethod}
                  onChange={(e) => handleInputChange('irrigationMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select irrigation method</option>
                  {irrigationMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Quality Grade */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quality Grade</label>
                <select
                  value={cropData.qualityGrade}
                  onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="Premium">Premium</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>

              {/* Organic Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Organic Status</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={cropData.organicStatus === true}
                      onChange={() => handleInputChange('organicStatus', true)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Organic</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={cropData.organicStatus === false}
                      onChange={() => handleInputChange('organicStatus', false)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Conventional</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Supporting Documents</h2>
            
            <div className="space-y-6">
              {/* Organic Certificate */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-foreground">Organic Certificate</h3>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Recommended</span>
                </div>
                
                {!documents.organicCertificate ? (
                  <div
                    onClick={() => fileInputRefs.organic.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground">Click to upload organic certificate</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-800">{documents.organicCertificate.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile('organicCertificate')}
                      className="p-1 rounded hover:bg-green-100"
                    >
                      <X className="h-4 w-4 text-green-600" />
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRefs.organic}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('organicCertificate', e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Soil Test Report */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <TestTube2 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-foreground">Soil Test Report</h3>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Optional</span>
                </div>
                
                {!documents.soilTestReport ? (
                  <div
                    onClick={() => fileInputRefs.soilTest.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground">Click to upload soil test report</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-800">{documents.soilTestReport.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile('soilTestReport')}
                      className="p-1 rounded hover:bg-blue-100"
                    >
                      <X className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRefs.soilTest}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('soilTestReport', e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Seed Certificate */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-foreground">Seed Certificate</h3>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">Optional</span>
                </div>
                
                {!documents.seedCertificate ? (
                  <div
                    onClick={() => fileInputRefs.seedCert.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground">Click to upload seed certificate</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-purple-800">{documents.seedCertificate.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile('seedCertificate')}
                      className="p-1 rounded hover:bg-purple-100"
                    >
                      <X className="h-4 w-4 text-purple-600" />
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRefs.seedCert}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('seedCertificate', e.target.files)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Field & Harvest Photos</h2>
            
            <div className="space-y-6">
              {/* Harvest Photos */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-foreground">Harvest Photos</h3>
                  </div>
                  <button
                    onClick={() => fileInputRefs.harvestPhotos.current?.click()}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Photos</span>
                  </button>
                </div>
                
                {documents.harvestPhotos.length === 0 ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground">No harvest photos uploaded</p>
                    <p className="text-xs text-muted-foreground">Add photos showing the harvested herbs</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {documents.harvestPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeFile('harvestPhotos', index)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-center mt-2 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <input
                  ref={fileInputRefs.harvestPhotos}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload('harvestPhotos', e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Field Photos */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-foreground">Field Photos</h3>
                  </div>
                  <button
                    onClick={() => fileInputRefs.fieldPhotos.current?.click()}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Photos</span>
                  </button>
                </div>
                
                {documents.fieldPhotos.length === 0 ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground">No field photos uploaded</p>
                    <p className="text-xs text-muted-foreground">Add photos showing the cultivation field</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {documents.fieldPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeFile('fieldPhotos', index)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-center mt-2 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <input
                  ref={fileInputRefs.fieldPhotos}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload('fieldPhotos', e.target.files)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{submitStatus.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {
            setCropData({
              herbType: '',
              variety: '',
              plantingDate: '',
              harvestDate: '',
              quantity: '',
              unit: 'kg',
              batchId: '',
              fieldLocation: '',
              gpsCoordinates: '',
              soilType: '',
              irrigationMethod: '',
              organicStatus: true,
              qualityGrade: 'Premium'
            });
            setDocuments({
              organicCertificate: null,
              soilTestReport: null,
              seedCertificate: null,
              harvestPhotos: [],
              fieldPhotos: []
            });
            setSubmitStatus(null);
          }}
          className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors"
        >
          Reset Form
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !validateForm()}
          className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isSubmitting ? 'Uploading...' : 'Submit Crop Details'}</span>
        </button>
      </div>
    </div>
  );
};

export default FarmerCropUpload;