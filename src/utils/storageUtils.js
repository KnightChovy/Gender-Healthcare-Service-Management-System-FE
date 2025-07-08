export const storageUtils = {
  getJSON: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setJSON: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  getString: (key, defaultValue = null) => {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setString: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  isAvailable: () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};

export const dataUtils = {
  getAppointments: () => storageUtils.getJSON('appointments', []),
  getTestOrders: () => storageUtils.getJSON('testOrders', []),
  getNotifications: () => storageUtils.getJSON('notifications', []),
  getPrescriptions: () => storageUtils.getJSON('prescriptions', []),
  getRatings: () => storageUtils.getJSON('ratings', []),
  getBlogPosts: () => storageUtils.getJSON('blogPosts', []),
  getUserData: () => storageUtils.getJSON('userData', null),
  getAuthTokens: () => storageUtils.getJSON('authTokens', null),
  
  setAppointments: (data) => storageUtils.setJSON('appointments', data),
  setTestOrders: (data) => storageUtils.setJSON('testOrders', data),
  setNotifications: (data) => storageUtils.setJSON('notifications', data),
  setPrescriptions: (data) => storageUtils.setJSON('prescriptions', data),
  setRatings: (data) => storageUtils.setJSON('ratings', data),
  setBlogPosts: (data) => storageUtils.setJSON('blogPosts', data),
  setUserData: (data) => storageUtils.setJSON('userData', data),
  setAuthTokens: (data) => storageUtils.setJSON('authTokens', data)
};
