import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AccessDenied from '../page/AccessDenied/AccessDenied';
import { authUtils } from '../utils/api';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const userData = authUtils.getUserData();
  
  if (!isAuthenticated || !userData) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole) {
    try {
      const userRole = userData.role || userData.user_type || 'user';
      
      if (userRole !== requiredRole) {
        return <AccessDenied />;
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  requiredRole: null,
};

export default ProtectedRoute;
