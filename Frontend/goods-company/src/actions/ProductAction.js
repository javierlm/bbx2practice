export const getProducts = (data) => ({
  type: "GET_PRODUCTS",
  data,
});

export const newProductState = (data) => ({
  type: "NEW_PRODUCT",
  data,
});

export const setNewProductDiscount = (data) => ({
  type: "NEW_PRODUCT_DISCOUNT",
  data,
});

export const setNewProductDiscountAttribute = (data) => ({
  type: "NEW_PRODUCT_DISCOUNT_ATTRIBUTE",
  data,
});

export const setNewProductDiscountToProduct = (data) => ({
  type: "ASSIGN_NEW_PRODUCT_DISCOUNT",
  data,
});

//Actions para añadir descuentos al producto seleccionado
export const setSelectedProductDiscountToProduct = (data) => ({
  type: "ASSIGN_SELECTED_PRODUCT_DISCOUNT",
  data,
});

export const setNewProductState = (data) => ({
  type: "SET_NEW_PRODUCT_ATTRIBUTE",
  data,
});

export const setNewSavedProduct = (data) => ({
  type: "SET_NEW_SAVED_PRODUCT",
  data,
});

export const ProductSelectedState = (data) => ({
  type: "PRODUCT_SELECTED",
  data,
});

export const ProductSelectedAttribute = (data) => ({
  type: "SET_PRODUCT_SELECTED_ATTRIBUTE",
  data,
});

export const ProductStateChanged = (data) => ({
  type: "PRODUCT_STATE_CHANGED",
  data,
});

export const ProductStateChangedReason = (data) => ({
  type: "SET_REASON_CHANGE_STATE",
  data,
});

export const DeleteProduct = (data) => ({
  type: "PRODUCT_DELETED",
  data,
});

export const AddSupplierToNewProduct = (data) => ({
  type: "ADD_SUPPLIER_TO_PRODUCT",
  data,
});

export const RemoveSupplierToNewProduct = (data) => ({
  type: "REMOVE_SUPPLIER_TO_PRODUCT",
  data,
});

export const RemoveAllSuppliersFromNewProduct = (data) => ({
  type: "REMOVE_ALL_SUPPLIERS_FROM_NEW_PRODUCT",
  data,
});

export const AddSupplierToSelectedProduct = (data) => ({
  type: "ADD_SUPPLIER_TO_SELECTED_PRODUCT",
  data,
});

export const RemoveSupplierToSelectedProduct = (data) => ({
  type: "REMOVE_SUPPLIER_TO_SELECTED_PRODUCT",
  data,
});

export const RemoveAllSuppliersFromSelectedProduct = (data) => ({
  type: "REMOVE_ALL_SUPPLIERS_FROM_SELECTED_PRODUCT",
  data,
});
