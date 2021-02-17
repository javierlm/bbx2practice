export const setCurrentUser = (data) => ({
  type: "SET_CURRENT_USER",
  data,
});

export const getUsers = (data) => ({
  type: "GET_USERS",
  data,
});

export const newUserState = (data) => ({
  type: "NEW_USER",
  data,
});

export const setNewUserState = (data) => ({
  type: "SET_NEW_USER_ATTRIBUTE",
  data,
});

export const UserSelectedState = (data) => ({
  type: "USER_SELECTED",
  data,
});

export const UserSelectedAttribute = (data) => ({
  type: "SET_USER_SELECTED_ATTRIBUTE",
  data,
});

export const DeleteUser = (data) => ({
  type: "USER_DELETED",
  data,
});

export const newPasswordAdminRequest = (data) => ({
  type: "NEW_PASSWORD_CHANGE_ADMIN",
  data,
});

export const setNewPasswordAdminRequestAttribute = (data) => ({
  type: "SET_NEW_PASSWORD_CHANGE_ADMIN",
  data,
});
