import axios from "axios";

const backendURL = import.meta.env.SERVER_URL;
const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});



axiosInstance.interceptors.request.use(
  (config) => {
    document.getElementById("loadingSpinnerContainer")?.classList.remove("hidden")
    console.log("Sending an axios request.. 🟠")
    return config;
  },
  (error) => {
    document.getElementById("loadingSpinnerContainer")?.classList.add("hidden")
    console.error(error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    document.getElementById("loadingSpinnerContainer")?.classList.add("hidden")
    console.log("received axios response 🟢")
    return response;
  },
  (error) => {
    document.getElementById("loadingSpinnerContainer")?.classList.add("hidden")
    console.error(error)

    return Promise.reject(error);
  }
);


export default axiosInstance;
