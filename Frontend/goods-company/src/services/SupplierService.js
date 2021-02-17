import {
  makeGetFetch,
  makePostFetch,
  makePutFetch,
  makeDeleteFetch,
} from "./makeFetch";

const suppliersUrl = "http://localhost:8080/api/suppliers";

const getAllSuppliers = () => {
  return makeGetFetch(suppliersUrl);
};

const saveItemSelected = (itemSelected) => {
  return makePostFetch(suppliersUrl, itemSelected);
};

const saveEditedItemSelected = (itemSelected) => {
  return makePutFetch(suppliersUrl + "/" + itemSelected.id, itemSelected);
};

const deleteItemSelected = (itemSelected) => {
  return makeDeleteFetch(suppliersUrl + "/" + itemSelected.id);
};

export {
  getAllSuppliers,
  saveItemSelected,
  saveEditedItemSelected,
  deleteItemSelected,
};
