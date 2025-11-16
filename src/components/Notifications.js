import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Filter,
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  Settings,
  RefreshCw
} from 'lucide-react';

const Notifications = ({ notifications = [], onMarkAsRead, onDelete, onRefresh }) => {
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Mock notifications if none provided
  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Quality Test Passed',
      message: 'Batch #TUR2024001 has passed all quality tests successfully.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      priority: 'high',
      category: 'quality'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Temperature Alert',
      message: 'Storage temperature exceeded threshold in Facility A.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false,
      priority: 'medium',
      category: 'storage'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Collection',
      message: 'Farmer Rajesh Kumar has submitted a new collection from Rajasthan.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: true,
      priority: 'low',
      category: 'collection'
    },
    {
      id: 4,
      type: 'error',
      title: 'Recall Alert',
      message: 'Batch #ASH2024003 has been flagged for potential contamination.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: 'critical',
      category: 'recall'
    },
    {
      id: 5,
      type: 'success',
      title: 'Sync Complete',
      message: 'All offline collections have been successfully synced.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      priority: 'low',
      category: 'sync'
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = displayNotifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleBulkAction = (action) => {
    selectedNotifications.forEach(id => {
      if (action === 'read') {
        handleMarkAsRead(id);
      } else if (action === 'delete') {
        handleDelete(id);
      }
    });
    setSelectedNotifications([]);
    setIsSelectMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Bell className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSelectMode(!isSelectMode)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {isSelectMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-accent rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary hover:underline"
            >
              {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-muted-foreground">
              {selectedNotifications.length} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('read')}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Mark as Read
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative border-l-4 rounded-lg p-4 transition-all ${
                notification.read ? 'opacity-75' : ''
              } ${getPriorityColor(notification.priority)}`}
            >
              <div className="flex items-start space-x-3">
                {isSelectMode && (
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="mt-1"
                  />
                )}
                
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        notification.read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                          {notification.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 rounded hover:bg-accent transition-colors"
                          title="Mark as read"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 rounded hover:bg-accent transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notifications found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;