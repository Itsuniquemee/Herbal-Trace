const { Gateway, Wallets, TxEventHandler, GatewayOptions } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../utils/fabricUtils');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const config = require('../config/config');

/**
 * Hyperledger Fabric Network Service
 * Manages blockchain network connections and smart contract interactions
 */
class FabricNetworkService {
  constructor() {
    this.gateway = null;
    this.network = null;
    this.contract = null;
    this.wallet = null;
    this.isConnected = false;
  }

  /**
   * Initialize the Fabric network connection
   */
  async initializeNetwork() {
    try {
      logger.info('Initializing Hyperledger Fabric network connection...');
      
      // Build a CA client for interacting with the CA
      const caClient = buildCAClient(FabricCAServices, config.fabric.organizations.farmers);
      
      // Setup the wallet to hold the credentials of the application user
      const walletPath = path.join(process.cwd(), config.fabric.walletPath);
      this.wallet = await Wallets.newFileSystemWallet(walletPath);
      logger.info(`Wallet path: ${walletPath}`);

      // Check if admin user exists in wallet
      const adminExists = await this.wallet.get('admin');
      if (!adminExists) {
        logger.info('Admin user does not exist in wallet, enrolling admin user...');
        await enrollAdmin(caClient, this.wallet, config.fabric.organizations.farmers.mspId);
      }

      // Check if application user exists in wallet
      const userExists = await this.wallet.get(config.fabric.userId);
      if (!userExists) {
        logger.info(`Application user ${config.fabric.userId} does not exist in wallet, registering user...`);
        await registerAndEnrollUser(caClient, this.wallet, config.fabric.organizations.farmers.mspId, config.fabric.userId, 'org1.department1');
      }

      // Create a new gateway instance for interacting with the fabric network
      this.gateway = new Gateway();

      // Setup the gateway options
      const gatewayOpts = {
        wallet: this.wallet,
        identity: config.fabric.userId,
        discovery: { enabled: true, asLocalhost: true }
      };

      // Connect to the gateway
      const ccpPath = path.resolve(__dirname, '../../network', 'organizations', 'peerOrganizations', 'farmers.herbaltrace.com', 'connection-farmers.json');
      
      if (!fs.existsSync(ccpPath)) {
        throw new Error(`Connection profile not found at ${ccpPath}`);
      }

      const connectionProfile = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
      await this.gateway.connect(connectionProfile, gatewayOpts);

      // Build a network instance based on the channel where the smart contract is deployed
      this.network = await this.gateway.getNetwork(config.fabric.channelName);

      // Get the contract from the network
      this.contract = this.network.getContract(config.fabric.chaincodeName);

      this.isConnected = true;
      logger.info('✅ Successfully connected to Hyperledger Fabric network');
      
      return { success: true, message: 'Network initialized successfully' };
    } catch (error) {
      logger.error('❌ Failed to initialize Fabric network:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Get network status and health information
   */
  async getNetworkStatus() {
    try {
      if (!this.isConnected || !this.network) {
        return {
          connected: false,
          error: 'Network not initialized'
        };
      }

      // Get channel information
      const channel = this.network.getChannel();
      const channelInfo = await channel.queryInfo();
      
      // Get peer information
      const peers = channel.getPeers();
      const peerStatus = [];

      for (const peer of peers) {
        try {
          const peerInfo = {
            name: peer.getName(),
            url: peer.getUrl(),
            connected: true
          };
          peerStatus.push(peerInfo);
        } catch (error) {
          peerStatus.push({
            name: peer.getName(),
            url: peer.getUrl(),
            connected: false,
            error: error.message
          });
        }
      }

      return {
        connected: true,
        channelName: config.fabric.channelName,
        chaincodeName: config.fabric.chaincodeName,
        blockHeight: channelInfo.height.toString(),
        currentBlockHash: channelInfo.currentBlockHash.toString('hex'),
        previousBlockHash: channelInfo.previousBlockHash.toString('hex'),
        peers: peerStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting network status:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Create a collection event on the blockchain
   */
  async createCollectionEvent(eventData) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const {
        eventId,
        farmerId,
        species,
        quantity,
        collectionDate,
        gpsCoordinates,
        qualityGrade,
        farmDetails
      } = eventData;

      logger.info(`Creating collection event: ${eventId}`);

      const result = await this.contract.submitTransaction(
        'CreateCollectionEvent',
        eventId,
        farmerId,
        species,
        quantity.toString(),
        collectionDate,
        JSON.stringify(gpsCoordinates),
        qualityGrade,
        JSON.stringify(farmDetails)
      );

      const response = JSON.parse(result.toString());
      logger.info(`✅ Collection event created successfully: ${eventId}`);
      
      return {
        success: true,
        transactionId: response.txId,
        eventId: eventId,
        blockNumber: response.blockNumber,
        timestamp: response.timestamp
      };
    } catch (error) {
      logger.error(`❌ Failed to create collection event: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get collection event by ID
   */
  async getCollectionEvent(eventId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      logger.info(`Querying collection event: ${eventId}`);
      
      const result = await this.contract.evaluateTransaction('GetCollectionEvent', eventId);
      const eventData = JSON.parse(result.toString());

      return {
        success: true,
        data: eventData
      };
    } catch (error) {
      logger.error(`❌ Failed to get collection event: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create quality test record
   */
  async createQualityTest(testData) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const {
        testId,
        collectionEventId,
        labId,
        testType,
        testResults,
        testDate,
        certificateUrl
      } = testData;

      logger.info(`Creating quality test: ${testId}`);

      const result = await this.contract.submitTransaction(
        'CreateQualityTest',
        testId,
        collectionEventId,
        labId,
        testType,
        JSON.stringify(testResults),
        testDate,
        certificateUrl || ''
      );

      const response = JSON.parse(result.toString());
      logger.info(`✅ Quality test created successfully: ${testId}`);
      
      return {
        success: true,
        transactionId: response.txId,
        testId: testId,
        blockNumber: response.blockNumber,
        timestamp: response.timestamp
      };
    } catch (error) {
      logger.error(`❌ Failed to create quality test: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create processing step record
   */
  async createProcessingStep(stepData) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const {
        stepId,
        batchId,
        processType,
        processorId,
        processDate,
        inputMaterials,
        outputProducts,
        processParameters
      } = stepData;

      logger.info(`Creating processing step: ${stepId}`);

      const result = await this.contract.submitTransaction(
        'CreateProcessingStep',
        stepId,
        batchId,
        processType,
        processorId,
        processDate,
        JSON.stringify(inputMaterials),
        JSON.stringify(outputProducts),
        JSON.stringify(processParameters)
      );

      const response = JSON.parse(result.toString());
      logger.info(`✅ Processing step created successfully: ${stepId}`);
      
      return {
        success: true,
        transactionId: response.txId,
        stepId: stepId,
        blockNumber: response.blockNumber,
        timestamp: response.timestamp
      };
    } catch (error) {
      logger.error(`❌ Failed to create processing step: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate provenance data for a product
   */
  async generateProvenance(productId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      logger.info(`Generating provenance for product: ${productId}`);
      
      const result = await this.contract.evaluateTransaction('GenerateProvenance', productId);
      const provenanceData = JSON.parse(result.toString());

      return {
        success: true,
        data: provenanceData
      };
    } catch (error) {
      logger.error(`❌ Failed to generate provenance: ${error.message}`);
      throw error;
    }
  }

  /**
   * Query collections by farmer
   */
  async queryCollectionsByFarmer(farmerId, startDate, endDate) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      logger.info(`Querying collections for farmer: ${farmerId}`);
      
      const result = await this.contract.evaluateTransaction(
        'QueryCollectionsByFarmer',
        farmerId,
        startDate || '',
        endDate || ''
      );
      
      const collections = JSON.parse(result.toString());

      return {
        success: true,
        data: collections
      };
    } catch (error) {
      logger.error(`❌ Failed to query collections by farmer: ${error.message}`);
      throw error;
    }
  }

  /**
   * Query collections by species
   */
  async queryCollectionsBySpecies(species, startDate, endDate) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      logger.info(`Querying collections for species: ${species}`);
      
      const result = await this.contract.evaluateTransaction(
        'QueryCollectionsBySpecies',
        species,
        startDate || '',
        endDate || ''
      );
      
      const collections = JSON.parse(result.toString());

      return {
        success: true,
        data: collections
      };
    } catch (error) {
      logger.error(`❌ Failed to query collections by species: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate geo-fencing for collection
   */
  async validateGeoFencing(gpsCoordinates, farmerId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      logger.info(`Validating geo-fencing for farmer: ${farmerId}`);
      
      const result = await this.contract.evaluateTransaction(
        'ValidateGeoFencing',
        JSON.stringify(gpsCoordinates),
        farmerId
      );
      
      const validationResult = JSON.parse(result.toString());

      return {
        success: true,
        data: validationResult
      };
    } catch (error) {
      logger.error(`❌ Failed to validate geo-fencing: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect from the gateway
   */
  async disconnect() {
    try {
      if (this.gateway) {
        await this.gateway.disconnect();
        this.isConnected = false;
        logger.info('Disconnected from Fabric gateway');
      }
    } catch (error) {
      logger.error('Error disconnecting from gateway:', error);
    }
  }
}

// Create and export singleton instance
const fabricNetworkService = new FabricNetworkService();
module.exports = fabricNetworkService;