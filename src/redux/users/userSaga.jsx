import { call, delay, put, takeLatest } from "redux-saga/effects";
import {
  fetchUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../api/userApi";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserSuccess,
  createUserFailure,
  createUserRequest,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} from "./userSlice";
import { message } from "antd";

function* handleFetchUsers(action) {
  try {
    const response = yield call(fetchUsersApi, action.payload);
    yield delay(400);

    const createdUsers = JSON.parse(localStorage.getItem("createdUsers") || "[]");

    const mergedData =
      action.payload === 1
        ? [...createdUsers, ...response.data.data]
        : response.data.data;

    const total =
      action.payload === 1
        ? response.data.total + createdUsers.length
        : response.data.total;

    yield put(
      fetchUsersSuccess({
        ...response.data,
        data: mergedData,
        total,
      })
    );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      yield put(fetchUsersFailure({ code: 404, message: "No users found" }));
    } else {
      yield put(fetchUsersFailure({ code: 500, message: error.message }));
      message.error("Failed to fetch users!");
    }
  }
}
function* handleCreateUser(action) {
  try {
    const response = yield call(createUserApi, action.payload);
    yield put(createUserSuccess(response.data));

    const existingUsers = JSON.parse(localStorage.getItem('createdUsers') || '[]');
    existingUsers.push(response.data);
    localStorage.setItem('createdUsers', JSON.stringify(existingUsers));
    message.success("User created successfully!");
  } catch (error) {
    yield put(createUserFailure(error.message));
    message.error("Failed to create user!");
  }
}

function* handleUpdateUser(action) {
  try {
    const response = yield call(updateUserApi, action.payload);
    yield put(updateUserSuccess(response.data));
    message.success("User updated successfully!");
  } catch (error) {
    yield put(updateUserFailure(error.message));
    message.error("Failed to update user!");
  }
}

function* handleDeleteUser(action) {
  try {
    yield call(deleteUserApi, action.payload);
    yield put(deleteUserSuccess(action.payload));
    message.success("User deleted successfully!");
  } catch (error) {
    yield put(deleteUserFailure(error.message));
    message.error("Failed to delete user!");
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
  yield takeLatest(createUserRequest.type, handleCreateUser);
  yield takeLatest(updateUserRequest.type, handleUpdateUser);
  yield takeLatest(deleteUserRequest.type, handleDeleteUser);
}
