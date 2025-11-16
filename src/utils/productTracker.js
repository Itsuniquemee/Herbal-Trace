// Product tracking and journey management system

export class ProductTracker {
  constructor() {
    this.products = this.loadProducts();
    this.journeyStages = [
      'Registration',
      'Cultivation',
      'Harvest',
      'Processing', 
      'Quality Testing',
      'Packaging',
      'Distribution',
      'Retail',
      'Consumer'
    ];
  }

  // Load products from localStorage
  loadProducts() {
    const stored = localStorage.getItem('tracked_products');
    return stored ? JSON.parse(stored) : {};
  }

  // Save products to localStorage
  saveProducts() {
    localStorage.setItem('tracked_products', JSON.stringify(this.products));
  }

  // Create a new product with initial journey stage
  createProduct(productData) {
    const productId = this.generateProductId(productData.name);
    
    const product = {
      ...productData,
      id: productId,
      createdAt: new Date().toISOString(),
      status: 'Active',
      currentStage: 'Registration',
      journey: [{
        stage: 'Registration',
        date: new Date().toISOString().split('T')[0],
        location: productData.location,
        status: 'Completed',
        timestamp: new Date().toISOString(),
        notes: 'Product registered in TraceHerb system'
      }],
      qrGenerated: true,
      verificationUrl: `https://traceherb.com/verify/${productId}`
    };

    this.products[productId] = product;
    this.saveProducts();
    
    return product;
  }

  // Generate unique product ID
  generateProductId(productName) {
    const prefix = productName.toUpperCase().replace(/[^A-Z]/g, '').substr(0, 3);
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${timestamp}_${random}`;
  }

  // Get product by ID
  getProduct(productId) {
    return this.products[productId] || null;
  }

  // Update product journey
  updateJourney(productId, stageData) {
    const product = this.products[productId];
    if (!product) {
      throw new Error('Product not found');
    }

    const journeyEntry = {
      stage: stageData.stage,
      date: stageData.date || new Date().toISOString().split('T')[0],
      location: stageData.location,
      status: stageData.status || 'Completed',
      timestamp: new Date().toISOString(),
      notes: stageData.notes || '',
      updatedBy: stageData.updatedBy || 'System'
    };

    product.journey.push(journeyEntry);
    product.currentStage = stageData.stage;
    product.lastUpdated = new Date().toISOString();

    this.saveProducts();
    return product;
  }

  // Get all products
  getAllProducts() {
    return Object.values(this.products);
  }

  // Search products
  searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.products).filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.id.toLowerCase().includes(lowerQuery) ||
      product.farmer.toLowerCase().includes(lowerQuery) ||
      product.location.toLowerCase().includes(lowerQuery)
    );
  }

  // Get products by farmer
  getProductsByFarmer(farmerName) {
    return Object.values(this.products).filter(product => 
      product.farmer.toLowerCase() === farmerName.toLowerCase()
    );
  }

  // Get products by status
  getProductsByStatus(status) {
    return Object.values(this.products).filter(product => 
      product.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Get journey statistics
  getJourneyStats(productId) {
    const product = this.products[productId];
    if (!product) return null;

    const totalStages = this.journeyStages.length;
    const completedStages = product.journey.filter(j => j.status === 'Completed').length;
    const progressPercentage = (completedStages / totalStages) * 100;

    return {
      totalStages,
      completedStages,
      progressPercentage,
      currentStage: product.currentStage,
      estimatedCompletion: this.estimateCompletion(product)
    };
  }

  // Estimate completion date
  estimateCompletion(product) {
    const avgDaysPerStage = 7; // Average 7 days per stage
    const remainingStages = this.journeyStages.length - product.journey.length;
    const estimatedDays = remainingStages * avgDaysPerStage;
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    
    return estimatedDate.toISOString().split('T')[0];
  }

  // Verify product authenticity
  verifyProduct(productId) {
    const product = this.products[productId];
    if (!product) {
      return {
        isValid: false,
        message: 'Product not found in database',
        product: null
      };
    }

    // Check if product is active
    if (product.status !== 'Active') {
      return {
        isValid: false,
        message: 'Product is not active',
        product
      };
    }

    return {
      isValid: true,
      message: 'Product verified successfully',
      product,
      journeyStats: this.getJourneyStats(productId)
    };
  }

  // Get verification report
  getVerificationReport(productId) {
    const verification = this.verifyProduct(productId);
    if (!verification.isValid) {
      return verification;
    }

    const product = verification.product;
    const stats = verification.journeyStats;

    return {
      ...verification,
      report: {
        productInfo: {
          name: product.name,
          id: product.id,
          farmer: product.farmer,
          location: product.location,
          harvestDate: product.harvestDate,
          quality: product.quality,
          batch: product.batch
        },
        journeyInfo: {
          currentStage: stats.currentStage,
          progress: `${stats.completedStages}/${stats.totalStages} stages completed`,
          progressPercentage: stats.progressPercentage,
          estimatedCompletion: stats.estimatedCompletion
        },
        timeline: product.journey.map(entry => ({
          stage: entry.stage,
          date: entry.date,
          location: entry.location,
          status: entry.status,
          notes: entry.notes
        })),
        metadata: {
          createdAt: product.createdAt,
          lastUpdated: product.lastUpdated,
          qrGenerated: product.qrGenerated,
          verificationUrl: product.verificationUrl
        }
      }
    };
  }

  // Export data for analytics
  exportData() {
    return {
      products: this.products,
      summary: {
        totalProducts: Object.keys(this.products).length,
        activeProducts: Object.values(this.products).filter(p => p.status === 'Active').length,
        completedJourneys: Object.values(this.products).filter(p => 
          p.journey.length >= this.journeyStages.length
        ).length,
        averageJourneyProgress: this.getAverageProgress()
      },
      exportedAt: new Date().toISOString()
    };
  }

  // Calculate average journey progress
  getAverageProgress() {
    const products = Object.values(this.products);
    if (products.length === 0) return 0;

    const totalProgress = products.reduce((sum, product) => {
      const stats = this.getJourneyStats(product.id);
      return sum + (stats ? stats.progressPercentage : 0);
    }, 0);

    return totalProgress / products.length;
  }

  // Generate QR code data
  generateQRData(productId) {
    const product = this.products[productId];
    if (!product) return null;

    return {
      productId: product.id,
      verificationUrl: product.verificationUrl,
      basicInfo: {
        name: product.name,
        farmer: product.farmer,
        location: product.location
      },
      generatedAt: new Date().toISOString()
    };
  }

  // Bulk import products
  bulkImport(productsArray) {
    const imported = [];
    const errors = [];

    productsArray.forEach((productData, index) => {
      try {
        if (!productData.name || !productData.farmer || !productData.location) {
          errors.push({
            index,
            error: 'Missing required fields (name, farmer, location)',
            data: productData
          });
          return;
        }

        const product = this.createProduct(productData);
        imported.push(product);
      } catch (error) {
        errors.push({
          index,
          error: error.message,
          data: productData
        });
      }
    });

    return {
      imported: imported.length,
      errors: errors.length,
      details: { imported, errors }
    };
  }
}

// Create singleton instance
export const productTracker = new ProductTracker();

// Export utility functions
export const trackingUtils = {
  // Format journey stage for display
  formatStage: (stage) => {
    return stage.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  },

  // Get stage color for UI
  getStageColor: (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  // Calculate days between dates
  daysBetween: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Generate downloadable QR code content
  generateQRContent: (productId) => {
    const product = productTracker.getProduct(productId);
    if (!product) return null;

    return {
      url: product.verificationUrl,
      data: {
        productId: product.id,
        name: product.name,
        farmer: product.farmer,
        verifyUrl: `${window.location.origin}/verify/${product.id}`
      }
    };
  }
};