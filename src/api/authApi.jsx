import axiosClient from "./axiosClient";
export const loginApi = (payload) => axiosClient.post("/login", payload);
