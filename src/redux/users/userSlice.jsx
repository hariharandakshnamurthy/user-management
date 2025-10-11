import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 6,
    total: 0,
  },
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = {
        current: action.payload.page,
        pageSize: action.payload.per_page,
        total: action.payload.total,
      };
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure } =
  userSlice.actions;

export default userSlice.reducer;
