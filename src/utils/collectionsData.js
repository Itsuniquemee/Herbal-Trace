// Mock collections data service - simulates real collection data from farmers
export class CollectionDataService {
  constructor() {
    this.initializeCollections();
  }

  initializeCollections() {
    // Check if collections exist in localStorage
    const existingCollections = localStorage.getItem('herbaltrace_collections');
    
    if (!existingCollections) {
      // Initialize with mock collection data
      const mockCollections = [
        {
          id: 'collection_001',
          farmerName: 'Rajesh Kumar',
          farmerId: 'FRM001',
          farmerContact: '+91 9876543210',
          herbType: 'Turmeric',
          collectionDate: '2024-09-20',
          harvestDate: '2024-09-15',
          location: {
            latitude: 26.9124,
            longitude: 75.7873,
            address: 'Jaipur, Rajasthan',
            state: 'Rajasthan',
            district: 'Jaipur'
          },
          quantity: 150,
          unit: 'kg',
          qualityMetrics: {
            moisture: 12,
            temperature: 25,
            ph: 6.8,
            color: 'Golden Yellow',
            aroma: 'Strong'
          },
          qualityGrade: 'Premium',
          batchNumber: 'TUR001_092024',
          certifications: ['Organic', 'FSSAI'],
          notes: 'High quality turmeric with good color and aroma',
          status: 'Available',
          images: [],
          timestamp: '2024-09-20T10:30:00Z'
        },
        {
          id: 'collection_002',
          farmerName: 'Priya Sharma',
          farmerId: 'FRM002',
          farmerContact: '+91 9876543211',
          herbType: 'Ashwagandha',
          collectionDate: '2024-09-18',
          harvestDate: '2024-09-10',
          location: {
            latitude: 31.1048,
            longitude: 77.1734,
            address: 'Shimla, Himachal Pradesh',
            state: 'Himachal Pradesh',
            district: 'Shimla'
          },
          quantity: 75,
          unit: 'kg',
          qualityMetrics: {
            moisture: 8,
            temperature: 20,
            ph: 7.2,
            color: 'Light Brown',
            aroma: 'Mild'
          },
          qualityGrade: 'Premium',
          batchNumber: 'ASH001_092024',
          certifications: ['Organic'],
          notes: 'Wild harvested from high altitude regions',
          status: 'Available',
          images: [],
          timestamp: '2024-09-18T14:20:00Z'
        },
        {
          id: 'collection_003',
          farmerName: 'Suresh Patel',
          farmerId: 'FRM003',
          farmerContact: '+91 9876543212',
          herbType: 'Tulsi',
          collectionDate: '2024-09-22',
          harvestDate: '2024-09-20',
          location: {
            latitude: 23.0225,
            longitude: 72.5714,
            address: 'Ahmedabad, Gujarat',
            state: 'Gujarat',
            district: 'Ahmedabad'
          },
          quantity: 100,
          unit: 'kg',
          qualityMetrics: {
            moisture: 10,
            temperature: 28,
            ph: 6.5,
            color: 'Dark Green',
            aroma: 'Strong'
          },
          qualityGrade: 'Standard',
          batchNumber: 'TUL001_092024',
          certifications: ['FSSAI'],
          notes: 'Fresh tulsi leaves with good medicinal properties',
          status: 'Available',
          images: [],
          timestamp: '2024-09-22T09:15:00Z'
        },
        {
          id: 'collection_004',
          farmerName: 'Meera Devi',
          farmerId: 'FRM004',
          farmerContact: '+91 9876543213',
          herbType: 'Neem',
          collectionDate: '2024-09-21',
          harvestDate: '2024-09-18',
          location: {
            latitude: 13.0827,
            longitude: 80.2707,
            address: 'Chennai, Tamil Nadu',
            state: 'Tamil Nadu',
            district: 'Chennai'
          },
          quantity: 200,
          unit: 'kg',
          qualityMetrics: {
            moisture: 15,
            temperature: 30,
            ph: 7.0,
            color: 'Dark Green',
            aroma: 'Bitter'
          },
          qualityGrade: 'Standard',
          batchNumber: 'NEM001_092024',
          certifications: ['Organic', 'FSSAI'],
          notes: 'Mature neem leaves with high medicinal value',
          status: 'Available',
          images: [],
          timestamp: '2024-09-21T11:45:00Z'
        },
        {
          id: 'collection_005',
          farmerName: 'Ravi Singh',
          farmerId: 'FRM005',
          farmerContact: '+91 9876543214',
          herbType: 'Brahmi',
          collectionDate: '2024-09-19',
          harvestDate: '2024-09-16',
          location: {
            latitude: 22.5726,
            longitude: 88.3639,
            address: 'Kolkata, West Bengal',
            state: 'West Bengal',
            district: 'Kolkata'
          },
          quantity: 50,
          unit: 'kg',
          qualityMetrics: {
            moisture: 14,
            temperature: 26,
            ph: 6.9,
            color: 'Light Green',
            aroma: 'Fresh'
          },
          qualityGrade: 'Premium',
          batchNumber: 'BRA001_092024',
          certifications: ['Organic'],
          notes: 'Fresh brahmi with excellent cognitive enhancement properties',
          status: 'Available',
          images: [],
          timestamp: '2024-09-19T16:30:00Z'
        }
      ];

      localStorage.setItem('herbaltrace_collections', JSON.stringify(mockCollections));
    }
  }

  // Get all collections
  getAllCollections() {
    const collections = localStorage.getItem('herbaltrace_collections');
    return collections ? JSON.parse(collections) : [];
  }

  // Get collections by status
  getCollectionsByStatus(status = 'Available') {
    const collections = this.getAllCollections();
    return collections.filter(collection => collection.status === status);
  }

  // Get collections by farmer
  getCollectionsByFarmer(farmerId) {
    const collections = this.getAllCollections();
    return collections.filter(collection => collection.farmerId === farmerId);
  }

  // Get collections by herb type
  getCollectionsByHerbType(herbType) {
    const collections = this.getAllCollections();
    return collections.filter(collection => 
      collection.herbType.toLowerCase() === herbType.toLowerCase()
    );
  }

  // Get collection by ID
  getCollectionById(id) {
    const collections = this.getAllCollections();
    return collections.find(collection => collection.id === id);
  }

  // Get recent collections (last 30 days)
  getRecentCollections(days = 30) {
    const collections = this.getAllCollections();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return collections.filter(collection => {
      const collectionDate = new Date(collection.timestamp);
      return collectionDate >= cutoffDate;
    });
  }

  // Update collection status
  updateCollectionStatus(collectionId, newStatus) {
    const collections = this.getAllCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex !== -1) {
      collections[collectionIndex].status = newStatus;
      collections[collectionIndex].lastUpdated = new Date().toISOString();
      localStorage.setItem('herbaltrace_collections', JSON.stringify(collections));
      return collections[collectionIndex];
    }
    
    return null;
  }

  // Add new collection
  addCollection(collectionData) {
    const collections = this.getAllCollections();
    const newCollection = {
      id: `collection_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Available',
      ...collectionData
    };
    
    collections.push(newCollection);
    localStorage.setItem('herbaltrace_collections', JSON.stringify(collections));
    return newCollection;
  }

  // Get farmers list
  getFarmersListWithCollections() {
    const collections = this.getAllCollections();
    const farmersMap = new Map();
    
    collections.forEach(collection => {
      if (!farmersMap.has(collection.farmerId)) {
        farmersMap.set(collection.farmerId, {
          farmerId: collection.farmerId,
          farmerName: collection.farmerName,
          farmerContact: collection.farmerContact,
          location: collection.location,
          totalCollections: 0,
          herbTypes: new Set(),
          lastCollection: null
        });
      }
      
      const farmer = farmersMap.get(collection.farmerId);
      farmer.totalCollections++;
      farmer.herbTypes.add(collection.herbType);
      
      if (!farmer.lastCollection || new Date(collection.timestamp) > new Date(farmer.lastCollection)) {
        farmer.lastCollection = collection.timestamp;
      }
    });
    
    // Convert Set to Array for herbTypes
    const farmers = Array.from(farmersMap.values()).map(farmer => ({
      ...farmer,
      herbTypes: Array.from(farmer.herbTypes)
    }));
    
    return farmers.sort((a, b) => new Date(b.lastCollection) - new Date(a.lastCollection));
  }

  // Get collection statistics
  getCollectionStats() {
    const collections = this.getAllCollections();
    const stats = {
      totalCollections: collections.length,
      availableCollections: collections.filter(c => c.status === 'Available').length,
      totalQuantity: collections.reduce((sum, c) => sum + c.quantity, 0),
      uniqueFarmers: new Set(collections.map(c => c.farmerId)).size,
      uniqueHerbTypes: new Set(collections.map(c => c.herbType)).size,
      averageQuality: collections.reduce((sum, c) => sum + (c.qualityMetrics.ph || 7), 0) / collections.length,
      collectionsByState: {},
      collectionsByHerb: {}
    };

    // Group by state
    collections.forEach(collection => {
      const state = collection.location.state;
      stats.collectionsByState[state] = (stats.collectionsByState[state] || 0) + 1;
    });

    // Group by herb type
    collections.forEach(collection => {
      const herb = collection.herbType;
      stats.collectionsByHerb[herb] = (stats.collectionsByHerb[herb] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const collectionsService = new CollectionDataService();