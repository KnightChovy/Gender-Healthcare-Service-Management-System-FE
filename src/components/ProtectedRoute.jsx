import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AccessDenied from '../page/AccessDenied/AccessDenied';
import { authUtils } from '../utils/api';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Use authUtils for consistent authentication check
  const isAuthenticated = authUtils.isAuthenticated();
  const userData = authUtils.getUserData();
  
  if (!isAuthenticated || !userData) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu có yêu cầu role cụ thể
  if (requiredRole) {
    try {
      const userRole = userData.role || userData.user_type || 'user'; // Có thể là role hoặc user_type
      
      if (userRole !== requiredRole) {
        // Hiển thị trang Access Denied thay vì redirect
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
