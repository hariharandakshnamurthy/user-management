import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi, logoutApi } from "../../api/authApi";
import { loginRequest, loginSuccess, loginFailure, logout } from "./authSlice";

function* handleLogin(action) {
  try {
    const response = yield call(loginApi, action.payload);
    yield put(loginSuccess(response.data.token));
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || "Login Failed";
    yield put(loginFailure(message));
  }
}

function* handleLogout() {
  try {
    yield call(logoutApi);
    localStorage.removeItem("token");
  } catch (error) {
    yield put(logout(error));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
}
