import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import { AbilityContext } from "./permissions/Can";
import { Ability } from "@casl/ability";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { esES } from '@material-ui/core/locale';

const ability = new Ability();

const theme = createMuiTheme({
  palette: {
  },
}, esES);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
    <AbilityContext.Provider value={ability}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AbilityContext.Provider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
