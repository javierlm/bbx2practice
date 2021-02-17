import React from "react";
import LoginForm from "./components/LoginForm";
import "./App.css";
import { Route, Switch } from "react-router-dom";

import { UpdateAbility } from "./permissions/DefineAbilities";
import ErrorPage from "./components/ErrorPage";
import TopNavBar from "./components/TopNavBar";
import ProductsList from "./components/product/ProductsList";
import SuppliersList from "./components/supplier/SuppliersList";
import UsersList from "./components/user/UsersList";

const App = () => {
  UpdateAbility();

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={LoginForm} exact />
        <div>
          <TopNavBar />
          <Route path="/products" component={ProductsList} exact />
          <Route path="/suppliers" component={SuppliersList} exact />
          <Route path="/users" component={UsersList} exact />
          {/* <Route path="^((?!(products|suppliers|users)).)*$" component={ ErrorPage } exact /> */}
        </div>
      </Switch>
    </div>
  );
};

export default App;
