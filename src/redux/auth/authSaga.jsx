import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "../../api/authApi";
import { loginRequest, loginSuccess, loginFailure } from "./authSlice";

function* handleLogin(action) {
  try {
    const response = yield call(loginApi, action.payload);
    yield put(loginSuccess(response.data.token));
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
