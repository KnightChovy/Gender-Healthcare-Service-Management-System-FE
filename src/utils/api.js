// API configuration and utility functions
const API_BASE_URL = 'http://52.4.72.106:3000/v1';

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REGISTER: `${API_BASE_URL}/users`,
};

// Common API request handler
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        status: error.status || 500,
      },
    };
  }
};

// Login API call
export const loginUser = async (credentials) => {
  return await apiRequest(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Register API call
export const registerUser = async (userData) => {
  return await apiRequest(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Logout API call
export const logoutUser = async () => {
  const token = authUtils.getToken();
  return await apiRequest(API_ENDPOINTS.LOGOUT, {
    method: 'POST',
    headers: {
      'x-access-token': token,
    },
  });
};

// Auth token management
export const authUtils = {
  setToken: (token) => {
    // Consistent with what's used throughout the app
    const tokenData = {
      accessToken: token,
      refreshToken: ''
    };
    localStorage.setItem('authTokens', JSON.stringify(tokenData));
    // Also set the single token for backward compatibility
    localStorage.setItem('authToken', token);
  },
  
  getToken: () => {
    // Try to get from authTokens first, then fallback to authToken
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
      try {
        const parsed = JSON.parse(authTokens);
        return parsed.accessToken;
      } catch (error) {
        console.error('Error parsing authTokens:', error);
      }
    }
    return localStorage.getItem('authToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokens');
  },
  
  setUserData: (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },
  
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  
  removeUserData: () => {
    localStorage.removeItem('userData');
  },
  
  setUserType: (userType) => {
    localStorage.setItem('userType', userType);
  },
  
  getUserType: () => {
    return localStorage.getItem('userType');
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokens');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    // Also clear other related data
    localStorage.removeItem('notifications');
    localStorage.removeItem('appointments');
    localStorage.removeItem('testOrders');
    localStorage.removeItem('prescriptions');
    localStorage.removeItem('menstrualCycleData');
    localStorage.removeItem('scheduledEmails');
  },
  
  isAuthenticated: () => {
    const authTokens = localStorage.getItem('authTokens');
    const authToken = localStorage.getItem('authToken');
    return !!(authTokens || authToken);
  },
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  authUtils,
};
