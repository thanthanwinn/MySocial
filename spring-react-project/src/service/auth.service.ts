// auth.service.ts
import axios from "axios";
import { LoginDto, RegisterDto } from "../ds/dto";

export const AUTH_URL = "http://localhost:8080/api/auth";

export const setToken = (token: string) => {
  console.log("set token " + token);
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getToken = () => localStorage.getItem('token');

export const getUserId = () => localStorage.getItem('loginUserId');

export const setLoggedInUserName = (username: string) => localStorage.setItem('loggedInUserName', username);
export const getLoggedInUserName = () => localStorage.getItem('loggedInUserName');

export const setUserId = (id: number) => localStorage.setItem('loginUserId', id.toString()); // Updated to match getUserId

export const logoutUser = () => {
  localStorage.clear();
  sessionStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
  window.location.href = "/login";
  window.location.reload();
};

export const isLoggedIn = () => !!getToken();

export const setLoggedInUserRole = (role: string) => sessionStorage.setItem('loggedInUserRole', role);
export const getLoggedInUserRole = () => sessionStorage.getItem('loggedInUserRole');

export const isAdmin = () => {
  const role = getLoggedInUserRole();
  return role?.trim() === 'ROLE_ADMIN';
};

export const loginApiCall = (testDto: LoginDto) => axios.post(`${AUTH_URL}/login`, testDto);

export const registerApiCall = (registerDto: RegisterDto) => {
  console.log("Sending register request with:", registerDto); // Debug log
  return axios.post(`${AUTH_URL}/register`, registerDto, {
    headers: {
      "Content-Type": "application/json", // Ensure this matches backend expectation
    },
  });
};