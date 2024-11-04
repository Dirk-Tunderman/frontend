import axios from 'axios';

const getBackendPort = async () => {
  console.log('Attempting to fetch backend port');
  try {
    const response = await axios.get('/api/port');
    console.log('Received port from backend:', response.data.port);
    return response.data.port;
  } catch (error) {
    console.error('Failed to fetch backend port:', error);
    console.log('Falling back to default port 8082');
    return 8082; // fallback to default port
  }
};

const createAxiosInstance = async () => {
  console.log('Creating axios instance');
  const port = await getBackendPort();
  console.log(`Using backend port: ${port}`);
  
  const instance = axios.create({
    baseURL: `/api`,  // This will use the proxy set up in vite.config.js
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor for logging
  instance.interceptors.request.use(function (config) {
    console.log('Making request:', config.method.toUpperCase(), config.url);
    return config;
  }, function (error) {
    console.error('Request error:', error);
    return Promise.reject(error);
  });

  // Add response interceptor for logging
  instance.interceptors.response.use(function (response) {
    console.log('Received response:', response.status, response.config.url);
    return response;
  }, function (error) {
    console.error('Response error:', error);
    return Promise.reject(error);
  });

  console.log('Axios instance created successfully');
  return instance;
};

export default createAxiosInstance;