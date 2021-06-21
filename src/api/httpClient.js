import axios from "axios";

const baseURL = process.env.REACT_APP_URL || "http://localhost:3200/";

const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

const authInterceptor = (request) => {
  request.headers["x-auth"] = localStorage.getItem("token");
  return request;
};

httpClient.interceptors.request.use(authInterceptor);

export default httpClient;
