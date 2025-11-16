import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = "Loading...", showProgress = false, progress = 0 }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const leafVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-6">
        {/* Logo and animation */}
        <div className="relative">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          />
          <motion.div
            variants={leafVariants}
            animate="animate"
            className="relative h-16 w-16 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </motion.div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">TraceHerb</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="w-64 mx-auto space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Spinner */}
        {!showProgress && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Loading dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-2 w-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Loading states for different scenarios
export const LoadingStates = {
  INITIAL: "Initializing TraceHerb...",
  AUTHENTICATING: "Authenticating user...",
  LOADING_DATA: "Loading data...",
  SYNCING: "Syncing with blockchain...",
  PROCESSING: "Processing request...",
  UPLOADING: "Uploading files...",
  GENERATING_QR: "Generating QR code...",
  SCANNING: "Scanning QR code...",
  VALIDATING: "Validating data...",
  SAVING: "Saving changes..."
};

// Loading component with progress
export const LoadingWithProgress = ({ message, progress, steps = [] }) => {
  const currentStep = steps[Math.floor((progress / 100) * steps.length)] || steps[steps.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          />
          <div className="relative h-16 w-16 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">TraceHerb</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentStep}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Steps */}
          {steps.length > 0 && (
            <div className="space-y-2">
              {steps.map((step, index) => {
                const stepProgress = (index + 1) / steps.length * 100;
                const isCompleted = progress >= stepProgress;
                const isCurrent = progress >= (index / steps.length * 100) && progress < stepProgress;

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 text-sm ${
                      isCompleted ? 'text-green-600' : 
                      isCurrent ? 'text-primary' : 
                      'text-muted-foreground'
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      isCompleted ? 'bg-green-600' : 
                      isCurrent ? 'bg-primary' : 
                      'bg-muted-foreground'
                    }`} />
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;