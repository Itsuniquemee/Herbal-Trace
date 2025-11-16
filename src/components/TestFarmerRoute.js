import React from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

const TestFarmerRoute = () => {
  const { user, profile, isAuthenticated } = useFirebaseAuth();

  return (
    <div className="p-8">
      <h1>🌾 Test Farmer Route - SUCCESS!</h1>
      <p>If you can see this page, the farmer routing is working correctly.</p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
        <h2>✅ Route Test Passed</h2>
        <p>You have successfully accessed the farmer crop upload route.</p>
        <p>This confirms that:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>User authentication is working</li>
          <li>Role-based access control is functioning</li>
          <li>React Router is properly configured</li>
          <li>The farmer role has the correct permissions</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
        <h2>🔍 Debug Information</h2>
        <p><strong>Current URL:</strong> {window.location.pathname}</p>
        <p><strong>Expected URL:</strong> /farmer/crop-upload</p>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User Email:</strong> {user?.email || 'Not found'}</p>
        <p><strong>User Role:</strong> {profile?.role || 'Not found'}</p>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <h2>🚀 Next Steps</h2>
        <p>If this test page loads successfully, we can replace it with the actual FarmerCropUpload component.</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TestFarmerRoute;