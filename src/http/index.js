import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

http.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('token');
  if(!accessToken) return config;

  config.headers['Authorization'] = `Bearer ${accessToken}`;
  return config;
});


http.interceptors.response.use(config => config, error => {
  if(error.response.status === 401) {
    localStorage.removeItem('token');
    window.location = '/login';
    window.location.reload();
  }

  return Promise.reject(error);
});


export default http;