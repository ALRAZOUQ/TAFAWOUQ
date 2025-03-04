import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    document.getElementById("loadingSpinnerContainer").classList.toggle("hidden")
    return config;
  },
  (error) => {
    document.getElementById("loadingSpinnerContainer").classList.toggle("hidden")
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    document.getElementById("loadingSpinnerContainer").classList.toggle("hidden")
    return response;
  },
  (error) => {
    document.getElementById("loadingSpinnerContainer").classList.toggle("hidden")
    return Promise.reject(error);
  }
);

export default axiosInstance;