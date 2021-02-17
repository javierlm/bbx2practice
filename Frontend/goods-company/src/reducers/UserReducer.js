const UserReducer = (
  state = {
    users: [],
    newUser: {},
    SelectedUser: {},
    loggedUser: {},
    passWordChangeAdminRequest: {},
  },
  action
) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        loggedUser: [...action.data],
      };
    case "GET_USERS":
      return {
        ...state,
        users: [...action.data],
      };
    case "SAVE_USER":
      return {
        ...state,
        users: [...state.users, action.data],
      };
    case "NEW_USER":
      return {
        ...state,
        newUser: action.data,
      };
    case "SET_NEW_USER_ATTRIBUTE":
      return {
        ...state,
        newUser: { ...state.newUser, ...action.data },
      };
    case "USER_SELECTED":
      return {
        ...state,
        SelectedUser: action.data,
      };
    case "SET_USER_SELECTED_ATTRIBUTE":
      return {
        ...state,
        SelectedUser: { ...state.SelectedUser, ...action.data },
      };
    case "NEW_PASSWORD_CHANGE_ADMIN":
      return {
        ...state,
        passWordChangeAdminRequest: action.data,
      };
    case "SET_NEW_PASSWORD_CHANGE_ADMIN":
      return {
        ...state,
        passWordChangeAdminRequest: { ...state.passWordChangeAdminRequest, ...action.data },
      };
    case "USER_DELETED":
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};

export default UserReducer;
