import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoleBasedRedirect = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      console.log('🎯 RoleBasedRedirect: Redirecting user with role:', user.role);
      
      // Role-based redirection after login
      switch(user.role) {
        case 'admin':
          console.log('📍 Redirecting admin to pending approvals');
          navigate('/app/admin/pending-approvals', { replace: true });
          break;
        case 'farmer':
          console.log('🌱 Redirecting farmer to farmer page');
          navigate('/app/farmer/crop-upload', { replace: true });
          break;
        case 'processor':
          console.log('⚙️ Redirecting processor to receive batches');
          navigate('/app/processor/receive-batches', { replace: true });
          break;
        case 'consumer':
          console.log('🛒 Redirecting consumer to portal');
          navigate('/app/consumer-portal', { replace: true });
          break;
        case 'regulator':
          console.log('🏛️ Redirecting regulator to analytics');
          navigate('/app/analytics', { replace: true });
          break;
        default:
          console.log('📊 Redirecting to main dashboard');
          navigate('/app/main-dashboard', { replace: true });
      }
    } else {
      console.log('⚠️ RoleBasedRedirect: No user or role found:', user);
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything visible
};

RoleBasedRedirect.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string
  })
};

export default RoleBasedRedirect;