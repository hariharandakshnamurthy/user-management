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
import {
  PAGE_SIZE,
  getStoredData,
  setStoredData,
  getCreatedUsersForPage,
  calculateApiPagination,
  calculateTotals,
  filterDeletedUsers,
  isUserCreated,
  generateUserId,
  shouldNavigateToPreviousPage,
} from "./Helpers.jsx";

function* fetchApiUsersData(firstApiPage, lastApiPage, deletedUserIds) {
  const allApiUsers = [];
  let apiMetadata = null;

  for (let page = firstApiPage; page <= lastApiPage; page++) {
    try {
      const response = yield call(fetchUsersApi, page);

      if (!apiMetadata) {
        apiMetadata = {
          total: response.data.total,
          total_pages: response.data.total_pages,
        };
      }

      const validUsers = filterDeletedUsers(response.data.data, deletedUserIds);
      allApiUsers.push(...validUsers);
    } catch (apiError) {
      console.warn(`Failed to fetch API page ${page}:`, apiError);
      break;
    }
  }

  return { allApiUsers, apiMetadata };
}

function* fetchApiMetadata() {
  try {
    const response = yield call(fetchUsersApi, 1);
    return {
      total: response.data.total,
      total_pages: response.data.total_pages,
    };
  } catch (apiError) {
    console.warn("Failed to fetch API metadata:", apiError);
    return { total: 0, total_pages: 0 };
  }
}

function* handleFetchUsers(action) {
  try {
    const createdUsers = getStoredData("createdUsers", []);
    const deletedUserIds = getStoredData("deletedUserIds", []);
    const currentPage = action.payload || 1;

    const totalCreatedUsers = createdUsers.length;
    let pageData = [];

    const createdUsersData = getCreatedUsersForPage(
      createdUsers,
      currentPage,
      PAGE_SIZE
    );
    pageData.push(...createdUsersData.users);

    const apiUsersNeeded = PAGE_SIZE - createdUsersData.count;

    let totalApiUsers = 0;

    if (apiUsersNeeded > 0) {
      const apiPagination = calculateApiPagination(
        currentPage,
        PAGE_SIZE,
        totalCreatedUsers,
        apiUsersNeeded
      );

      const { allApiUsers, apiMetadata } = yield fetchApiUsersData(
        apiPagination.firstApiPage,
        apiPagination.lastApiPage,
        deletedUserIds
      );

      if (apiMetadata) {
        totalApiUsers = apiMetadata.total;
      }

      const neededUsers = allApiUsers.slice(
        apiPagination.startOffset,
        apiPagination.startOffset + apiUsersNeeded
      );
      pageData.push(...neededUsers);
    } else {
      const metadata = yield fetchApiMetadata();
      totalApiUsers = metadata.total;
    }

    const { grandTotal, totalPages } = calculateTotals(
      totalCreatedUsers,
      totalApiUsers,
      deletedUserIds,
      PAGE_SIZE
    );

    yield put(
      fetchUsersSuccess({
        data: pageData,
        page: currentPage,
        per_page: PAGE_SIZE,
        total: grandTotal,
        total_pages: totalPages,
      })
    );
  } catch (error) {
    console.error("Error in handleFetchUsers:", error);
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
    const newUser = {
      ...response.data,
      id: response.data.id || generateUserId(),
      isCreated: true,
    };

    yield put(createUserSuccess(newUser));

    const existingUsers = getStoredData("createdUsers", []);
    existingUsers.unshift(newUser);
    setStoredData("createdUsers", existingUsers);

    message.success("User created successfully!");
    yield put(fetchUsersRequest(1));
  } catch (error) {
    yield put(createUserFailure(error.message));
    message.error("Failed to create user!");
  }
}

function* handleUpdateUser(action) {
  try {
    const { id, ...userData } = action.payload;
    const createdUsers = getStoredData("createdUsers", []);

    if (isUserCreated(id, createdUsers)) {
      const updatedUsers = createdUsers.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      );
      setStoredData("createdUsers", updatedUsers);
      yield put(updateUserSuccess({ id, ...userData }));
    } else {
      const response = yield call(updateUserApi, action.payload);
      yield put(updateUserSuccess(response.data));
    }

    message.success("User updated successfully!");

    const currentPage = yield select(
      (state) => state.users.pagination.current || 1
    );
    yield put(fetchUsersRequest(currentPage));
  } catch (error) {
    yield put(updateUserFailure(error.message));
    message.error("Failed to update user!");
  }
}

function* handleDeleteUser(action) {
  try {
    const userId = action.payload;
    const createdUsers = getStoredData("createdUsers", []);

    if (isUserCreated(userId, createdUsers)) {
      const updatedCreatedUsers = createdUsers.filter(
        (user) => user.id !== userId
      );
      setStoredData("createdUsers", updatedCreatedUsers);
    } else {
      const deletedUserIds = getStoredData("deletedUserIds", []);
      if (!deletedUserIds.includes(userId)) {
        deletedUserIds.push(userId);
        setStoredData("deletedUserIds", deletedUserIds);
      }

      try {
        yield call(deleteUserApi, userId);
      } catch (apiError) {
        console.warn(
          "API delete failed (user may not exist on server):",
          apiError
        );
      }
    }

    yield put(deleteUserSuccess(userId));
    message.success("User deleted successfully!");

    const currentPage = yield select(
      (state) => state.users.pagination.current || 1
    );
    const currentUsers = yield select((state) => state.users.data || []);

    const shouldGoToPreviousPage = shouldNavigateToPreviousPage(
      currentUsers.length,
      currentPage
    );

    if (shouldGoToPreviousPage) {
      yield put(fetchUsersRequest(currentPage - 1));
    } else {
      yield put(fetchUsersRequest(currentPage));
    }
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
