import axiosClient from "./axiosClient";

export const loginApi = (payload) =>
  axiosClient.post("https://reqres.in/api/login", payload);

export const logoutApi = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ message: "Logged out successfully" }), 500);
  });
