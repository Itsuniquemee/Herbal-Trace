import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  MapPin, 
  Clock, 
  User, 
  Truck,
  Package,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Eye,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Camera,
  Upload,
  X
} from 'lucide-react';

const ProcessorChainOfCustody = () => {
  const [custodyRecords, setCustodyRecords] = useState([
    {
      id: 'COC_001',
      batchId: 'FB_TUL_2024_001',
      productName: 'Tulsi Essential Oil',
      currentLocation: 'HerbalTrace Processing Facility',
      status: 'in-custody',
      timeline: [
        {
          id: 'step_1',
          stage: 'farmer-handover',
          location: 'Rajesh Kumar Farm, Uttarakhand',
          custodian: 'Rajesh Kumar',
          timestamp: '2024-01-20 09:00',
          action: 'Batch Harvested and Packed',
          temperature: '25°C',
          humidity: '60%',
          weight: '500 kg',
          quality: 'Grade A+',
          documents: ['harvest_certificate.pdf'],
          photos: ['harvest_1.jpg', 'packing_1.jpg'],
          signature: 'digital_signature_1.png',
          verified: true
        },
        {
          id: 'step_2',
          stage: 'transport-pickup',
          location: 'Rajesh Kumar Farm, Uttarakhand',
          custodian: 'TransportCorp Logistics',
          timestamp: '2024-01-20 14:00',
          action: 'Batch Picked Up for Transport',
          temperature: '23°C',
          humidity: '55%',
          weight: '500 kg',
          vehicleDetails: 'TN-01-AB-1234',
          driverName: 'Ravi Singh',
          documents: ['transport_receipt.pdf'],
          photos: ['loading_1.jpg'],
          signature: 'digital_signature_2.png',
          verified: true
        },
        {
          id: 'step_3',
          stage: 'processor-receipt',
          location: 'HerbalTrace Processing Facility',
          custodian: 'Suresh Patel',
          timestamp: '2024-01-21 10:00',
          action: 'Batch Received at Processing Facility',
          temperature: '22°C',
          humidity: '50%',
          weight: '498 kg',
          condition: 'Good - Minor weight loss due to moisture',
          documents: ['receipt_certificate.pdf'],
          photos: ['receiving_1.jpg', 'inspection_1.jpg'],
          signature: 'digital_signature_3.png',
          verified: true
        },
        {
          id: 'step_4',
          stage: 'processing',
          location: 'HerbalTrace Processing Facility',
          custodian: 'Suresh Patel',
          timestamp: '2024-01-21 12:00',
          action: 'Processing Started - Washing Phase',
          temperature: '25°C',
          processParameters: {
            washCycles: 3,
            waterQuality: 'Purified',
            duration: '2 hours'
          },
          documents: ['processing_log.pdf'],
          photos: ['washing_1.jpg'],
          signature: 'digital_signature_4.png',
          verified: true
        },
        {
          id: 'step_5',
          stage: 'processing',
          location: 'HerbalTrace Processing Facility',
          custodian: 'Sunita Devi',
          timestamp: '2024-01-22 08:00',
          action: 'Drying Phase Completed',
          temperature: '45°C',
          humidity: '15%',
          moistureContent: '8%',
          processParameters: {
            dryingTime: '48 hours',
            airflow: 'Medium',
            targetMoisture: '8%'
          },
          documents: ['drying_report.pdf'],
          photos: ['drying_1.jpg', 'moisture_test.jpg'],
          signature: 'digital_signature_5.png',
          verified: true
        },
        {
          id: 'step_6',
          stage: 'quality-testing',
          location: 'AyurLab Certifications',
          custodian: 'Dr. Meera Gupta',
          timestamp: '2024-01-23 11:00',
          action: 'Quality Testing - Microbial Analysis',
          testResults: {
            totalPlateCount: '10^3 CFU/g',
            eColi: 'Absent',
            salmonella: 'Absent',
            yeastMold: '10^2 CFU/g'
          },
          overallResult: 'PASS',
          documents: ['microbial_certificate.pdf'],
          photos: ['lab_testing.jpg'],
          signature: 'digital_signature_6.png',
          verified: true
        },
        {
          id: 'step_7',
          stage: 'packaging',
          location: 'HerbalTrace Processing Facility',
          custodian: 'Amit Singh',
          timestamp: '2024-01-25 14:00',
          action: 'Final Packaging and QR Code Generation',
          packageDetails: {
            totalBottles: 50,
            bottleSize: '10ml',
            packageType: 'Vacuum Sealed',
            qrCodeGenerated: 'QR_TUL_PROC_001'
          },
          documents: ['packaging_certificate.pdf'],
          photos: ['packaging_1.jpg', 'qr_labels.jpg'],
          signature: 'digital_signature_7.png',
          verified: true
        }
      ]
    },
    {
      id: 'COC_002',
      batchId: 'FB_GIN_2024_002',
      productName: 'Ginger Powder',
      currentLocation: 'In Transit to Processing Facility',
      status: 'in-transit',
      timeline: [
        {
          id: 'step_1',
          stage: 'farmer-handover',
          location: 'Priya Sharma Farm, Kerala',
          custodian: 'Priya Sharma',
          timestamp: '2024-01-28 07:00',
          action: 'Batch Harvested and Ready for Pickup',
          temperature: '28°C',
          humidity: '70%',
          weight: '750 kg',
          quality: 'Grade A',
          documents: ['harvest_certificate.pdf'],
          photos: ['harvest_2.jpg'],
          signature: 'digital_signature_8.png',
          verified: true
        },
        {
          id: 'step_2',
          stage: 'transport-pickup',
          location: 'Priya Sharma Farm, Kerala',
          custodian: 'QuickTrans Logistics',
          timestamp: '2024-01-28 12:00',
          action: 'Batch in Transit to Processing Facility',
          temperature: '26°C',
          humidity: '65%',
          weight: '750 kg',
          vehicleDetails: 'KL-07-CD-5678',
          driverName: 'Mohan Das',
          estimatedArrival: '2024-01-29 16:00',
          documents: ['transport_receipt.pdf'],
          photos: ['loading_2.jpg'],
          signature: 'digital_signature_9.png',
          verified: false
        }
      ]
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStep, setSelectedStep] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Records', count: custodyRecords.length },
    { value: 'in-custody', label: 'In Custody', count: custodyRecords.filter(r => r.status === 'in-custody').length },
    { value: 'in-transit', label: 'In Transit', count: custodyRecords.filter(r => r.status === 'in-transit').length },
    { value: 'completed', label: 'Completed', count: custodyRecords.filter(r => r.status === 'completed').length }
  ];

  const filteredRecords = custodyRecords.filter(record => {
    const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'in-custody': 'bg-blue-100 text-blue-800 border-blue-200',
      'in-transit': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'delayed': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'in-custody': Shield,
      'in-transit': Truck,
      'completed': CheckCircle,
      'delayed': AlertTriangle
    };
    const Icon = icons[status] || Shield;
    return <Icon className="h-4 w-4" />;
  };

  const getStageIcon = (stage) => {
    const icons = {
      'farmer-handover': User,
      'transport-pickup': Truck,
      'processor-receipt': Package,
      'processing': FileText,
      'quality-testing': CheckCircle,
      'packaging': Package,
      'distribution': Truck
    };
    const Icon = icons[stage] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getStageColor = (stage) => {
    const colors = {
      'farmer-handover': 'bg-green-100 text-green-800',
      'transport-pickup': 'bg-blue-100 text-blue-800',
      'processor-receipt': 'bg-purple-100 text-purple-800',
      'processing': 'bg-orange-100 text-orange-800',
      'quality-testing': 'bg-pink-100 text-pink-800',
      'packaging': 'bg-teal-100 text-teal-800',
      'distribution': 'bg-indigo-100 text-indigo-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getStageName = (stage) => {
    const names = {
      'farmer-handover': 'Farmer Handover',
      'transport-pickup': 'Transport Pickup',
      'processor-receipt': 'Processor Receipt',
      'processing': 'Processing',
      'quality-testing': 'Quality Testing',
      'packaging': 'Packaging',
      'distribution': 'Distribution'
    };
    return names[stage] || stage;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chain of Custody</h1>
            <p className="text-muted-foreground">Track complete custody chain from farm to final product</p>
          </div>
          <Shield className="h-8 w-8 text-primary" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Active Records</p>
                <p className="text-2xl font-bold text-blue-800">
                  {custodyRecords.filter(r => r.status !== 'completed').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">In Transit</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {custodyRecords.filter(r => r.status === 'in-transit').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {custodyRecords.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Steps</p>
                <p className="text-2xl font-bold text-purple-800">
                  {custodyRecords.reduce((total, record) => total + record.timeline.length, 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by custody ID, batch ID, or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Record</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custody Records */}
      <div className="space-y-6">
        {filteredRecords.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No custody records found</p>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              {/* Record Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{record.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1">{record.status.replace('-', ' ').toUpperCase()}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>{record.productName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Batch: {record.batchId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{record.currentLocation}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                  className="flex items-center space-x-2 px-3 py-1 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>{selectedRecord === record.id ? 'Hide' : 'View'} Timeline</span>
                </button>
              </div>

              {/* Timeline */}
              {selectedRecord === record.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border pt-6"
                >
                  <h4 className="font-semibold text-foreground mb-4">Custody Timeline</h4>
                  
                  <div className="space-y-4">
                    {record.timeline.map((step, stepIndex) => (
                      <div key={step.id} className="relative">
                        {/* Timeline connector */}
                        {stepIndex < record.timeline.length - 1 && (
                          <div className="absolute left-6 top-12 w-px h-12 bg-border"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          {/* Step Icon */}
                          <div className={`p-3 rounded-full ${getStageColor(step.stage)} flex-shrink-0`}>
                            {getStageIcon(step.stage)}
                          </div>
                          
                          {/* Step Content */}
                          <div className="flex-1 bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-1">
                                  <h5 className="font-medium text-foreground">{getStageName(step.stage)}</h5>
                                  {step.verified ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                  )}
                                </div>
                                <p className="text-sm text-foreground mb-2">{step.action}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-3 w-3" />
                                    <span>{step.custodian}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-3 w-3" />
                                    <span>{step.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(step.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                                className="flex items-center space-x-1 px-2 py-1 text-xs border border-border rounded hover:bg-accent transition-colors"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Details</span>
                              </button>
                            </div>
                            
                            {/* Environmental Conditions */}
                            {(step.temperature || step.humidity || step.weight) && (
                              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-2">
                                {step.temperature && <span>🌡️ {step.temperature}</span>}
                                {step.humidity && <span>💧 {step.humidity}</span>}
                                {step.weight && <span>⚖️ {step.weight}</span>}
                                {step.quality && <span>⭐ {step.quality}</span>}
                              </div>
                            )}
                            
                            {/* Step Details */}
                            {selectedStep === step.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-border pt-3 mt-3"
                              >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Additional Information */}
                                  <div>
                                    <h6 className="font-medium text-foreground mb-2">Additional Information</h6>
                                    <div className="space-y-1 text-sm">
                                      {step.condition && (
                                        <div>
                                          <span className="text-muted-foreground">Condition: </span>
                                          <span className="text-foreground">{step.condition}</span>
                                        </div>
                                      )}
                                      {step.vehicleDetails && (
                                        <div>
                                          <span className="text-muted-foreground">Vehicle: </span>
                                          <span className="text-foreground">{step.vehicleDetails}</span>
                                        </div>
                                      )}
                                      {step.driverName && (
                                        <div>
                                          <span className="text-muted-foreground">Driver: </span>
                                          <span className="text-foreground">{step.driverName}</span>
                                        </div>
                                      )}
                                      {step.overallResult && (
                                        <div>
                                          <span className="text-muted-foreground">Test Result: </span>
                                          <span className={`font-medium ${step.overallResult === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                                            {step.overallResult}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Documents & Photos */}
                                  <div>
                                    <h6 className="font-medium text-foreground mb-2">Documents & Evidence</h6>
                                    <div className="space-y-2">
                                      {step.documents.length > 0 && (
                                        <div>
                                          <span className="text-xs text-muted-foreground block mb-1">Documents:</span>
                                          <div className="flex flex-wrap gap-1">
                                            {step.documents.map((doc, docIndex) => (
                                              <span key={docIndex} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                {doc}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {step.photos && step.photos.length > 0 && (
                                        <div>
                                          <span className="text-xs text-muted-foreground block mb-1">Photos:</span>
                                          <div className="flex flex-wrap gap-1">
                                            {step.photos.map((photo, photoIndex) => (
                                              <span key={photoIndex} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                                📷 {photo}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {step.signature && (
                                        <div className="flex items-center space-x-2 text-xs">
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                          <span className="text-green-600">Digitally Signed</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Chain of Custody Record</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select batch...</option>
                  <option value="FB_TUL_2024_001">FB_TUL_2024_001 - Tulsi</option>
                  <option value="FB_GIN_2024_002">FB_GIN_2024_002 - Ginger</option>
                  <option value="FB_ASH_2024_003">FB_ASH_2024_003 - Ashwagandha</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter product name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Custodian</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter custodian name..."
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Create Record
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessorChainOfCustody;