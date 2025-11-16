import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, 
  Calendar, 
  User, 
  Leaf, 
  Factory, 
  Truck, 
  Store, 
  CheckCircle,
  Clock,
  Thermometer,
  Droplets,
  Sun,
  Heart,
  Star,
  Award,
  Shield
} from 'lucide-react';

const ConsumerProductStory = ({ productData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      id: 'collection',
      title: 'Collection',
      description: 'Herbs are carefully hand-picked by certified farmers',
      date: productData.traceability.collectionDate,
      location: { lat: 26.2389, lng: 73.0243, name: 'Rajasthan, India' },
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      details: {
        farmer: productData.farmer.name,
        method: 'Hand-picked',
        time: 'Early morning',
        quality: 'Premium grade'
      }
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Herbs undergo traditional Ayurvedic processing methods',
      date: productData.traceability.processingDate,
      location: { lat: 26.2389, lng: 73.0243, name: 'Processing Facility, Rajasthan' },
      icon: Factory,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      details: {
        method: 'Traditional Ayurvedic',
        temperature: 'Controlled',
        duration: '48 hours',
        quality: 'Certified organic'
      }
    },
    {
      id: 'packaging',
      title: 'Packaging',
      description: 'Products are packaged in eco-friendly materials',
      date: productData.traceability.packagingDate,
      location: { lat: 26.2389, lng: 73.0243, name: 'Packaging Facility, Rajasthan' },
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      details: {
        material: 'Biodegradable',
        certification: 'ISO 22000',
        batch: productData.batchNumber,
        expiry: productData.expiryDate
      }
    },
    {
      id: 'distribution',
      title: 'Distribution',
      description: 'Products are distributed through certified channels',
      date: productData.traceability.distributionDate,
      location: { lat: 28.6139, lng: 77.2090, name: 'Distribution Center, Delhi' },
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      details: {
        method: 'Cold chain',
        certification: 'FSSAI approved',
        tracking: 'Real-time',
        delivery: 'Next day'
      }
    }
  ];

  const getStepStatus = (index) => {
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'current';
    return 'pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="product-story-container">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Product Journey</h2>
        <p className="text-muted-foreground">
          Follow the complete journey of your {productData.herbType} from farm to your hands
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="story-timeline">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const status = getStepStatus(index);
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`timeline-item ${status} cursor-pointer`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${step.bgColor}`}>
                        <Icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(step.date)}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        
                        {/* Step Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(step.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-medium text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Map and Farmer Info */}
        <div className="space-y-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Journey Map</h3>
            <div className="map-container">
              <MapContainer
                center={[26.2389, 73.0243]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {journeySteps.map((step, index) => (
                  <Marker key={step.id} position={[step.location.lat, step.location.lng]}>
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.location.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(step.date)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
              ))}
            </MapContainer>
            </div>
          </motion.div>

          {/* Farmer Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="farmer-profile"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-full">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Meet the Farmer</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground">{productData.farmer.name}</h4>
                <p className="text-sm text-muted-foreground">{productData.farmer.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium text-foreground ml-1">
                    {productData.farmer.experience}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Certification:</span>
                  <span className="font-medium text-foreground ml-1">
                    {productData.farmer.certification}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Verified Organic Farmer
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quality Assurance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Quality Assurance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Moisture Content</span>
                <span className="font-medium text-foreground">
                  {productData.qualityMetrics.moisture}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">pH Level</span>
                <span className="font-medium text-foreground">
                  {productData.qualityMetrics.ph}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Color Quality</span>
                <span className="font-medium text-foreground">
                  {productData.qualityMetrics.color}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aroma Intensity</span>
                <span className="font-medium text-foreground">
                  {productData.qualityMetrics.aroma}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  All quality tests passed
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sustainability Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Sustainability Impact</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Carbon Footprint</span>
                <span className="font-medium text-green-600">
                  {productData.sustainability.carbonFootprint}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Water Usage</span>
                <span className="font-medium text-green-600">
                  {productData.sustainability.waterUsage}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Packaging</span>
                <span className="font-medium text-green-600">
                  {productData.sustainability.packaging}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {productData.sustainability.score}%
                </div>
                <div className="text-sm text-muted-foreground">Sustainability Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerProductStory;