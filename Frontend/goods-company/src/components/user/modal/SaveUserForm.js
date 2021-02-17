
import {
  TextValidator,
  ValidatorForm,
} from "react-material-ui-form-validator";

import {
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useStyles from "../../../styles/FormMaterialStyles";
import {
  getUsers,
  newUserState,
  setNewUserState,
} from "../../../actions/UserAction";
import { getAllUsers, saveUserSelected } from "../../../services/UserService";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

const rolesObject = [
  {
    value: "VIEWER",
    label: "SOLO LECTURA",
  },
  {
    value: "NORMAL",
    label: "USUARIO NORMAL",
  },
  {
    value: "ADMIN",
    label: "ADMINISTRADOR",
  },
];

const SaveUserForm = (props) => {
  const classes = useStyles();
  const newUser = useSelector((state) => state.UserReducer.newUser);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [repeatedPassword, setRepeatedPassword] = useState('');

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

  const handleRole = (e) => {
    const { value } = e.target;
    dispatch(
      setNewUserState({
        roles: [value],
      })
    );
  };

  //Hooks
  useEffect(() => {
    dispatch(
      newUserState({
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        roles: ["VIEWER"],
      })
    );
  }, [dispatch]);

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    dispatch(
      setNewUserState({
        [name]: value,
      })
    );
  };

  ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
    if (value !== newUser.password) {
        return false;
    }
    return true;
});

  const saveItem = async (event) => {
    event.preventDefault();
    saveUserSelected(newUser).then(async (response) => {
      getAllUsers().then(async (response) => {
        dispatch(getUsers(await response.json()));
        props.onClose();
      });
    });
  };

  const handleSubmit = (event) => {
    saveItem(event);
  };

  const handleErrors = (event) => {
    setAlertMessage("Hay errores en el formulario. Por favor, revíselo");
    setOpenAlertError(true);
}

  const handleChange = (event) => {
    setRepeatedPassword(event.target.value);
}

  return (
    <div className={classes.modal}>
      <h3>Añadir nuevo usuario</h3>
      <ValidatorForm
        onSubmit={event => handleSubmit(event)}
        instantValidate
        onError={(errors) => handleErrors(errors)}
      >
        <TextValidator
          name="name"
          className={classes.inputMaterial}
          label="Nombre"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          autoFocus
          value={newUser.name}
          onChange={handleChangeNew}
        />
        <br />
        <TextValidator
          className={classes.inputMaterial}
          name="surname"
          label="Apellido"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          value={newUser.surname}
          onChange={handleChangeNew}
        />
        <br />
        <TextValidator
          className={classes.inputMaterial}
          name="username"
          label="Nombre de usuario"
          value={newUser.username}
          validators={['required']}
          errorMessages={["Campo requerido"]}
          onChange={handleChangeNew}
        />
        <TextValidator
          label="Email"
          onChange={handleChangeNew}
          name="email"
          value={newUser.email}
          validators={["required", "isEmail"]}
          errorMessages={["Campo requerido", "El correo no es válido"]}
        />
        <TextValidator
          label="Contraseña"
          onChange={handleChangeNew}
          name="password"
          type={showPassword ? "text" : "password"}
          validators={["required"]}
          errorMessages={["Campo requerido"]}
          value={newUser.password}
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
            )
          }}
        />
        <TextValidator
          label="Repetir contraseña"
          onChange={handleChange}
          name="repeatPassword"
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
            )
          }}
        />
        <br />
        <InputLabel id="demo-simple-select-required-label">Rol</InputLabel>
        <Select
          labelId="select-role"
          id="select-role-required"
          name="role"
          defaultValue={"VIEWER"}
          onChange={handleRole}
          value={newUser.role || "VIEWER"}
          className={classes.inputMaterial}
        >
          {rolesObject.map((value) => (
            <MenuItem value={value.value} key={value.label}>
              {value.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Requerido</FormHelperText>
        <br />
        <div align="right">
          <Button color="primary" type="submit">
            Guardar
          </Button>
          <Button onClick={props.onClose} color="secondary">
            Cancelar
          </Button>
        </div>
      </ValidatorForm>
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
    </div>
  );
};

export default SaveUserForm;
