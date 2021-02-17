import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";

import Popover from "@material-ui/core/Popover";
import { getAllSuppliers } from "../../../services/SupplierService";

import { format } from "date-fns/esm";

import {
  Button,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  newProductState,
  setNewProductState,
  getProducts,
  AddSupplierToNewProduct,
  RemoveSupplierToNewProduct,
  RemoveAllSuppliersFromNewProduct,
  setNewProductDiscountToProduct,
} from "../../../actions/ProductAction";
import {
  getAllProducts,
  saveItemSelected,
} from "../../../services/ProductService";
import useStyles from "../../../styles/FormMaterialStyles";
import AddDiscountForm from "./AddDiscountForm";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getSuppliers } from "../../../actions/SupplierAction";
import { isAfter, isBefore, parse } from "date-fns";
import { Alert } from "@material-ui/lab";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const productState = [
  {
    value: "ACTIVE",
    label: "ACTIVO",
  },
  {
    value: "DISCONTINUED",
    label: "DESCATALOGADO",
  },
];

const SaveProductForm = (props) => {
  const classes = useStyles();
  const newProduct = useSelector((state) => state.ProductReducer.newProduct);
  const suppliers = useSelector((state) => state.SupplierReducer.suppliers);

  const dispatch = useDispatch();

  const [modalSaveDiscount, setModalSaveDiscount] = useState(false);

  const modalOpenCloseSaveDiscount = () => {
    setModalSaveDiscount(!modalSaveDiscount);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const handleClick = (event) => {
    if (!hasActualDiscount()) {
      setAnchorEl(event.currentTarget);
    } else {
      setAlertMessage("El producto ya dispone de un descuento activo");
      setOpenAlertError(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //Hooks
  useEffect(() => {
    dispatch(
      newProductState({
        code: "",
        description: "",
        price: "",
        state: "ACTIVE",
        creationDate: format(new Date(), "dd-MM-yyyy"),
        suppliers: [],
        priceReductionList: [],
        activationHistory: [],
      })
    );
  }, [dispatch]);

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    dispatch(
      setNewProductState({
        [name]: value,
      })
    );
  };

  const handleChangeSupplierNew = (e, value, reason, detail) => {
    switch (reason) {
      case "select-option":
        dispatch(AddSupplierToNewProduct(detail.option));
        break;
      case "remove-option":
        dispatch(RemoveSupplierToNewProduct(detail.option));
        break;
      case "clear":
        dispatch(RemoveAllSuppliersFromNewProduct());
        break;
      default:
        break;
    }
  };

  const handleDateChange = (date, value) => {
    dispatch(
      setNewProductState({
        creationDate: value,
      })
    );
  };

  const hasActualDiscount = () => {
    let discounts = newProduct.priceReductionList;
    const today = new Date();
    let activeDiscount = discounts.filter(
      (actual_discount) =>
        isBefore(
          parse(actual_discount.startDate, "dd-MM-yyyy", new Date()),
          today
        ) &&
        isAfter(parse(actual_discount.endDate, "dd-MM-yyyy", new Date()), today)
    );
    return activeDiscount.length > 0;
  };

  const saveItem = async () => {
    if (newProduct.code !== "") {
      saveItemSelected(newProduct).then(async (response) => {
        if (response.status === 201) {
          getAllProducts().then(async (response) => {
            dispatch(getProducts(await response.json()));
            props.onClose();
          });
        } else {
          setAlertMessage(
            "El servidor no ha aceptado la petición. Por favor, rellene correctamente el formulario"
          );
          setOpenAlertError(true);
        }
      });
    } else {
      setAlertMessage("El código del producto no puede ser nulo");
      setOpenAlertError(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveItem();
  };

  const handleErrors = (event) => {
    setAlertMessage("Hay errores en el formulario. Por favor, revíselo");
    setOpenAlertError(true);
  };

  useEffect(() => {
    getAllSuppliers().then(async (response) => {
      dispatch(getSuppliers(await response.json()));
    });
  }, [dispatch]);

  return (
    <div className={classes.modal}>
      <h3>Añadir nuevo producto</h3>
      <ValidatorForm
        onSubmit={(event) => handleSubmit(event)}
        instantValidate
        onError={(errors) => handleErrors(errors)}
      >
        <TextValidator
          name="code"
          inputProps={{ type: "number", pattern: "[0-9]*" }}
          className={classes.inputMaterial}
          label="Código"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          value={newProduct.code}
          onChange={handleChangeNew}
          autoFocus
        />
        <br />
        <TextValidator
          className={classes.inputMaterial}
          name="description"
          label="Descripción"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          value={newProduct.description}
          onChange={handleChangeNew}
        />
        <br />
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <KeyboardDatePicker
            className={classes.inputMaterial}
            margin="normal"
            name="Fecha de creación"
            id="date-picker-dialog"
            label="Fecha de creación"
            format="dd-MM-yyyy"
            inputValue={newProduct && newProduct.creationDate}
            value={newProduct.creationDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <br />
        <TextField
          className={classes.inputMaterial}
          name="price"
          label="Precio"
          inputProps={{ type: "number" }}
          value={newProduct.price}
          onChange={handleChangeNew}
        />
        <br />
        <br />
        <Button
          aria-describedby={id}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Añadir Descuento
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClick={modalOpenCloseSaveDiscount}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <AddDiscountForm
            className={classes.dialog}
            onClose={handleClose}
            setDiscountToProduct={setNewProductDiscountToProduct}
          />
        </Popover>
        <br />
        <br />
        <Autocomplete
          multiple
          filterSelectedOptions={true}
          id="suppliers-select"
          options={suppliers}
          onChange={handleChangeSupplierNew}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Lista de Proveedores"
              placeholder="Proveedores"
            />
          )}
        />
        <br />
        <InputLabel id="demo-simple-select-required-label">Estado</InputLabel>
        <Select
          labelId="select-state"
          id="select-state-required"
          name="state"
          defaultValue={"ACTIVE"}
          onChange={handleChangeNew}
          value={newProduct.state}
          className={classes.inputMaterial}
        >
          {productState.map((value) => (
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

export default SaveProductForm;
