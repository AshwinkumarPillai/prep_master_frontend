import httpClient from "./httpClient";

export const adminLogin = (payload) => httpClient.post("admin/login", payload);
export const login = (payload) => httpClient.post("user/login", payload);
export const register = (payload) => httpClient.post("user/register", payload);
export const authAdmin = (payload) => httpClient.post("admin/auth", payload);

// Test
export const fetchAllTests = () => httpClient.get("/test/fetchAllTests", {});
export const fetchTestDetails = (payload) => httpClient.post("/test/fetchTest", payload);
export const createTest = (payload) => httpClient.post("/test/add", payload);
export const deleteTest = (payload) => httpClient.post("/test/delete", payload);
