import axios from "axios";

const API = axios.create({
  baseURL: "https://tapp-9b1w.onrender.com/api"
});

export default API;
