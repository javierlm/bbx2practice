const SupplierReducer = (
  state = { suppliers: [], newSupplier: {}, SelectedSupplier: {} },
  action
) => {
  switch (action.type) {
    case "GET_SUPPLIERS":
      return {
        ...state,
        suppliers: [...action.data],
      };
    case "SAVE_SUPPLIER":
      return {
        ...state,
        suppliers: [...state.suppliers, action.data],
      };
    case "NEW_SUPPLIER":
      return {
        ...state,
        suppliers: [...state.suppliers],
        newSupplier: action.data,
      };
    case "SET_NEW_SUPPLIER_ATTRIBUTE":
      return {
        ...state,
        newSupplier: { ...state.newSupplier, ...action.data },
      };
    case "SUPPLIER_SELECTED":
      return {
        ...state,
        SelectedSupplier: action.data,
      };
    case "SET_SUPPLIER_SELECTED_ATTRIBUTE":
      return {
        ...state,
        SelectedSupplier: { ...state.SelectedSupplier, ...action.data },
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
    case "SUPPLIER_DELETED":
      return {
        ...state,
      };
    case "ADD_PRODUCT_TO_NEW_SUPPLIER":
      return {
        ...state,
        newSupplier: {
          ...state.newSupplier,
          products: [...state.newSupplier.products, action.data],
        },
      };
    case "REMOVE_PRODUCT_TO_NEW_SUPPLIER":
      return {
        ...state,
        newSupplier: {
          ...state.newSupplier,
          products: state.newSupplier.products.filter(
            (product) => product !== action.data
          ),
        },
      };
    case "REMOVE_ALL_PRODUCTS_FROM_NEW_SUPPLIER":
      return {
        ...state,
        newSupplier: {
          ...state.newSupplier,
          products: [],
        },
      };
    case "ADD_PRODUCT_TO_SELECTED_SUPPLIER":
      return {
        ...state,
        SelectedSupplier: {
          ...state.SelectedSupplier,
          products: [...state.SelectedSupplier.products, action.data],
        },
      };
    case "REMOVE_PRODUCT_TO_SELECTED_SUPPLIER":
      return {
        ...state,
        SelectedSupplier: {
          ...state.SelectedSupplier,
          products: state.SelectedSupplier.products.filter(
            (product) => product !== action.data
          ),
        },
      };
      case "REMOVE_ALL_PRODUCTS_FROM_SELECTED_SUPPLIER":
        return {
          ...state,
          SelectedSupplier: {
            ...state.SelectedSupplier,
            products: [],
          },
      }
    default:
      return {
        ...state,
      };
  }
};

export default SupplierReducer;
