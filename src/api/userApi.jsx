import axiosClient from "./axiosClient";

export const fetchUsersApi = (page = 1) => {
  return axiosClient.get(`/users`, { params: { page } });
};
export const createUserApi = (payload) => {
  return axiosClient.post(`/users`, payload);
};

export const updateUserApi = (payload) =>
  axiosClient.put(`/users/${payload.id}`, payload);

export const deleteUserApi = (id) =>
  axiosClient.delete(`/users/${id}`);
