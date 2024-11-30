import axios from "axios";

// will add authentication token to all appropriate requests later
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
