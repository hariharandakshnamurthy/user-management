import { call, put, select, takeLatest } from "redux-saga/effects";
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
    const createdUsers = JSON.parse(localStorage.getItem("createdUsers") || "[]");
    const deletedUserIds = JSON.parse(localStorage.getItem("deletedUserIds") || "[]");
    const currentPage = action.payload || 1;
    const pageSize = 6;

    const totalCreatedUsers = createdUsers.length;

    const startIndex = (currentPage - 1) * pageSize;
    const createdUsersOnThisPage = Math.max(0, Math.min(totalCreatedUsers - startIndex, pageSize));

    const firstApiIndexNeeded = Math.max(0, startIndex - totalCreatedUsers);
    const apiUsersNeeded = pageSize - createdUsersOnThisPage;

    const firstApiPage = Math.floor(firstApiIndexNeeded / pageSize) + 1;
    const lastApiPage = Math.floor((firstApiIndexNeeded + apiUsersNeeded - 1) / pageSize) + 1;

    let allApiData = [];
    for (let page = firstApiPage; page <= lastApiPage; page++) {
      const response = yield call(fetchUsersApi, page);
      allApiData.push(...response.data.data);

      if (page === firstApiPage) {
        var totalApiUsers = response.data.total;
      }
    }

    const filteredApiData = allApiData.filter(user => !deletedUserIds.includes(user.id));
    const grandTotal = totalCreatedUsers + totalApiUsers - deletedUserIds.length;

    let mergedData = [];

    if (createdUsersOnThisPage > 0) {
      const createdSlice = createdUsers.slice(startIndex, startIndex + createdUsersOnThisPage);
      mergedData.push(...createdSlice);
    }

    const offsetInFirstApiFetch = firstApiIndexNeeded % pageSize;
    const apiSlice = filteredApiData.slice(offsetInFirstApiFetch, offsetInFirstApiFetch + apiUsersNeeded);
    mergedData.push(...apiSlice);

    yield put(
      fetchUsersSuccess({
        data: mergedData,
        page: currentPage,
        per_page: pageSize,
        total: grandTotal,
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
    void message.success("User created successfully!");
  } catch (error) {
    yield put(createUserFailure(error.message));
    void message.error("Failed to create user!");
  }
}

function* handleUpdateUser(action) {
  try {
    const response = yield call(updateUserApi, action.payload);
    yield put(updateUserSuccess(response.data));
    void message.success("User updated successfully!");
  } catch (error) {
    yield put(updateUserFailure(error.message));
    void message.error("Failed to update user!");
  }
}

function* handleDeleteUser(action) {
  try {
    const userId = action.payload;

    const createdUsers = JSON.parse(localStorage.getItem("createdUsers") || "[]");
    const isCreatedUser = createdUsers.some(user => user.id === userId);

    if (isCreatedUser) {
      const updatedCreatedUsers = createdUsers.filter(user => user.id !== userId);
      localStorage.setItem("createdUsers", JSON.stringify(updatedCreatedUsers));
    } else {
      const deletedUserIds = JSON.parse(localStorage.getItem("deletedUserIds") || "[]");
      if (!deletedUserIds.includes(userId)) {
        deletedUserIds.push(userId);
        localStorage.setItem("deletedUserIds", JSON.stringify(deletedUserIds));
      }
      yield call(deleteUserApi, userId);
    }
    yield put(deleteUserSuccess(userId));

    const currentPage = yield select(state => state.users.pagination.current || 1);
    yield put(fetchUsersRequest(currentPage));

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
