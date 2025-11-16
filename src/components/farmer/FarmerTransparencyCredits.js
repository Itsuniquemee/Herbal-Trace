import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  Coins, 
  Gift, 
  Star,
  Calendar,
  Package,
  Eye,
  Download,
  Share,
  Info
} from 'lucide-react';

const FarmerTransparencyCredits = () => {
  const [credits] = useState({
    total: 2450,
    available: 1890,
    redeemed: 560,
    thisMonth: 340
  });

  const [transactions] = useState([
    {
      id: 1,
      type: 'earned',
      amount: 150,
      description: 'Quality verification bonus - Tulsi batch TUL_1234',
      date: '2024-01-20',
      status: 'confirmed',
      category: 'Quality Bonus'
    },
    {
      id: 2,
      type: 'earned',
      amount: 100,
      description: 'Timely delivery bonus - Ginger batch GIN_5678',
      date: '2024-01-18',
      status: 'confirmed',
      category: 'Delivery Bonus'
    },
    {
      id: 3,
      type: 'redeemed',
      amount: -200,
      description: 'Redeemed for premium organic seeds',
      date: '2024-01-15',
      status: 'completed',
      category: 'Seed Purchase'
    },
    {
      id: 4,
      type: 'earned',
      amount: 75,
      description: 'Documentation completeness - Complete harvest records',
      date: '2024-01-12',
      status: 'confirmed',
      category: 'Documentation'
    },
    {
      id: 5,
      type: 'earned',
      amount: 125,
      description: 'Sustainability practices - Organic certification maintained',
      date: '2024-01-10',
      status: 'confirmed',
      category: 'Sustainability'
    }
  ]);

  const [rewards] = useState([
    {
      id: 1,
      title: 'Premium Organic Seeds Package',
      description: 'High-quality certified organic seeds for next season',
      cost: 300,
      category: 'Seeds',
      available: true,
      image: '🌱'
    },
    {
      id: 2,
      title: 'Organic Fertilizer Kit',
      description: 'Complete organic fertilizer package for 1 hectare',
      cost: 250,
      category: 'Fertilizers',
      available: true,
      image: '🌿'
    },
    {
      id: 3,
      title: 'Farm Equipment Discount',
      description: '20% discount on modern farming equipment',
      cost: 500,
      category: 'Equipment',
      available: true,
      image: '🚜'
    },
    {
      id: 4,
      title: 'Quality Testing Kit',
      description: 'Home soil and water testing kit',
      cost: 180,
      category: 'Testing',
      available: true,
      image: '🧪'
    },
    {
      id: 5,
      title: 'Training Workshop Access',
      description: 'Access to premium agricultural training programs',
      cost: 400,
      category: 'Education',
      available: true,
      image: '📚'
    },
    {
      id: 6,
      title: 'Packaging Materials',
      description: 'Eco-friendly packaging materials for harvest',
      cost: 150,
      category: 'Packaging',
      available: false,
      image: '📦'
    }
  ]);

  const getTransactionColor = (type) => {
    return type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type) => {
    return type === 'earned' ? '+' : '-';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Quality Bonus': 'bg-green-100 text-green-800',
      'Delivery Bonus': 'bg-blue-100 text-blue-800',
      'Documentation': 'bg-purple-100 text-purple-800',
      'Sustainability': 'bg-emerald-100 text-emerald-800',
      'Seed Purchase': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transparency Credits</h1>
            <p className="text-muted-foreground">Earn and redeem credits for sustainable farming practices</p>
          </div>
          <Award className="h-8 w-8 text-primary" />
        </div>

        {/* Credits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Credits</p>
                <p className="text-2xl font-bold">{credits.total.toLocaleString()}</p>
              </div>
              <Coins className="h-8 w-8 opacity-90" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available</p>
                <p className="text-2xl font-bold">{credits.available.toLocaleString()}</p>
              </div>
              <Gift className="h-8 w-8 opacity-90" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Redeemed</p>
                <p className="text-2xl font-bold">{credits.redeemed.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 opacity-90" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This Month</p>
                <p className="text-2xl font-bold">{credits.thisMonth.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}{Math.abs(transaction.amount)} credits
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{transaction.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
            View All Transactions
          </button>
        </div>

        {/* How to Earn Credits */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">How to Earn Credits</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Quality Bonus</p>
                <p className="text-sm text-muted-foreground">Earn 100-200 credits for premium quality produce</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Timely Delivery</p>
                <p className="text-sm text-muted-foreground">Earn 50-150 credits for on-time deliveries</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Complete Documentation</p>
                <p className="text-sm text-muted-foreground">Earn 75 credits for complete record keeping</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Gift className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Sustainability Practices</p>
                <p className="text-sm text-muted-foreground">Earn 100-300 credits for eco-friendly farming</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Store */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Rewards Store</h2>
          <p className="text-sm text-muted-foreground">
            Available Credits: <span className="font-bold text-primary">{credits.available}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border border-border rounded-lg p-4 ${
                reward.available ? 'hover:shadow-md' : 'opacity-60'
              } transition-shadow`}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{reward.image}</div>
                <h3 className="font-medium text-foreground mb-1">{reward.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">{reward.cost} credits</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  disabled={!reward.available || credits.available < reward.cost}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    reward.available && credits.available >= reward.cost
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {!reward.available 
                    ? 'Out of Stock' 
                    : credits.available < reward.cost 
                    ? 'Insufficient Credits' 
                    : 'Redeem Now'
                  }
                </button>
                
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-1 border border-border rounded-lg text-xs hover:bg-accent transition-colors">
                    <Info className="h-3 w-3" />
                    <span>Details</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-1 border border-border rounded-lg text-xs hover:bg-accent transition-colors">
                    <Share className="h-3 w-3" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Download className="h-5 w-5" />
          <span>Download Credits Statement</span>
        </button>
        <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
          <Share className="h-5 w-5" />
          <span>Share Achievement</span>
        </button>
        <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-accent transition-colors">
          <Info className="h-5 w-5" />
          <span>Learn More</span>
        </button>
      </div>
    </div>
  );
};

export default FarmerTransparencyCredits;