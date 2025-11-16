import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children, user, requiredRoles = [], fallbackPath = '/dashboard' }) => {
  // If no user is logged in, redirect to login (handled by App.js)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles are required, allow access
  if (requiredRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasAccess = requiredRoles.includes(user.role);

  if (!hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      >
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-muted-foreground">
              This page requires {requiredRoles.join(' or ')} privileges
            </span>
          </div>
          
          <p className="text-muted-foreground mb-8">
            You are currently logged in as <strong>{user.role}</strong>. 
            Please contact your administrator if you need access to this section.
          </p>
          
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return children;
};

export default ProtectedRoute;