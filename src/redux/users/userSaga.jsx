import { call, put, takeLatest } from "redux-saga/effects";
import { fetchUsersApi } from "../../api/userApi";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "./userSlice";
import { message } from "antd";

function* handleFetchUsers(action) {
  try {
    const response = yield call(fetchUsersApi, action.payload);
    yield put(fetchUsersSuccess(response.data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
    message.error("Failed to fetch users!");
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
}
