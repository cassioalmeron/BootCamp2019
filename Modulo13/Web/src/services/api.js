import axios from "axios";

const api = axios.create({
  baseURL: "Http://localhost:3333"
});

export default api;
