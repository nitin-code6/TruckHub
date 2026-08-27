import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api", // backend base (matches backend dev port)
  withCredentials: true // IMPORTANT for cookies
});

export default instance;
