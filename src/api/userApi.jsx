import axiosClient from "./axiosClient";

export const fetchUsersApi = (page = 1) => {
  return axiosClient.get(`/users`, { params: { page } });
};
