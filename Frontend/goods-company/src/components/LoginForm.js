import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Cookie from "js-cookie";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import loginUser from "../services/LoginService";
import { Ability, AbilityBuilder } from "@casl/ability";
import { AbilityContext } from "../permissions/Can";
import useStyles from "../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../actions/UserAction";
import { Alert } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const LoginForm = () => {
  const history = useHistory();
  const classes = useStyles();

  const loggedUser = useSelector((state) => state.UserReducer.loggedUser);

  const dispatch = useDispatch();

  const ability = useContext(AbilityContext);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChangeLoginData = (prop) => (event) => {
    setLoginData({ ...loginData, [prop]: event.target.value });
  };

  function updateAbility(ability) {
    const { can, rules } = new AbilityBuilder(Ability);

    const token = Cookie.get("token");

    if (token !== undefined) {
      let jwtData = token.split(".")[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);

      let userRole = decodedJwtData.role;

      switch (userRole) {
        case "ADMIN":
          can("USER_MANAGEMENT", "users");
          can("create", "all");
          can("edit", "all");
          can("delete", "all");
          can("read", "all");
          break;
        case "NORMAL":
          can("create", "all");
          can("edit", "all");
          can("read", "all");
          break;
        default:
          can("read", "all");
          break;
      }
      ability.update(rules);
    }
  }

  const [openLoginSuccess, setOpenLoginSuccess] = React.useState(false);
  const [openLoginError, setOpenLoginError] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState("");

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenLoginSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenLoginError(false);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    loginUser(loginData)
      .then(async (response) => {
        if (response.status === 200) {
          let tokenResponse = await response.json();
          Cookie.set("token", tokenResponse.token);
          Cookie.set("name", loginData.username);
          dispatch(setCurrentUser(loginData.username));
          updateAbility(ability);
          setOpenLoginSuccess(true);
          setTimeout(() => {
            history.push("/products");
          }, 2000);
        } else if (response.status === 403) {
          setErrorMessage("Las credenciales proporcionadas no son válidas");
          setOpenLoginError(true);
        } else {
          setErrorMessage(
            "Ha ocurrido un error inesperado. Comuníquelo a un administrador del servidor"
          );
          setOpenLoginError(true);
        }
      })
      .catch((error) => {
        setErrorMessage("Error de comunicación con el servidor:" + error);
        setOpenLoginError(true);
      });
  }

  return (
    <div className={classes.loginForm}>
      <h1>Iniciar Sesión</h1>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            className={classes.loginInput}
            autoFocus
            variant="outlined"
            margin="normal"
            required
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            onChange={handleChangeLoginData("username")}
          />
        </div>
        <div>
          <TextField
            className={classes.loginInput}
            variant="outlined"
            margin="normal"
            required
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            onChange={handleChangeLoginData("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          className={classes.marginButton}
          margin="normal"
          type="submit"
          variant="contained"
          color="primary"
        >
          Iniciar sesión
        </Button>
      </form>
      <Snackbar
        open={openLoginSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Te has logueado correctamente
        </Alert>
      </Snackbar>
      <Snackbar
        open={openLoginError}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {ErrorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;
