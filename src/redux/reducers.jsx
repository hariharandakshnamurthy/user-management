import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice.jsx";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

export default rootReducer;
