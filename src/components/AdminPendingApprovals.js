import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../config/api';
import {
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Building,
  Eye,
  Check,
  X,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch pending users from backend
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/pending-users');
      setPendingUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Failed to load pending users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Approve user
  const handleApprove = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: 'approving' }));
      
      await apiClient.put(`/admin/users/${userId}/approve`);
      toast.success('User approved successfully');
      // Remove from pending list
      setPendingUsers(prev => prev.filter(user => user._id !== userId || user.id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error(error.response?.data?.message || 'Failed to approve user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // Reject user (deactivate account)
  const handleReject = async (userId) => {
    if (!confirm('Are you sure you want to reject this user? Their account will be deactivated.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [userId]: 'rejecting' }));
      
      await apiClient.put(`/admin/users/${userId}/reject`, { 
        reason: 'Rejected by admin' 
      });
      
      toast.success('User rejected successfully');
      // Remove from pending list  
      setPendingUsers(prev => prev.filter(user => user._id !== userId || user.id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error(error.response?.data?.message || 'Failed to reject user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Filter users
  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'farmer': return <User className="h-4 w-4" />;
      case 'processor': return <Building className="h-4 w-4" />;
      case 'regulator': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'processor': return 'bg-blue-100 text-blue-800';
      case 'regulator': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Clock className="mr-3 text-orange-500" />
                Pending User Approvals
              </h1>
              <p className="text-gray-600 mt-2">
                Review and approve new user registrations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPendingUsers}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Total Pending</p>
                  <p className="text-2xl font-bold text-orange-900">{filteredUsers.length}</p>
                </div>
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Farmers</p>
                  <p className="text-2xl font-bold text-green-900">
                    {filteredUsers.filter(u => u.role === 'farmer').length}
                  </p>
                </div>
                <User className="text-green-600" size={24} />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Processors</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {filteredUsers.filter(u => u.role === 'processor').length}
                  </p>
                </div>
                <Building className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Others</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {filteredUsers.filter(u => !['farmer', 'processor'].includes(u.role)).length}
                  </p>
                </div>
                <Shield className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={16} />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="processor">Processors</option>
                <option value="regulator">Regulators</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading pending users...</span>
            </div>
          ) : null}
          
          {!loading && filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedRole !== 'all' 
                  ? 'No users match your current filters.' 
                  : 'All registrations have been processed.'}
              </p>
            </div>
          ) : null}

          {!loading && filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="mr-1" size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1" size={12} />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          {user.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1" size={12} />
                              {user.phone}
                            </div>
                          )}
                          {user.address?.city && (
                            <div className="flex items-center">
                              <MapPin className="mr-1" size={12} />
                              {user.address.city}, {user.address.country}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(user._id)}
                            disabled={actionLoading[user._id]}
                            className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50"
                            title="Approve User"
                          >
                            {actionLoading[user._id] === 'approving' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Check size={18} />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(user._id)}
                            disabled={actionLoading[user._id]}
                            className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Reject User"
                          >
                            {actionLoading[user._id] === 'rejecting' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <X size={18} />
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Full Name</span>
                    <p className="text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Username</span>
                    <p className="text-gray-900">@{selectedUser.username}</p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Role</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {getRoleIcon(selectedUser.role)}
                      <span className="ml-1">{selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}</span>
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                {(selectedUser.phone || selectedUser.address) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.phone && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">Phone</span>
                          <p className="text-gray-900">{selectedUser.phone}</p>
                        </div>
                      )}
                      {selectedUser.address && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">Address</span>
                          <p className="text-gray-900">
                            {selectedUser.address.street && `${selectedUser.address.street}, `}
                            {selectedUser.address.city && `${selectedUser.address.city}, `}
                            {selectedUser.address.state && `${selectedUser.address.state}, `}
                            {selectedUser.address.country}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Role-specific profiles */}
                {selectedUser.farmerProfile && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Farmer Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.farmerProfile.farmName && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">Farm Name</span>
                          <p className="text-gray-900">{selectedUser.farmerProfile.farmName}</p>
                        </div>
                      )}
                      {selectedUser.farmerProfile.farmSize && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">Farm Size</span>
                          <p className="text-gray-900">{selectedUser.farmerProfile.farmSize} acres</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedUser.processorProfile && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Processor Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.processorProfile.companyName && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">Company Name</span>
                          <p className="text-gray-900">{selectedUser.processorProfile.companyName}</p>
                        </div>
                      )}
                      {selectedUser.processorProfile.facilityType && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">Facility Type</span>
                          <p className="text-gray-900">{selectedUser.processorProfile.facilityType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Registration Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Registration Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-700 mb-1">Registration Date</span>
                      <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700 mb-1">Email Verified</span>
                      <p className="text-gray-900">
                        {selectedUser.isVerified ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="mr-1" size={16} />
                            Verified
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <AlertTriangle className="mr-1" size={16} />
                            Not Verified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReject(selectedUser._id)}
                  disabled={actionLoading[selectedUser._id]}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {actionLoading[selectedUser._id] === 'rejecting' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <X className="mr-2" size={16} />
                  )}
                  Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApprove(selectedUser._id)}
                  disabled={actionLoading[selectedUser._id]}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {actionLoading[selectedUser._id] === 'approving' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Check className="mr-2" size={16} />
                  )}
                  Approve
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPendingApprovals;