import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import ProductReducer from "../reducers/ProductReducer";
import SupplierReducer from "../reducers/SupplierReducer";
import UserReducer from "../reducers/UserReducer";
import CountryReducer from "../reducers/CountryReducer";

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const reducers = combineReducers({
  ProductReducer,
  SupplierReducer,
  UserReducer,
  CountryReducer
});

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);
