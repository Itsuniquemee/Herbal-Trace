import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Plus,
  Award,
  Shield,
  CheckCircle,
  Calendar,
  User
} from 'lucide-react';

const FarmerDocuments = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Organic Certification',
      type: 'certificate',
      category: 'Certification',
      uploadDate: '2024-01-15',
      status: 'Verified',
      size: '2.4 MB',
      validUntil: '2025-01-15'
    },
    {
      id: 2,
      name: 'Soil Test Report 2024',
      type: 'report',
      category: 'Testing',
      uploadDate: '2024-03-10',
      status: 'Pending',
      size: '1.8 MB',
      validUntil: '2025-03-10'
    },
    {
      id: 3,
      name: 'Farm Registration Certificate',
      type: 'certificate',
      category: 'Registration',
      uploadDate: '2023-12-01',
      status: 'Verified',
      size: '1.2 MB',
      validUntil: '2028-12-01'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDocuments = documents.filter(doc => 
    selectedCategory === 'all' || doc.category === selectedCategory
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'certificate': return Award;
      case 'report': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Farm Documents</h1>
            <p className="text-muted-foreground">Manage your farm certificates and documentation</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {['all', 'Certification', 'Testing', 'Registration'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {category === 'all' ? 'All Documents' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document, index) => {
          const IconComponent = getDocumentIcon(document.type);
          return (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{document.name}</h3>
                    <p className="text-sm text-muted-foreground">{document.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upload Date:</span>
                  <span className="text-foreground">{new Date(document.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="text-foreground">{document.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span className="text-foreground">{new Date(document.validUntil).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-accent transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold text-foreground">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'Verified').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === 'Pending').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
            <Upload className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Upload Organic Certificate</p>
              <p className="text-sm text-muted-foreground">Add or renew your organic certification</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
            <FileText className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Upload Soil Test Report</p>
              <p className="text-sm text-muted-foreground">Add latest soil analysis results</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
            <Award className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Upload Farm Registration</p>
              <p className="text-sm text-muted-foreground">Add farm registration documents</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDocuments;