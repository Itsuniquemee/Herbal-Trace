import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Package, 
  MapPin, 
  Leaf, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';

const FarmerHarvestRecords = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load records from localStorage
    const savedRecords = JSON.parse(localStorage.getItem('farmer_crop_records') || '[]');
    setRecords(savedRecords);
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.herbType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.batchId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending verification': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Harvest Records</h1>
            <p className="text-muted-foreground">View and manage your crop harvest records</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Record</span>
          </button>
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
              <option value="pending verification">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Records Found</h3>
            <p className="text-muted-foreground mb-4">
              {records.length === 0 
                ? "You haven't uploaded any crop records yet." 
                : "No records match your search criteria."
              }
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto">
              <Plus className="h-4 w-4" />
              <span>Upload First Record</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Batch ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Herb Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Harvest Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((record, index) => (
                  <motion.tr
                    key={record.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{record.batchId}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span>{record.herbType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{record.quantity} {record.unit}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{new Date(record.harvestDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                        {record.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold text-foreground">{records.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {records.filter(r => r.status === 'Approved').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {records.filter(r => r.status === 'Pending Verification').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-purple-600">
                {records.filter(r => {
                  const recordDate = new Date(r.submittedAt);
                  const currentDate = new Date();
                  return recordDate.getMonth() === currentDate.getMonth() && 
                         recordDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerHarvestRecords;