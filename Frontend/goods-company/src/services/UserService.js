import {
  makeGetFetch,
  makePostFetch,
  makePutFetch,
  makeDeleteFetch,
} from "./makeFetch";

const UsersUrl = "http://localhost:8080/api/users";

const getAllUsers = () => {
  return makeGetFetch(UsersUrl);
};

const saveUserSelected = (itemSelected) => {
  return makePostFetch(UsersUrl + "/signup", itemSelected);
};

const saveEditedUserSelected = (itemSelected) => {
  return makePutFetch(UsersUrl + "/" + itemSelected.id, itemSelected);
};

const deleteUserSelected = (itemSelected) => {
  return makeDeleteFetch(UsersUrl + "/" + itemSelected.id);
};

const savePasswordChangeAdmin = (passwordChangeRequest, itemSelected) => {
  return makePutFetch(
    UsersUrl + "/" + itemSelected.id + "/changePasswordAdmin",
    passwordChangeRequest
  );
};

const savePasswordChangeNormal = (passwordChangeRequest) => {
  return makePutFetch(UsersUrl + "/changePassword", passwordChangeRequest);
};

export {
  getAllUsers,
  saveUserSelected,
  saveEditedUserSelected,
  deleteUserSelected,
  savePasswordChangeAdmin,
  savePasswordChangeNormal,
};
