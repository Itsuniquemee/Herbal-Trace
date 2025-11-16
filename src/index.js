import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import ErrorFallback from './components/ErrorFallback';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Create a theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c7744', // Ayurvedic green
      light: '#5a9c6b',
      dark: '#1f5130',
    },
    secondary: {
      main: '#5a3f37', // Earth brown
      light: '#8a6d65',
      dark: '#3e2c25',
    },
    background: {
      default: '#f5f7f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Error logging function
const logError = (error, errorInfo) => {
  // In production, this would send to error reporting service
  console.error('Application error:', error, errorInfo);
  
  // You can integrate with error reporting services here:
  // - Sentry.captureException(error, { extra: errorInfo });
  // - LogRocket.captureException(error);
};

// Performance monitoring
const sendToAnalytics = ({ id, name, value }) => {
  // In production, this would send to analytics service
  console.log('Web Vitals:', { id, name, value });
  
  // Example integration:
  // window.gtag('event', name, {
  //   event_category: 'Web Vitals',
  //   value: Math.round(name === 'CLS' ? value * 1000 : value),
  //   event_label: id,
  //   non_interaction: true,
  // });
};

// Root component with all providers
const Root = () => (
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <React.Suspense fallback={<LoadingScreen />}>
            <App />
          </React.Suspense>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found. Please check your index.html file.');
}

// Create root and render app
const root = ReactDOM.createRoot(container);

root.render(<Root />);

// Register service worker for PWA capabilities
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event) => {
        if (event.target.state === 'activated') {
          // Show update available notification to user
          if (window.confirm('A new version is available. Would you like to update?')) {
            window.location.reload();
          }
        }
      });
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});

// Measure performance in the app
reportWebVitals(sendToAnalytics);

// Hot Module Replacement (HMR) for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    // Unmount and remount the app to ensure proper state
    root.unmount();
    root.render(<Root />);
  });
}