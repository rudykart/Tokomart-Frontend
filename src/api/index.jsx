import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Api = axios.create({
  //set default endpoint API
  // baseURL: 'http://localhost:8080'
  // baseURL: 'https://localhost:7129/api'
  baseURL: "http://localhost:5053/api",
  // baseURL: "http://localhost:5053",
});

// Tambahkan interceptor untuk menyisipkan token ke header
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Tambahkan Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  // setIsLoggedIn(false);
  // setRole(null);
  navigate("/login"); // Redirect ke halaman login setelah logout
  window.location.href = "/login";
};

Api.interceptors.response.use(
  (response) => {
    console.log("isi status"+response.status)
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default Api;
