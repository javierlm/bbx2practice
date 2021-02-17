const ProductReducer = (state = { products: [], newProduct: {} }, action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        products: [...action.data],
      };
    case "SAVE_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.data],
      };
    case "NEW_PRODUCT":
      return {
        ...state,
        products: [...state.products],
        newProduct: action.data,
      };
    case "SET_NEW_PRODUCT_ATTRIBUTE":
      return {
        ...state,
        newProduct: { ...state.newProduct, ...action.data },
      };
    case "NEW_PRODUCT_DISCOUNT":
      return {
        ...state,
        newProductDiscount: { ...action.data },
      };
    case "NEW_PRODUCT_DISCOUNT_ATTRIBUTE":
      return {
        ...state,
        newProductDiscount: { ...state.newProductDiscount, ...action.data },
      };
    case "ASSIGN_NEW_PRODUCT_DISCOUNT":
      return {
        ...state,
        newProduct: {
          ...state.newProduct,
          priceReductionList: [action.data],
        },
      };
      case "ASSIGN_SELECTED_PRODUCT_DISCOUNT":
        return {
          ...state,
          SelectedProduct: {
            ...state.SelectedProduct,
            priceReductionList: [action.data],
          },
        };
    case "ADD_SUPPLIER_TO_PRODUCT":
      return {
        ...state,
        newProduct: {
          ...state.newProduct,
          suppliers: [...state.newProduct.suppliers, action.data],
        },
      };
    case "REMOVE_SUPPLIER_TO_PRODUCT":
      return {
        ...state,
        newProduct: {
          ...state.newProduct,
          suppliers: state.newProduct.suppliers.filter(
            (supplier) => supplier !== action.data
          ),
        },
      };
    case "REMOVE_ALL_SUPPLIERS_FROM_NEW_PRODUCT":
      return {
        ...state,
        newProduct: {
          ...state.newProduct,
          suppliers: [],
        },
      };
    case "ADD_SUPPLIER_TO_SELECTED_PRODUCT":
      return {
        ...state,
        SelectedProduct: {
          ...state.SelectedProduct,
          suppliers: [...state.SelectedProduct.suppliers, action.data],
        },
      };
    case "REMOVE_SUPPLIER_TO_SELECTED_PRODUCT":
      return {
        ...state,
        SelectedProduct: {
          ...state.SelectedProduct,
          suppliers: state.SelectedProduct.suppliers.filter(
            (supplier) => supplier !== action.data
          ),
        },
      };
    case "REMOVE_ALL_SUPPLIERS_FROM_SELECTED_PRODUCT":
      return {
        ...state,
        SelectedProduct: {
          ...state.SelectedProduct,
          suppliers: [],
        },
      };
    case "PRODUCT_SELECTED":
      return {
        ...state,
        products: [...state.products],
        SelectedProduct: action.data,
      };
    case "SET_PRODUCT_SELECTED_ATTRIBUTE":
      return {
        ...state,
        products: [...state.products],
        SelectedProduct: { ...state.SelectedProduct, ...action.data },
      };
    case "PRODUCT_STATE_CHANGED":
      return {
        ...state,
        productStateChanged: action.data,
      };
    case "SET_REASON_CHANGE_STATE":
      return {
        ...state,
        productStateChanged: { ...state.productStateChanged, ...action.data },
      };
    case "PRODUCT_DELETED":
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};

export default ProductReducer;
