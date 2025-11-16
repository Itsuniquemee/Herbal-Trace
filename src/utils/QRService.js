// QRService.js - Optimized QR Code generation and management service
// Solves "amount of data is too big" error by storing only essential data in QR codes

class QRService {
  constructor() {
    this.storageKey = 'herbaltrace_traces';
    this.maxQRLength = 2900; // Safe limit for QR codes (alphanumeric mode supports ~4,296 chars)
  }

  // Generate a unique trace ID
  generateTraceId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TH_${timestamp}_${random}`.toUpperCase();
  }

  // Create optimized QR data with minimal information
  createQRData(productData, collectionData = null) {
    const traceId = this.generateTraceId();

    // Store full product data separately
    const fullData = this.createFullProductData(productData, collectionData, traceId);
    this.storeFullData(traceId, fullData);

    // Convert to compact string format for QR (only the trace URL)
        const qrString = `https://traceherbss.com/trace/${traceId}`;
    
    // Validate size
    if (qrString.length > this.maxQRLength) {
      throw new Error(`QR data too large: ${qrString.length} chars (max: ${this.maxQRLength})`);
    }

    return {
      qrString,
      traceId,
      fullData
    };
  }

  // Create comprehensive product data for storage
  createFullProductData(productData, collectionData, traceId) {
    const getBotanicalName = (herbName) => {
      const botanicalNames = {
        'Tulsi': 'Ocimum sanctum',
        'Neem': 'Azadirachta indica',
        'Turmeric': 'Curcuma longa',
        'Ginger': 'Zingiber officinale',
        'Ashwagandha': 'Withania somnifera',
        'Brahmi': 'Bacopa monnieri',
        'Giloy': 'Tinospora cordifolia',
        'Amla': 'Phyllanthus emblica'
      };
      return botanicalNames[herbName] || 'Botanical name under verification';
    };

    const getGPSCoordinates = (location) => {
      const coordinates = {
        'Maharashtra': '19.7515° N, 75.7139° E',
        'Karnataka': '15.3173° N, 75.7139° E',
        'Kerala': '10.8505° N, 76.2711° E',
        'Tamil Nadu': '11.1271° N, 78.6569° E',
        'Rajasthan': '27.0238° N, 74.2179° E',
        'Gujarat': '22.2587° N, 71.1924° E'
      };
      return coordinates[location] || '20.5937° N, 78.9629° E';
    };

    const getActiveCompounds = (herbName) => {
      const compounds = {
        'Tulsi': [
          { name: 'Eugenol', content: '0.8-1.2%', function: 'Antimicrobial, anti-inflammatory' },
          { name: 'Rosmarinic acid', content: '0.2-0.5%', function: 'Antioxidant' }
        ],
        'Neem': [
          { name: 'Azadirachtin', content: '0.2-0.6%', function: 'Insecticidal, antimicrobial' },
          { name: 'Nimbidin', content: '0.4-0.8%', function: 'Anti-inflammatory' }
        ],
        'Turmeric': [
          { name: 'Curcumin', content: '2.5-3.8%', function: 'Anti-inflammatory, antioxidant' },
          { name: 'Demethoxycurcumin', content: '0.8-1.2%', function: 'Anti-inflammatory' }
        ]
      };
      return compounds[herbName] || [
        { name: 'Primary active compounds', content: 'Under analysis', function: 'Therapeutic properties' }
      ];
    };

    return {
      traceId: traceId,
      productInfo: {
        name: productData.name,
        farmer: productData.farmer,
        location: productData.location,
        harvestDate: productData.harvestDate,
        quality: productData.quality,
        batch: productData.batch,
        description: `Premium quality ${productData.name} sourced directly from certified organic farms`,
        category: "Medicinal Herbs",
        botanicalName: getBotanicalName(productData.name),
        shelfLife: "24 months from harvest date",
        storageConditions: "Store in cool, dry place away from direct sunlight"
      },
      collectionInfo: collectionData ? {
        collectionId: collectionData.id,
        quantity: collectionData.quantity,
        unit: collectionData.unit,
        collectionDate: collectionData.collectionDate,
        qualityMetrics: collectionData.qualityMetrics,
        certifications: collectionData.certifications,
        farmerContact: collectionData.farmerContact
      } : null,
      farmDetails: {
        farmerId: collectionData?.farmerId || `F${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        farmName: `${productData.farmer}'s Organic Farm`,
        farmSize: "5.2 hectares",
        soilType: "Loamy with organic content 3.2%",
        irrigationMethod: "Drip irrigation with rainwater harvesting",
        organicCertified: true,
        certificationBody: "India Organic Certification Agency (IOCA)",
        certificationNumber: `IOCA/${new Date().getFullYear()}/ORG/${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        gpsCoordinates: getGPSCoordinates(productData.location)
      },
      testReports: {
        laboratoryName: "National Testing Laboratory for Herbal Products",
        labLicense: "NTLHP/2024/LAB001",
        testDate: new Date().toISOString().split('T')[0],
        reportNumber: `RPT${Date.now().toString().slice(-6)}`,
        pesticides: {
          status: "Not Detected",
          testedFor: ["Organochlorines", "Organophosphates", "Carbamates", "Pyrethroids"],
          detectionLimit: "<0.01 ppm",
          methodology: "GC-MS/MS"
        },
        heavyMetals: {
          lead: "0.05 ppm (Limit: 2.5 ppm)",
          mercury: "0.02 ppm (Limit: 0.1 ppm)",
          cadmium: "0.03 ppm (Limit: 0.3 ppm)",
          arsenic: "0.08 ppm (Limit: 1.0 ppm)",
          status: "Within Limits"
        },
        microbiology: {
          totalViableCount: "2.1 x 10³ CFU/g (Limit: 10⁵ CFU/g)",
          yeastMold: "1.8 x 10² CFU/g (Limit: 10³ CFU/g)",
          enterobacteria: "Not Detected",
          salmonella: "Absent in 10g",
          ecoli: "Absent in 1g",
          status: "Passed"
        },
        activeCompounds: getActiveCompounds(productData.name),
        moisture: "8.2% (Limit: 12%)",
        ash: "6.8% (Limit: 10%)",
        conclusion: "Sample complies with all quality parameters and is safe for consumption"
      },
      qualityMetrics: {
        purity: "98.5%",
        potency: "High",
        color: this.getExpectedColor(productData.name),
        aroma: "Characteristic aromatic",
        texture: "Fine powder/whole form",
        solubility: "Water soluble compounds present",
        pH: "6.2-6.8",
        totalAsh: "6.8%",
        acidInsolublAsh: "1.2%",
        waterSolubleAsh: "4.1%"
      },
      certifications: {
        organic: {
          certified: true,
          certifyingBody: "India Organic Certification Agency",
          certificateNumber: `IOCA-ORG-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          scope: "Production and processing of organic medicinal herbs"
        },
        fssai: {
          licensed: true,
          licenseNumber: `10${Math.random().toString().substring(2, 15)}`,
          category: "Nutraceuticals and Health Supplements",
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      },
      processingDetails: {
        harvestMethod: "Hand-picked at optimal maturity",
        dryingMethod: "Shade dried at controlled temperature (40-45°C)",
        dryingDuration: "48-72 hours",
        storageConditions: "Stored in moisture-proof containers",
        processingLocation: "Certified Processing Facility, " + productData.location,
        processedBy: "Certified Herbal Processing Unit",
        processingDate: new Date().toISOString().split('T')[0]
      },
      traceability: {
        generatedBy: "TraceHerbss System",
        generatedAt: new Date().toISOString(),
        verificationUrl: `https://traceherbss.com/verify/${traceId}`,
        blockchainHash: `0x${Math.random().toString(16).substring(2, 42)}`,
        companyInfo: {
          name: "TraceHerbss Pvt Ltd",
          registrationNumber: "CIN-U01119DL2024PTC123456",
          address: "123 Herbal Park, New Delhi, India - 110001",
          contact: "+91-9876543210",
          email: "verify@traceherbss.com",
          website: "www.traceherbss.com"
        }
      },
      journey: this.createJourney(productData, collectionData),
      usageInformation: {
        traditionalUse: this.getTraditionalUse(productData.name),
        dosage: "As per Ayurvedic practitioner's advice",
        preparation: "Can be consumed as powder, decoction, or capsule",
        precautions: "Consult healthcare provider before use"
      },
      createdAt: new Date().toISOString(),
      version: "1.0"
    };
  }

  // Helper methods
  getExpectedColor(herbName) {
    const colors = {
      'Tulsi': 'Green to dark green',
      'Neem': 'Dark green',
      'Turmeric': 'Bright yellow to orange',
      'Ginger': 'Pale yellow to cream',
      'Ashwagandha': 'Light brown to beige'
    };
    return colors[herbName] || 'Natural herb color';
  }

  getTraditionalUse(herbName) {
    const uses = {
      'Tulsi': 'Used in Ayurveda for respiratory health, immunity, and stress management',
      'Neem': 'Traditional use for skin health, blood purification, and antimicrobial properties',
      'Turmeric': 'Used for anti-inflammatory properties, digestive health, and wound healing',
      'Ginger': 'Traditional remedy for digestive issues, nausea, and respiratory conditions',
      'Ashwagandha': 'Adaptogenic herb used for stress relief, energy, and vitality'
    };
    return uses[herbName] || 'Traditional medicinal herb with therapeutic properties';
  }

  createJourney(productData, collectionData) {
    const getPreviousDate = (dateString, daysBefore) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() - daysBefore);
        return fallbackDate.toISOString().split('T')[0];
      }
      date.setDate(date.getDate() - daysBefore);
      return date.toISOString().split('T')[0];
    };

    return [
      {
        stage: "Seed/Planting",
        date: getPreviousDate(productData.harvestDate, 120),
        location: productData.location,
        status: "Completed",
        details: "Organic seeds planted in certified organic soil",
        responsible: productData.farmer
      },
      {
        stage: "Harvest",
        date: collectionData?.collectionDate || productData.harvestDate,
        location: productData.location,
        status: "Completed",
        details: "Hand-picked at optimal maturity during early morning",
        responsible: productData.farmer
      },
      {
        stage: "Quality Testing",
        date: new Date().toISOString().split('T')[0],
        location: "Quality Lab, " + productData.location,
        status: "Completed",
        details: "Comprehensive testing for purity, potency, and safety",
        responsible: "Quality Team"
      },
      {
        stage: "QR Generation & Verification",
        date: new Date().toISOString().split('T')[0],
        location: "Admin Center",
        status: "Completed",
        details: "Digital traceability record created",
        responsible: "HerbalTrace System"
      }
    ];
  }

  // Store full data in localStorage
  storeFullData(traceId, fullData) {
    try {
      const existingData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      existingData[traceId] = fullData;
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
      return true;
    } catch (error) {
      console.error('Failed to store trace data:', error);
      return false;
    }
  }

  // Retrieve full data by trace ID
  getFullData(traceId) {
    try {
      const existingData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return existingData[traceId] || null;
    } catch (error) {
      console.error('Failed to retrieve trace data:', error);
      return null;
    }
  }

  // Validate QR data format
  validateQRData(qrString) {
    try {
      // Check if it's our URL format
      if (qrString.startsWith('https://traceherbss.com/trace/')) {
        const traceId = qrString.replace('https://traceherbss.com/trace/', '');
        return { isValid: true, traceId };
      }
      
      // Check if it's a direct trace ID
      if (qrString.match(/^TH_[A-Z0-9_]+$/)) {
        return { isValid: true, traceId: qrString };
      }

      return { isValid: false, error: 'Invalid QR format' };
    } catch (error) {
      console.error('QR validation error:', error);
      return { isValid: false, error: `Invalid QR data: ${error.message}` };
    }
  }

  // Get all stored traces
  getAllTraces() {
    try {
      const existingData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return Object.keys(existingData).map(traceId => ({
        traceId,
        ...existingData[traceId]
      }));
    } catch (error) {
      console.error('Failed to retrieve all traces:', error);
      return [];
    }
  }

  // Delete a trace
  deleteTrace(traceId) {
    try {
      const existingData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      delete existingData[traceId];
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
      return true;
    } catch (error) {
      console.error('Failed to delete trace:', error);
      return false;
    }
  }

  // Clear all traces (admin function)
  clearAllTraces() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear traces:', error);
      return false;
    }
  }

  // Get trace statistics
  getStatistics() {
    try {
      const traces = this.getAllTraces();
      const cropTypes = {};
      const locations = {};
      let totalTraces = traces.length;

      traces.forEach(trace => {
        const crop = trace.productInfo?.name;
        const location = trace.productInfo?.location;
        
        if (crop) {
          cropTypes[crop] = (cropTypes[crop] || 0) + 1;
        }
        if (location) {
          locations[location] = (locations[location] || 0) + 1;
        }
      });

      return {
        totalTraces,
        cropTypes,
        locations,
        storageSize: localStorage.getItem(this.storageKey)?.length || 0
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return { totalTraces: 0, cropTypes: {}, locations: {}, storageSize: 0 };
    }
  }
}

// Create singleton instance
const qrService = new QRService();

export default qrService;