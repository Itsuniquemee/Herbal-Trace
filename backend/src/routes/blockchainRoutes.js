const express = require('express');
const fabricNetworkService = require('../services/FabricNetworkService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Blockchain Integration Routes
 */

/**
 * @route GET /api/blockchain/status
 * @desc Get blockchain network status
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = await fabricNetworkService.getNetworkStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Failed to get blockchain status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get blockchain status'
    });
  }
});

/**
 * @route POST /api/blockchain/collection-events
 * @desc Create collection event on blockchain
 * @access Private
 */
router.post('/collection-events', async (req, res) => {
  try {
    const eventData = req.body;
    const result = await fabricNetworkService.createCollectionEvent(eventData);
    
    logger.blockchain('CREATE_COLLECTION_EVENT', result);
    
    res.json({
      success: true,
      message: 'Collection event created on blockchain',
      data: result
    });
  } catch (error) {
    logger.error('Failed to create collection event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create collection event on blockchain'
    });
  }
});

/**
 * @route GET /api/blockchain/collection-events/:eventId
 * @desc Get collection event from blockchain
 * @access Public
 */
router.get('/collection-events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await fabricNetworkService.getCollectionEvent(eventId);
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error('Failed to get collection event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get collection event from blockchain'
    });
  }
});

/**
 * @route POST /api/blockchain/quality-tests
 * @desc Create quality test record on blockchain
 * @access Private
 */
router.post('/quality-tests', async (req, res) => {
  try {
    const testData = req.body;
    const result = await fabricNetworkService.createQualityTest(testData);
    
    logger.blockchain('CREATE_QUALITY_TEST', result);
    
    res.json({
      success: true,
      message: 'Quality test created on blockchain',
      data: result
    });
  } catch (error) {
    logger.error('Failed to create quality test:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create quality test on blockchain'
    });
  }
});

/**
 * @route POST /api/blockchain/processing-steps
 * @desc Create processing step record on blockchain
 * @access Private
 */
router.post('/processing-steps', async (req, res) => {
  try {
    const stepData = req.body;
    const result = await fabricNetworkService.createProcessingStep(stepData);
    
    logger.blockchain('CREATE_PROCESSING_STEP', result);
    
    res.json({
      success: true,
      message: 'Processing step created on blockchain',
      data: result
    });
  } catch (error) {
    logger.error('Failed to create processing step:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create processing step on blockchain'
    });
  }
});

/**
 * @route GET /api/blockchain/provenance/:productId
 * @desc Get full provenance data for a product
 * @access Public
 */
router.get('/provenance/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await fabricNetworkService.generateProvenance(productId);
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error('Failed to get provenance data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get provenance data from blockchain'
    });
  }
});

module.exports = router;