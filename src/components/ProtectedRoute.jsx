import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AccessDenied from '../page/AccessDenied/AccessDenied';

const ProtectedRoute = ({ children, requiredRole }) => {
  const authTokens = localStorage.getItem('authTokens');
  const userData = localStorage.getItem('userData');
  
  if (!authTokens || !userData) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu có yêu cầu role cụ thể
  if (requiredRole) {
    try {
      const user = JSON.parse(userData);
      const userRole = user.role || user.user_type || 'user'; // Có thể là role hoặc user_type
      
      if (userRole !== requiredRole) {
        // Hiển thị trang Access Denied thay vì redirect
        return <AccessDenied />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
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
