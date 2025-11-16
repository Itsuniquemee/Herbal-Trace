import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, ArrowLeft } from 'lucide-react';

const ErrorFallback = ({ 
  error, 
  resetError, 
  showDetails = false, 
  customMessage = null,
  onRetry = null,
  onGoHome = null 
}) => {
  const errorVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const getErrorMessage = () => {
    if (customMessage) return customMessage;
    
    if (error?.message) {
      // Common error messages
      if (error.message.includes('Network')) {
        return 'Network connection error. Please check your internet connection.';
      }
      if (error.message.includes('404')) {
        return 'The requested resource was not found.';
      }
      if (error.message.includes('500')) {
        return 'Server error. Please try again later.';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  const getErrorType = () => {
    if (error?.message) {
      if (error.message.includes('Network') || error.message.includes('timeout')) {
        return 'network';
      }
      if (error.message.includes('404')) {
        return 'not-found';
      }
      if (error.message.includes('500')) {
        return 'server';
      }
    }
    return 'general';
  };

  const errorType = getErrorType();

  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
      case 'not-found':
        return <AlertTriangle className="h-16 w-16 text-blue-500" />;
      case 'server':
        return <AlertTriangle className="h-16 w-16 text-red-500" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-red-500" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'network':
        return 'Connection Error';
      case 'not-found':
        return 'Not Found';
      case 'server':
        return 'Server Error';
      default:
        return 'Something went wrong';
    }
  };

  return (
    <motion.div
      variants={errorVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-background flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex justify-center"
        >
          {getErrorIcon()}
        </motion.div>

        {/* Error content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            {getErrorTitle()}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {getErrorMessage()}
          </p>
        </div>

        {/* Error details (if enabled) */}
        {showDetails && error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-muted p-4 rounded-lg text-left"
          >
            <details className="space-y-2">
              <summary className="cursor-pointer font-medium text-foreground">
                Technical Details
              </summary>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Error:</strong> {error.message}</p>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 text-xs bg-background p-2 rounded overflow-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onRetry}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </motion.button>
          )}
          
          {resetError && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={resetError}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </motion.button>
          )}

          {onGoHome && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onGoHome}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </motion.button>
          )}
        </div>

        {/* Help text */}
        <div className="text-sm text-muted-foreground">
          <p>
            If this problem persists, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Specific error components for different scenarios
export const NetworkError = ({ onRetry, onGoHome }) => (
  <ErrorFallback
    customMessage="Unable to connect to the server. Please check your internet connection and try again."
    onRetry={onRetry}
    onGoHome={onGoHome}
  />
);

export const NotFoundError = ({ onGoHome }) => (
  <ErrorFallback
    customMessage="The page or resource you're looking for doesn't exist or has been moved."
    onGoHome={onGoHome}
  />
);

export const ServerError = ({ onRetry, onGoHome }) => (
  <ErrorFallback
    customMessage="Our servers are experiencing issues. Please try again in a few moments."
    onRetry={onRetry}
    onGoHome={onGoHome}
  />
);

export const ValidationError = ({ errors = [], onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen bg-background flex items-center justify-center p-6"
  >
    <div className="max-w-md w-full text-center space-y-6">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
      
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Validation Error
        </h1>
        <p className="text-muted-foreground">
          Please correct the following errors:
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-muted p-4 rounded-lg text-left space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{error}</span>
            </div>
          ))}
        </div>
      )}

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </motion.button>
      )}
    </div>
  </motion.div>
);

export default ErrorFallback;