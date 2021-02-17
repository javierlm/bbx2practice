import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Snackbar, TextField } from "@material-ui/core";

import useStyles from "../../../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  AddProductToNewSupplier,
  getSuppliers,
  newSupplierState,
  RemoveAllProductsFromNewSupplier,
  RemoveProductToNewSupplier,
  setNewSupplierState,
} from "../../../actions/SupplierAction";
import {
  getAllSuppliers,
  saveItemSelected,
} from "../../../services/SupplierService";
import { Alert, Autocomplete } from "@material-ui/lab";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const SaveSupplierForm = (props) => {
  const classes = useStyles();
  const products = useSelector((state) => state.ProductReducer.products);
  const newSupplier = useSelector((state) => state.SupplierReducer.newSupplier);
  const CountryList = useSelector((state) => state.CountryReducer.countries);
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

  useEffect(() => {
    dispatch(
      newSupplierState({
        name: "",
        country: {
          id: 73,
          isoCode: "ES",
          name: "España",
        },
        products: [],
      })
    );
  }, [dispatch]);

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    dispatch(
      setNewSupplierState({
        [name]: value,
      })
    );
  };

  const handleChangeCountryNew = (e, value, reason, detail) => {
    switch (reason) {
      case "select-option":
        dispatch(
          setNewSupplierState({
            country: detail.option,
          })
        );
        break;
      default:
        break;
    }
  };

  const handleChangeProductNew = (e, value, reason, detail) => {
    switch (reason) {
      case "select-option":
        dispatch(AddProductToNewSupplier(detail.option));
        break;
      case "remove-option":
        dispatch(RemoveProductToNewSupplier(detail.option));
        break;
      case "clear":
        dispatch(RemoveAllProductsFromNewSupplier());
        break;
      default:
        break;
    }
  };

  const saveItem = async () => {
    saveItemSelected(newSupplier).then(async (response) => {
      getAllSuppliers().then(async (response) => {
        dispatch(getSuppliers(await response.json()));
        props.onClose();
      });
      props.onClose();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveItem();
  };

  const handleErrors = (event) => {
    setAlertMessage("Hay errores en el formulario. Por favor, revíselo");
    setOpenAlertError(true);
  };

  return (
    <div className={classes.modal}>
      <h3>Añadir nuevo proveedor</h3>
      <ValidatorForm
        onSubmit={(event) => handleSubmit(event)}
        instantValidate
        onError={(errors) => handleErrors(errors)}
      >
        <br />
        <TextValidator
          className={classes.inputMaterial}
          name="name"
          label="Nombre"
          validators={["required"]}
          errorMessages={["Campo requerido"]}
          value={newSupplier.name}
          autoFocus
          onChange={handleChangeNew}
        />
        <br />
        <br />
        <Autocomplete
          id="country-select"
          options={CountryList}
          name="country"
          defaultValue={{
            id: 73,
            isoCode: "ES",
            name: "España",
          }}
          onChange={handleChangeCountryNew}
          value={newSupplier.country}
          getOptionSelected={(option) => option.name}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Países"
              placeholder="Países"
            />
          )}
        />
        <br />
        <Autocomplete
          multiple
          filterSelectedOptions={true}
          id="products-select"
          options={products}
          onChange={handleChangeProductNew}
          getOptionLabel={(option) => option.description}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Lista de Productos"
              placeholder="Productos"
            />
          )}
        />
        <br />
        <div align="right">
          <Button color="primary" type="submit">
            Guardar
          </Button>
          <Button onClick={props.onClose} color="secondary">
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

SaveSupplierForm.propTypes = {
  onClose: PropTypes.func,
};

export default SaveSupplierForm;
