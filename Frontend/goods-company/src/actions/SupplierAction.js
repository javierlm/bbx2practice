
export const getSuppliers = (data) => ({
    type: 'GET_SUPPLIERS',
    data
});

export const newSupplierState = (data) => ({
    type: 'NEW_SUPPLIER',
    data
});

export const setNewSupplierState = (data) => ({
    type: 'SET_NEW_SUPPLIER_ATTRIBUTE',
    data
});

export const setNewSavedSupplier = (data) => ({
    type: 'SET_NEW_SAVED_SUPPLIER',
    data
});

export const SupplierSelectedState = (data) => ({
    type: 'SUPPLIER_SELECTED',
    data
});

export const SupplierSelectedAttribute = (data) => ({
    type: 'SET_SUPPLIER_SELECTED_ATTRIBUTE',
    data
});

export const SupplierStateChanged = (data) => ({
    type: 'SUPPLIER_STATE_CHANGED',
    data
});

export const DeleteSupplier = (data) => ({
    type: 'SUPPLIER_DELETED',
    data
});

export const AddProductToNewSupplier = (data) => ({
    type: 'ADD_PRODUCT_TO_NEW_SUPPLIER',
    data
});

export const RemoveProductToNewSupplier = (data) => ({
    type: 'REMOVE_PRODUCT_TO_NEW_SUPPLIER',
    data
});

export const RemoveAllProductsFromNewSupplier = (data) => ({
    type: 'REMOVE_ALL_PRODUCTS_FROM_NEW_SUPPLIER',
    data
});

export const AddProductToSelectedSupplier = (data) => ({
    type: 'ADD_PRODUCT_TO_SELECTED_SUPPLIER',
    data
});

export const RemoveProductToSelectedSupplier = (data) => ({
    type: 'REMOVE_PRODUCT_TO_SELECTED_SUPPLIER',
    data
});

export const RemoveAllProductsFromSelectedSupplier = (data) => ({
    type: 'REMOVE_ALL_PRODUCTS_FROM_SELECTED_SUPPLIER',
    data
});

