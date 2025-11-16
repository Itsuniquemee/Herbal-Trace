import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Send, 
  Plus,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Calendar
} from 'lucide-react';

const FarmerQualityFeedback = () => {
  const [feedback, setFeedback] = useState([
    {
      id: 1,
      batchId: 'TUL_1234',
      herbType: 'Tulsi',
      processor: 'HerbalTrace Processing Ltd',
      rating: 4.5,
      comments: 'Excellent quality herbs with good moisture content. Well-packed and delivered on time.',
      date: '2024-01-20',
      status: 'Resolved',
      response: 'Thank you for the high-quality produce. Looking forward to future orders.'
    },
    {
      id: 2,
      batchId: 'GIN_5678',
      herbType: 'Ginger',
      processor: 'Organic Herbs Co.',
      rating: 3.8,
      comments: 'Good quality but some pieces were smaller than expected. Overall satisfied.',
      date: '2024-01-18',
      status: 'Pending',
      response: null
    },
    {
      id: 3,
      batchId: 'TUR_9101',
      herbType: 'Turmeric',
      processor: 'Ayurvedic Solutions Inc',
      rating: 5.0,
      comments: 'Outstanding quality turmeric with perfect color and aroma. Premium grade.',
      date: '2024-01-15',
      status: 'Resolved',
      response: 'Excellent work! We appreciate your attention to quality standards.'
    }
  ]);

  const [newFeedback, setNewFeedback] = useState({
    batchId: '',
    herbType: '',
    rating: 5,
    comments: ''
  });

  const [showNewFeedbackForm, setShowNewFeedbackForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.herbType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Add new feedback
    const feedback_item = {
      id: feedback.length + 1,
      ...newFeedback,
      processor: 'Pending Assignment',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      response: null
    };
    
    setFeedback([feedback_item, ...feedback]);
    setNewFeedback({ batchId: '', herbType: '', rating: 5, comments: '' });
    setShowNewFeedbackForm(false);
  };

  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quality Feedback</h1>
            <p className="text-muted-foreground">View feedback from processors and share your thoughts</p>
          </div>
          <button 
            onClick={() => setShowNewFeedbackForm(!showNewFeedbackForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Feedback</span>
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
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="reviewing">Reviewing</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* New Feedback Form */}
      {showNewFeedbackForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Submit New Feedback</h2>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Batch ID</label>
                <input
                  type="text"
                  value={newFeedback.batchId}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, batchId: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Herb Type</label>
                <select
                  value={newFeedback.herbType}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, herbType: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select herb type</option>
                  <option value="Tulsi">Tulsi</option>
                  <option value="Ginger">Ginger</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Neem">Neem</option>
                  <option value="Ashwagandha">Ashwagandha</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewFeedback(prev => ({ ...prev, rating: star }))}
                    className={`p-1 ${newFeedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {newFeedback.rating}/5 stars
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Comments</label>
              <textarea
                value={newFeedback.comments}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Share your feedback about the processing or any suggestions..."
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Submit Feedback</span>
              </button>
              <button
                type="button"
                onClick={() => setShowNewFeedbackForm(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold text-foreground">{item.herbType}</h3>
                  <p className="text-sm text-muted-foreground">Batch: {item.batchId}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${item.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className={`ml-2 text-sm font-medium ${getRatingColor(item.rating)}`}>
                    {item.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-1">Processor: {item.processor}</p>
              <p className="text-foreground">{item.comments}</p>
            </div>

            {item.response && (
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-1">Processor Response:</p>
                <p className="text-sm text-foreground">{item.response}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors">
                  <ThumbsDown className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>
              <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Feedback</p>
              <p className="text-2xl font-bold text-foreground">{feedback.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Response</p>
              <p className="text-2xl font-bold text-yellow-600">
                {feedback.filter(f => f.status === 'Pending').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {feedback.filter(f => {
                  const feedbackDate = new Date(f.date);
                  const currentDate = new Date();
                  return feedbackDate.getMonth() === currentDate.getMonth() && 
                         feedbackDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerQualityFeedback;