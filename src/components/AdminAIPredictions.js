import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

const AdminAIPredictions = () => {
  const [selectedModel, setSelectedModel] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('predictions');

  // Mock AI predictions data
  const [predictions, setPredictions] = useState({
    models: [
      {
        id: 1,
        name: 'Crop Yield Predictor',
        type: 'regression',
        accuracy: 94.2,
        status: 'active',
        lastTrained: '2024-01-10T00:00:00Z',
        predictions: 1247,
        description: 'Predicts crop yield based on weather, soil, and farming practices'
      },
      {
        id: 2,
        name: 'Quality Assessment AI',
        type: 'classification',
        accuracy: 97.8,
        status: 'active',
        lastTrained: '2024-01-08T00:00:00Z',
        predictions: 3521,
        description: 'Automated quality grading for agricultural products'
      },
      {
        id: 3,
        name: 'Fraud Detection Model',
        type: 'anomaly_detection',
        accuracy: 92.1,
        status: 'training',
        lastTrained: '2024-01-05T00:00:00Z',
        predictions: 856,
        description: 'Identifies fraudulent activities in supply chain'
      },
      {
        id: 4,
        name: 'Market Price Forecaster',
        type: 'time_series',
        accuracy: 89.5,
        status: 'active',
        lastTrained: '2024-01-12T00:00:00Z',
        predictions: 2103,
        description: 'Forecasts market prices for agricultural commodities'
      }
    ],
    recentPredictions: [
      {
        id: 1,
        model: 'Crop Yield Predictor',
        input: 'Tomato Farm, California',
        prediction: '85% yield increase expected',
        confidence: 92.3,
        timestamp: '2024-01-15T14:30:00Z',
        status: 'completed'
      },
      {
        id: 2,
        model: 'Quality Assessment AI',
        input: 'Batch #QA-2024-001',
        prediction: 'Grade A Quality',
        confidence: 97.8,
        timestamp: '2024-01-15T13:45:00Z',
        status: 'completed'
      },
      {
        id: 3,
        model: 'Fraud Detection Model',
        input: 'Transaction #TX-78945',
        prediction: 'Low Risk (Normal)',
        confidence: 88.9,
        timestamp: '2024-01-15T12:15:00Z',
        status: 'completed'
      },
      {
        id: 4,
        model: 'Market Price Forecaster',
        input: 'Wheat prices next 30 days',
        prediction: '$245/ton (+8.2%)',
        confidence: 84.7,
        timestamp: '2024-01-15T11:20:00Z',
        status: 'completed'
      }
    ],
    insights: [
      {
        id: 1,
        type: 'opportunity',
        title: 'Crop Yield Optimization',
        description: 'AI models predict 15% yield increase with precision farming techniques',
        impact: 'high',
        confidence: 91.2,
        recommendation: 'Implement IoT sensors for soil monitoring'
      },
      {
        id: 2,
        type: 'risk',
        title: 'Quality Control Alert',
        description: 'Potential quality issues detected in upcoming harvest season',
        impact: 'medium',
        confidence: 87.4,
        recommendation: 'Increase quality testing frequency'
      },
      {
        id: 3,
        type: 'trend',
        title: 'Market Price Volatility',
        description: 'Commodity prices showing unusual volatility patterns',
        impact: 'high',
        confidence: 94.8,
        recommendation: 'Consider hedging strategies for price protection'
      }
    ],
    performance: {
      totalPredictions: 7827,
      accuracyRate: 93.8,
      activeModels: 4,
      trainingModels: 1,
      averageConfidence: 91.2,
      predictionsTrend: 12.4
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="text-green-500" size={20} />;
      case 'risk': return <AlertTriangle className="text-red-500" size={20} />;
      case 'trend': return <Activity className="text-blue-500" size={20} />;
      default: return <Lightbulb className="text-gray-500" size={20} />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ModelCard = ({ model }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
          <p className="text-sm text-gray-600">{model.description}</p>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getModelStatusColor(model.status)}`}>
          {model.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Accuracy</p>
          <p className="text-xl font-bold text-gray-900">{model.accuracy}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Predictions</p>
          <p className="text-xl font-bold text-gray-900">{model.predictions.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Last trained: {new Date(model.lastTrained).toLocaleDateString()}
        </p>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 hover:text-gray-800"
          >
            <Settings size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="mr-3 text-blue-600" />
              AI Predictions
            </h1>
            <p className="text-gray-600 mt-1">Machine learning insights and predictive analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={20} />
              Refresh
            </motion.button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.performance.totalPredictions.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm ml-1">{predictions.performance.predictionsTrend}%</span>
                </div>
              </div>
              <Brain className="text-blue-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.performance.accuracyRate}%</p>
              </div>
              <Target className="text-green-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.performance.activeModels}</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Training Models</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.performance.trainingModels}</p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.performance.averageConfidence}%</p>
              </div>
              <Star className="text-purple-600" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'predictions', label: 'Recent Predictions', icon: Activity },
                { id: 'models', label: 'ML Models', icon: Brain },
                { id: 'insights', label: 'AI Insights', icon: Lightbulb }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2" size={20} />
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'predictions' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Predictions</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search predictions..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Models</option>
                    {predictions.models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Input
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions.recentPredictions.map((prediction) => (
                    <motion.tr
                      key={prediction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prediction.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prediction.input}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prediction.prediction}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{prediction.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prediction.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.models.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {predictions.insights.map(insight => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${insight.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 ml-2">{insight.confidence}%</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                      >
                        View Details
                        <ArrowRight className="ml-2" size={16} />
                      </motion.button>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminAIPredictions;