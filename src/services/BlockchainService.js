import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Blockchain Service for Frontend Integration
 * Handles all blockchain-related API calls and Web3 interactions
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const blockchainAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/blockchain`,
  timeout: 30000, // 30 seconds for blockchain operations
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
blockchainAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('herbalTrace_accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
blockchainAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('herbalTrace_accessToken');
      // Redirect to login
      globalThis.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class BlockchainService {
  
  /**
   * Get blockchain network status
   */
  static async getNetworkStatus() {
    try {
      const response = await blockchainAPI.get('/status');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get network status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get network status'
      };
    }
  }

  /**
   * Create collection event on blockchain
   */
  static async createCollectionEvent(eventData) {
    try {
      const payload = {
        eventId: eventData.eventId || `CE_${Date.now()}`,
        farmerId: eventData.farmerId,
        species: eventData.species,
        quantity: Number.parseFloat(eventData.quantity),
        collectionDate: eventData.collectionDate,
        gpsCoordinates: {
          latitude: Number.parseFloat(eventData.latitude),
          longitude: Number.parseFloat(eventData.longitude),
          accuracy: eventData.accuracy || 0
        },
        qualityGrade: eventData.qualityGrade || 'A',
        farmDetails: {
          farmName: eventData.farmName || '',
          certifications: eventData.certifications || [],
          farmingMethod: eventData.farmingMethod || 'organic'
        }
      };

      const response = await blockchainAPI.post('/collection-events', payload);
      
      toast.success('Collection event recorded on blockchain!');
      
      return {
        success: true,
        data: response.data.data,
        transactionId: response.data.data.transactionId
      };
    } catch (error) {
      console.error('Failed to create collection event:', error);
      const errorMsg = error.response?.data?.error || 'Failed to record collection event';
      toast.error(errorMsg);
      
      return {
        success: false,
        error: errorMsg
      };
    }
  }

  /**
   * Get collection event from blockchain
   */
  static async getCollectionEvent(eventId) {
    try {
      const response = await blockchainAPI.get(`/collection-events/${eventId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get collection event:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get collection event'
      };
    }
  }

  /**
   * Create quality test record on blockchain
   */
  static async createQualityTest(testData) {
    try {
      const payload = {
        testId: testData.testId || `QT_${Date.now()}`,
        collectionEventId: testData.collectionEventId,
        labId: testData.labId,
        testType: testData.testType,
        testResults: {
          moisture: testData.moisture || 0,
          purity: testData.purity || 0,
          contaminants: testData.contaminants || [],
          activeCompounds: testData.activeCompounds || {},
          overallGrade: testData.overallGrade || 'PASS'
        },
        testDate: testData.testDate,
        certificateUrl: testData.certificateUrl || ''
      };

      const response = await blockchainAPI.post('/quality-tests', payload);
      
      toast.success('Quality test recorded on blockchain!');
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to create quality test:', error);
      const errorMsg = error.response?.data?.error || 'Failed to record quality test';
      toast.error(errorMsg);
      
      return {
        success: false,
        error: errorMsg
      };
    }
  }

  /**
   * Create processing step record on blockchain
   */
  static async createProcessingStep(stepData) {
    try {
      const payload = {
        stepId: stepData.stepId || `PS_${Date.now()}`,
        batchId: stepData.batchId,
        processType: stepData.processType,
        processorId: stepData.processorId,
        processDate: stepData.processDate,
        inputMaterials: stepData.inputMaterials || [],
        outputProducts: stepData.outputProducts || [],
        processParameters: {
          temperature: stepData.temperature || 0,
          duration: stepData.duration || 0,
          method: stepData.method || '',
          equipment: stepData.equipment || []
        }
      };

      const response = await blockchainAPI.post('/processing-steps', payload);
      
      toast.success('Processing step recorded on blockchain!');
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to create processing step:', error);
      const errorMsg = error.response?.data?.error || 'Failed to record processing step';
      toast.error(errorMsg);
      
      return {
        success: false,
        error: errorMsg
      };
    }
  }

  /**
   * Get full provenance data for a product
   */
  static async getProvenance(productId) {
    try {
      const response = await blockchainAPI.get(`/provenance/${productId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get provenance data:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get provenance data'
      };
    }
  }

  /**
   * Validate GPS coordinates against geo-fencing rules
   */
  static async validateGeoFencing(coordinates, farmerId) {
    try {
      const payload = {
        gpsCoordinates: coordinates,
        farmerId: farmerId
      };

      const response = await blockchainAPI.post('/validate-geofencing', payload);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to validate geo-fencing:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to validate coordinates'
      };
    }
  }

  /**
   * Get blockchain transaction status
   */
  static async getTransactionStatus(transactionId) {
    try {
      const response = await blockchainAPI.get(`/transactions/${transactionId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get transaction status'
      };
    }
  }

  /**
   * Generate QR code for product
   */
  static async generateProductQR(productData) {
    try {
      const response = await blockchainAPI.post('/generate-qr', productData);
      return {
        success: true,
        qrCode: response.data.qrCode,
        productId: response.data.productId
      };
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate QR code'
      };
    }
  }

  /**
   * Query collections by farmer
   */
  static async getCollectionsByFarmer(farmerId, startDate = null, endDate = null) {
    try {
      let url = `/collections/farmer/${farmerId}`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await blockchainAPI.get(url);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get farmer collections:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get collections'
      };
    }
  }

  /**
   * Query collections by species
   */
  static async getCollectionsBySpecies(species, startDate = null, endDate = null) {
    try {
      let url = `/collections/species/${species}`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await blockchainAPI.get(url);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get species collections:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get collections'
      };
    }
  }

  /**
   * Get blockchain analytics and metrics
   */
  static async getAnalytics() {
    try {
      const response = await blockchainAPI.get('/analytics');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get blockchain analytics:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get analytics'
      };
    }
  }

  /**
   * Monitor blockchain health
   */
  static async monitorHealth() {
    try {
      const healthChecks = await Promise.all([
        this.getNetworkStatus(),
        blockchainAPI.get('/health')
      ]);

      const [networkStatus, healthResponse] = healthChecks;

      return {
        success: true,
        network: networkStatus.data,
        health: healthResponse.data.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to monitor blockchain health:', error);
      return {
        success: false,
        error: 'Blockchain monitoring failed'
      };
    }
  }

  // Get products by user (for QR generation history)
  static async getProductsByUser(userId = null) {
    try {
      const endpoint = userId ? `/products/user/${userId}` : '/products/user/current';
      const response = await blockchainAPI.get(endpoint);
      return { 
        success: true, 
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Get user products error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get user products',
        data: []
      };
    }
  }
}

export default BlockchainService;