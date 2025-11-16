import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Leaf,
  Smartphone,
  Sync,
  Clock,
  Database,
  Cloud,
  CloudOff
} from 'lucide-react';

const FarmerCollectionApp = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [pendingCollections, setPendingCollections] = useState([]);
  const [syncedCollections, setSyncedCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);

  // Mock data for offline collections
  const [offlineCollections] = useState([
    {
      id: 'offline_1',
      farmerName: 'Rajesh Kumar',
      herbType: 'Turmeric',
      quantity: 25.5,
      unit: 'kg',
      location: { latitude: 26.2389, longitude: 73.0243, address: 'Rajasthan, India' },
      collectionDate: '2024-01-15',
      qualityMetrics: { moisture: 12.5, temperature: 28, ph: 6.8 },
      status: 'pending',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 'offline_2',
      farmerName: 'Priya Sharma',
      herbType: 'Ashwagandha',
      quantity: 18.2,
      unit: 'kg',
      location: { latitude: 10.8505, longitude: 76.2711, address: 'Kerala, India' },
      collectionDate: '2024-01-14',
      qualityMetrics: { moisture: 15.2, temperature: 26, ph: 7.2 },
      status: 'pending',
      timestamp: '2024-01-14T14:20:00Z'
    }
  ]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate sync process
  const handleSync = async () => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Move pending collections to synced
    setSyncedCollections(prev => [...prev, ...pendingCollections]);
    setPendingCollections([]);
    setSyncStatus('success');
    
    // Reset status after 3 seconds
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  // Add new collection (offline)
  const addCollection = (collection) => {
    const newCollection = {
      ...collection,
      id: `offline_${Date.now()}`,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setPendingCollections(prev => [...prev, newCollection]);
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Sync className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return isOnline ? <Cloud className="h-4 w-4 text-green-500" /> : <CloudOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Sync Complete';
      case 'error':
        return 'Sync Failed';
      default:
        return isOnline ? 'Online' : 'Offline';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Farmer Collection App</h1>
        <p className="text-muted-foreground">
          Offline-first collection app for farmers in remote areas
        </p>
      </div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium text-foreground">
                {isOnline ? 'Connected' : 'Offline Mode'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getSyncStatusIcon()}
              <span className="text-sm text-muted-foreground">
                {getSyncStatusText()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{pendingCollections.length}</span> pending sync
            </div>
            <button
              onClick={handleSync}
              disabled={!isOnline || syncStatus === 'syncing' || pendingCollections.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentCollection('new')}
          className="bg-card border border-border rounded-lg p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">New Collection</h3>
              <p className="text-sm text-muted-foreground">Record herb collection</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-card border border-border rounded-lg p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">View Collections</h3>
              <p className="text-sm text-muted-foreground">
                {pendingCollections.length + syncedCollections.length} total
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-card border border-border rounded-lg p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">SMS Sync</h3>
              <p className="text-sm text-muted-foreground">Sync via SMS when offline</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Collections List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Collections */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Pending Sync</h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">{pendingCollections.length} items</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingCollections.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending collections</p>
              </div>
            ) : (
              pendingCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{collection.herbType}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(collection.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Farmer: {collection.farmerName}</div>
                    <div>Quantity: {collection.quantity} {collection.unit}</div>
                    <div>Location: {collection.location.address}</div>
                    <div>Moisture: {collection.qualityMetrics.moisture}%</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Synced Collections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Synced Collections</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">{syncedCollections.length} items</span>
            </div>
          </div>

          <div className="space-y-4">
            {syncedCollections.length === 0 ? (
              <div className="text-center py-8">
                <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No synced collections yet</p>
              </div>
            ) : (
              syncedCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{collection.herbType}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(collection.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Farmer: {collection.farmerName}</div>
                    <div>Quantity: {collection.quantity} {collection.unit}</div>
                    <div>Location: {collection.location.address}</div>
                    <div>Moisture: {collection.qualityMetrics.moisture}%</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Offline Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Offline Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">GPS location capture</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">Photo capture and storage</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">Quality metrics recording</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">Automatic sync when online</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">SMS backup sync</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">Data encryption</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerCollectionApp;