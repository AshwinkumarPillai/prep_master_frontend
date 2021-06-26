import httpClient from "./httpClient";

// User and Admin
export const adminLogin = (payload) => httpClient.post("admin/login", payload);
export const login = (payload) => httpClient.post("user/login", payload);
export const register = (payload) => httpClient.post("user/register", payload);
export const authAdmin = (payload) => httpClient.post("admin/auth", payload);

// Test
export const fetchAllTests = () => httpClient.get("/test/fetchAllTests", {});
export const fetchTestDetails = (payload) => httpClient.get(`/test/fetchTest?q=${payload}`);
export const fetchFullTestDetails = (payload) => httpClient.get(`/test/fetchFullTest?q=${payload}`);
export const createTest = (payload) => httpClient.post("/test/add", payload);
export const updateTest = (payload) => httpClient.post("/test/update", payload);
export const deleteTest = (payload) => httpClient.post("/test/delete", payload);

// Question
export const addQuestion = (payload) => httpClient.post("/question/add", payload);
export const updateQuestion = (payload) => httpClient.post("/question/update", payload);
export const searchQuestion = (payload) => httpClient.get(`/question/search?q=${payload}`);

// User Test Histroy
export const saveUserTestHistory = (payload) => httpClient.post("user/saveUserTestHistory", payload);
export const fetchUserTestHistroy = (payload) => httpClient.post("user/fetchUserTestHistroy", payload);
export const fetchAllUserTestHistory = (payload) => httpClient.post("user/fetchAllUserTestHistory", payload);
export const fetchUserHistory = () => httpClient.get("user/fetchUserHistroy");
