export const PAGE_SIZE = 6;

export const getStoredData = (key, defaultValue = []) => {
  try {
    return JSON.parse(
      localStorage.getItem(key) || JSON.stringify(defaultValue)
    );
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const calculatePaginationIndices = (
  currentPage,
  totalItems,
  pageSize
) => {
  const totalItemsBeforePage = (currentPage - 1) * pageSize;
  const startIdx = Math.min(totalItemsBeforePage, totalItems);
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const itemsOnPage = endIdx - startIdx;

  return {
    startIdx,
    endIdx,
    itemsOnPage,
    totalItemsBeforePage,
  };
};

export const getCreatedUsersForPage = (createdUsers, currentPage, pageSize) => {
  const { startIdx, endIdx, itemsOnPage } = calculatePaginationIndices(
    currentPage,
    createdUsers.length,
    pageSize
  );

  if (itemsOnPage > 0) {
    return {
      users: createdUsers.slice(startIdx, endIdx),
      count: itemsOnPage,
    };
  }

  return {
    users: [],
    count: 0,
  };
};

export const calculateApiPagination = (
  currentPage,
  pageSize,
  totalCreatedUsers,
  apiUsersNeeded
) => {
  const totalItemsBeforePage = (currentPage - 1) * pageSize;
  const apiItemsBeforePage = Math.max(
    0,
    totalItemsBeforePage - totalCreatedUsers
  );
  const apiStartIndex = apiItemsBeforePage;
  const apiEndIndex = apiStartIndex + apiUsersNeeded;

  return {
    firstApiPage: Math.floor(apiStartIndex / pageSize) + 1,
    lastApiPage: Math.ceil(apiEndIndex / pageSize),
    startOffset: apiStartIndex % pageSize,
    apiStartIndex,
    apiEndIndex,
  };
};

export const calculateTotals = (
  totalCreatedUsers,
  totalApiUsers,
  deletedUserIds,
  pageSize
) => {
  const activeApiUsers =
    totalApiUsers -
    deletedUserIds.filter((id) => typeof id === "number").length;
  const grandTotal = totalCreatedUsers + activeApiUsers;
  const totalPages = Math.ceil(grandTotal / pageSize);

  return { grandTotal, totalPages };
};

export const filterDeletedUsers = (users, deletedUserIds) => {
  return users.filter((user) => !deletedUserIds.includes(user.id));
};

export const isUserCreated = (userId, createdUsers) => {
  return createdUsers.some((user) => user.id === userId);
};

export const generateUserId = () => {
  return `created_${Date.now()}`;
};

export const shouldNavigateToPreviousPage = (
  currentUsersLength,
  currentPage
) => {
  return currentUsersLength === 1 && currentPage > 1;
};
