import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Eye,
  Search,
  Filter
} from 'lucide-react';

const FarmerSupplyTracking = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock tracking data based on uploaded crop records
    const cropRecords = JSON.parse(localStorage.getItem('farmer_crop_records') || '[]');
    const mockTrackingData = cropRecords.map((record, index) => ({
      id: record.id || `track_${index}`,
      batchId: record.batchId,
      herbType: record.herbType,
      quantity: record.quantity,
      unit: record.unit,
      currentStatus: getRandomStatus(),
      currentLocation: getRandomLocation(),
      estimatedDelivery: getEstimatedDelivery(),
      journey: getJourneySteps(),
      processor: getRandomProcessor()
    }));
    setTrackingData(mockTrackingData);
  }, []);

  const getRandomStatus = () => {
    const statuses = ['In Transit', 'Processing', 'Quality Check', 'Delivered', 'Shipped'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomLocation = () => {
    const locations = ['Mumbai Processing Center', 'Delhi Distribution Hub', 'Bangalore Quality Lab', 'Chennai Port', 'Kolkata Warehouse'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomProcessor = () => {
    const processors = ['HerbalTrace Processing Ltd', 'Organic Herbs Co.', 'Natural Extracts Pvt Ltd', 'Ayurvedic Solutions Inc'];
    return processors[Math.floor(Math.random() * processors.length)];
  };

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
    return date.toISOString().split('T')[0];
  };

  const getJourneySteps = () => [
    { step: 'Farm Collection', status: 'completed', date: '2024-01-15' },
    { step: 'Quality Inspection', status: 'completed', date: '2024-01-16' },
    { step: 'Processing Center', status: 'current', date: '2024-01-18' },
    { step: 'Final Product', status: 'pending', date: '2024-01-22' },
    { step: 'Distribution', status: 'pending', date: '2024-01-25' }
  ];

  const filteredData = trackingData.filter(item => {
    const matchesSearch = item.herbType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.currentStatus?.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return CheckCircle;
      case 'in transit': return Truck;
      case 'processing': return Package;
      case 'quality check': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in transit': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'quality check': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Track My Produce</h1>
            <p className="text-muted-foreground">Monitor your crops through the supply chain</p>
          </div>
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by herb type or batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="in transit">In Transit</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full bg-card border border-border rounded-lg p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Tracking Data</h3>
            <p className="text-muted-foreground">Upload crop records to start tracking your produce through the supply chain.</p>
          </div>
        ) : (
          filteredData.map((item, index) => {
            const StatusIcon = getStatusIcon(item.currentStatus);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.herbType}</h3>
                    <p className="text-sm text-muted-foreground">Batch: {item.batchId}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.currentStatus)}`}>
                    {item.currentStatus}
                  </span>
                </div>

                {/* Current Status */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/50 rounded-lg">
                  <StatusIcon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.currentLocation}</p>
                    <p className="text-sm text-muted-foreground">Current location</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="text-foreground">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processor:</span>
                    <span className="text-foreground">{item.processor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Delivery:</span>
                    <span className="text-foreground">{new Date(item.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Journey Progress */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-foreground">Journey Progress</p>
                  <div className="space-y-1">
                    {item.journey.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <span className={`text-xs ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'current' ? 'text-blue-600' : 'text-muted-foreground'
                        }`}>
                          {step.step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-accent transition-colors">
                    <MapPin className="h-4 w-4" />
                    <span>Track</span>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-bold text-foreground">{trackingData.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">
                {trackingData.filter(d => d.currentStatus === 'In Transit').length}
              </p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">
                {trackingData.filter(d => d.currentStatus === 'Processing').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {trackingData.filter(d => d.currentStatus === 'Delivered').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSupplyTracking;