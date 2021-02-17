import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import useStyles from "../../../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";

import { getUsers, UserSelectedAttribute } from "../../../actions/UserAction";
import {
  getAllUsers,
  saveEditedUserSelected,
} from "../../../services/UserService";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
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

const EditSupplierForm = (props) => {
  const classes = useStyles();
  const SelectedUser = useSelector((state) => state.UserReducer.SelectedUser);
  const dispatch = useDispatch();

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

  //HANDLES
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      UserSelectedAttribute({
        [name]: value,
      })
    );
  };

  const handleRole = (e) => {
    const { value } = e.target;
    dispatch(
      UserSelectedAttribute({
        roles: [value],
      })
    );
  };

  const updateItem = async () => {
    saveEditedUserSelected(SelectedUser).then(async (response) => {
      getAllUsers().then(async (response) => {
        dispatch(getUsers(await response.json()));
      });
      props.onClose();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateItem();
  };

  const handleErrors = (event) => {
    setAlertMessage("Hay errores en el formulario. Por favor, revíselo");
    setOpenAlertError(true);
}

  return (
    <div className={classes.modal}>
      <h3>Editar Usuario</h3>
      <ValidatorForm
        onSubmit={(event) => handleSubmit(event)}
        instantValidate
        onError={(errors) => handleErrors(errors)}
      >
        <TextValidator
          name="name"
          className={classes.inputMaterial}
          label="Nombre"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          value={SelectedUser.name}
          autoFocus
          onChange={handleChange}
        />
        <br />
        <TextValidator
          className={classes.inputMaterial}
          name="surname"
          label="Apellido"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          value={SelectedUser.surname}
          onChange={handleChange}
        />
        <br />
        <TextValidator
          className={classes.inputMaterial}
          name="username"
          label="Nombre de usuario"
          disabled={true}
          value={SelectedUser.username}
          onChange={handleChange}
        />
        <TextValidator
          className={classes.inputMaterial}
          name="email"
          label="Correo"
          validators={["required", "isEmail"]}
          errorMessages={["Campo requerido", "El correo no es válido"]}
          value={SelectedUser.email}
          onChange={handleChange}
        />
        <br />
        <InputLabel id="demo-simple-select-required-label">Rol</InputLabel>
        <Select
          labelId="select-role"
          id="select-role-required"
          name="role"
          defaultValue={"VIEWER"}
          onChange={handleRole}
          value={SelectedUser.role}
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

EditSupplierForm.propTypes = {
  onClose: PropTypes.func,
};

export default EditSupplierForm;
