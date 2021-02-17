import {
  makeGetFetch,
  makePostFetch,
  makePutFetch,
  makeDeleteFetch,
} from "./makeFetch";

const ProductsUrl = "http://localhost:8080/api/products";

const getAllProducts = () => {
  return makeGetFetch(ProductsUrl);
};

const saveItemSelected = (itemSelected) => {
  return makePostFetch(ProductsUrl, itemSelected);
};

const saveEditedItemSelected = (itemSelected) => {
  return makePutFetch(ProductsUrl + "/" + itemSelected.code, itemSelected);
};

const deleteItemSelected = (itemSelected) => {
  return makeDeleteFetch(ProductsUrl + "/" + itemSelected.code);
};

const changeStateProduct = (itemSelected) => {
  return makePostFetch(
    ProductsUrl + "/" + itemSelected.code + "/deactivate",
    itemSelected
  );
};

export {
  getAllProducts,
  saveItemSelected,
  saveEditedItemSelected,
  deleteItemSelected,
  changeStateProduct,
};
