import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import {
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import useStyles from "../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";
import { savePasswordChangeNormal } from "../services/UserService";
import {
  newPasswordAdminRequest,
  setNewPasswordAdminRequestAttribute,
} from "../actions/UserAction";

const ChangePasswordForm = (props) => {
  const classes = useStyles();

  const passWordChangeAdminRequest = useSelector(
    (state) => state.UserReducer.passWordChangeAdminRequest
  );
  const SelectedUser = useSelector((state) => state.UserReducer.SelectedUser);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [openAlertSuccess, setOpenAlertSuccess] = React.useState(false);
  const [openAlertError, setOpenAlertError] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlertSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlertError(false);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const saveItem = async (event) => {
    event.preventDefault();
    savePasswordChangeNormal(passWordChangeAdminRequest).then(
      async (response) => {
        if (response.status === 204) {
          props.onClose();
        }
        else if(response.status === 401){
          setAlertMessage("Su contraseña actual no es válida. Por favor, introduzca la contraseña correctamente");
          setOpenAlertError(true);
        }
      }
    );
  };

  ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
    if (value !== passWordChangeAdminRequest.newPassword) {
        return false;
    }
    return true;
});

  const handleSubmit = (event) => {
    saveItem(event);
  };

  const handleErrors = (event) => {
    setAlertMessage("Hay errores en el formulario. Por favor, revíselo");
    setOpenAlertError(true);
  };

  const handleChange = (event) => {
    setRepeatedPassword(event.target.value);
  };

  //Hooks
  useEffect(() => {
    dispatch(
      newPasswordAdminRequest({
        newPassword: "",
        oldPassword: ""
      })
    );
  }, [dispatch]);

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    dispatch(
      setNewPasswordAdminRequestAttribute({
        [name]: value,
      })
    );
  };

  return (
    <div className={classes.modal}>
      <h3>Cambio de contraseña</h3>
      <ValidatorForm
        onSubmit={(event) => handleSubmit(event)}
        instantValidate
        onError={(errors) => handleErrors(errors)}
      >
        <br />
        <TextValidator
          label="Contraseña actual"
          onChange={handleChangeNew}
          className={classes.inputMaterial}
          name="oldPassword"
          type={showPassword ? "text" : "password"}
          validators={["required"]}
          errorMessages={["Campo requerido"]}
          value={passWordChangeAdminRequest.oldPassword}
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
        <br />
        <TextValidator
          label="Nueva Contraseña"
          onChange={handleChangeNew}
          className={classes.inputMaterial}
          name="newPassword"
          type={showPassword ? "text" : "password"}
          validators={["required"]}
          errorMessages={["Campo requerido"]}
          value={passWordChangeAdminRequest.newPassword}
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
        <TextValidator
          label="Repetir nueva contraseña"
          onChange={handleChange}
          name="repeatPassword"
          className={classes.inputMaterial}
          type={showPassword ? "text" : "password"}
          validators={["isPasswordMatch", "required"]}
          errorMessages={["La contraseña no coincide", "Campo requerido"]}
          value={repeatedPassword}
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
        <br />
        <br />
        <div align="right">
          <Button color="primary" type="submit">
            Aceptar
          </Button>
          <Button onClick={props.onClose} color="secondary" >
            Cancelar
          </Button>
        </div>
        <Snackbar
          open={openAlertSuccess}
          autoHideDuration={2000}
          onClose={handleCloseSuccess}
        >
          <Alert onClose={handleCloseSuccess} severity="success">
            {alertMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openAlertError}
          autoHideDuration={2000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error">
            {alertMessage}
          </Alert>
        </Snackbar>
      </ValidatorForm>
    </div>
  );
};

ChangePasswordForm.propTypes = {
  onClick: PropTypes.func,
};

export default ChangePasswordForm;
