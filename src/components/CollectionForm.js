import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  MapPin, 
  Camera, 
  Upload, 
  Save, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Leaf,
  User,
  Package,
  Thermometer,
  Droplets
} from 'lucide-react';

const CollectionForm = ({ onSubmit, isLoading = false }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      farmerName: '',
      farmerId: '',
      herbType: '',
      collectionDate: new Date().toISOString().split('T')[0],
      location: { latitude: 0, longitude: 0, address: '' },
      quantity: 0,
      unit: 'kg',
      qualityMetrics: { moisture: 0, temperature: 0, ph: 7, color: '', aroma: '' },
      notes: ''
    }
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setValue('location.latitude', latitude);
        setValue('location.longitude', longitude);
        setValue('location.address', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enter manually.');
        setIsGettingLocation(false);
      }
    );
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      images: uploadedImages,
      timestamp: new Date().toISOString(),
      id: `collection_${Date.now()}`
    };
    onSubmit(formData);
  };

  const herbTypes = [
    'Ashwagandha', 'Turmeric', 'Ginger', 'Tulsi', 'Neem', 'Amla',
    'Brahmi', 'Shatavari', 'Guduchi', 'Arjuna', 'Triphala', 'Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Collection Form</h1>
        <p className="text-muted-foreground">
          Record herb collection details with GPS location and quality metrics
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Farmer Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Farmer Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Farmer Name *</label>
              <input
                {...register('farmerName', { required: 'Farmer name is required' })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter farmer name"
              />
              {errors.farmerName && (
                <p className="text-sm text-red-600">{errors.farmerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Farmer ID *</label>
              <input
                {...register('farmerId', { required: 'Farmer ID is required' })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter farmer ID"
              />
              {errors.farmerId && (
                <p className="text-sm text-red-600">{errors.farmerId.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Collection Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Leaf className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Collection Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Herb Type *</label>
              <select
                {...register('herbType', { required: 'Herb type is required' })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select herb type</option>
                {herbTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.herbType && (
                <p className="text-sm text-red-600">{errors.herbType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Collection Date *</label>
              <input
                {...register('collectionDate', { required: 'Collection date is required' })}
                type="date"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {errors.collectionDate && (
                <p className="text-sm text-red-600">{errors.collectionDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity *</label>
              <div className="flex space-x-2">
                <input
                  {...register('quantity', { required: 'Quantity is required', valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0.0"
                />
                <select
                  {...register('unit')}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              {errors.quantity && (
                <p className="text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Location</h2>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
              <span>{isGettingLocation ? 'Getting Location...' : 'Get Current Location'}</span>
            </button>
          </div>

          {locationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{locationError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address *</label>
              <input
                {...register('location.address', { required: 'Address is required' })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter collection location"
              />
              {errors.location?.address && (
                <p className="text-sm text-red-600">{errors.location.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Latitude</label>
                <input
                  {...register('location.latitude', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0.000000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Longitude</label>
                <input
                  {...register('location.longitude', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0.000000"
                />
              </div>
            </div>
          </div>

          {currentLocation && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">
                  Location captured: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quality Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Quality Metrics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Droplets className="h-4 w-4" />
                <span>Moisture (%)</span>
              </label>
              <input
                {...register('qualityMetrics.moisture', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <span>Temperature (°C)</span>
              </label>
              <input
                {...register('qualityMetrics.temperature', { valueAsNumber: true })}
                type="number"
                min="-50"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">pH Level</label>
              <input
                {...register('qualityMetrics.ph', { valueAsNumber: true })}
                type="number"
                min="0"
                max="14"
                step="0.1"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="7.0"
              />
            </div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Collection Images</h2>
          </div>
          
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Upload images of the collected herbs</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Choose Images</span>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Collection ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = uploadedImages.filter((_, i) => i !== index);
                      setUploadedImages(newImages);
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 border border-border text-foreground rounded-md hover:bg-accent transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Collection'}</span>
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CollectionForm;