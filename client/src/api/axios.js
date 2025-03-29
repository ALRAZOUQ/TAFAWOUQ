import axios from "axios";

const backendURL = import.meta.env.VITE_SERVER_URL;
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
    console.group(`Sending an axios request to [ %c${config?.url}%c ] .. 🟠 `, "color: lightblue;", "color:black")
    return config;
  },
  (error) => {
    document.getElementById("loadingSpinnerContainer")?.classList.add("hidden")
    console.error(`error from the axios interceptor!`)
    console.error(error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    document.getElementById("loadingSpinnerContainer")?.classList.add("hidden")
    console.log(`Received the axios response to [ %c${response?.config?.url}%c ] 🟢 `, "color: lightblue;", "color:black")
    console.groupEnd()

    return response;
  },
  (error) => {
    document.getElementById("loadingSpinnerContainer")?.classList.add("hidden")
    console.log(`%can error occured 'while' sending the request or 'after' reciving the response! the error data:`, 'color:red')
    console.table({ status: error.response?.status, ...error.response?.data })
    console.error(error)
    console.groupEnd()
    return Promise.reject(error);
  }
);


export default axiosInstance;
