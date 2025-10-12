import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.jsx";
import userReducer from "../redux/users/userSlice.jsx";

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
});

export default rootReducer;
