import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { isBefore, isAfter, parse } from "date-fns/esm";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Popover,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState } from "react";
import {
  getAllProducts,
  saveEditedItemSelected,
} from "../../../services/ProductService";

import useStyles from "../../../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  AddSupplierToSelectedProduct,
  getProducts,
  ProductSelectedAttribute,
  RemoveAllSuppliersFromSelectedProduct,
  RemoveSupplierToSelectedProduct,
  setSelectedProductDiscountToProduct,
} from "../../../actions/ProductAction";
import { Alert, Autocomplete } from "@material-ui/lab";
import AddDiscountForm from "./AddDiscountForm";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const EditProductForm = (props) => {
  const classes = useStyles();
  const SelectedProduct = useSelector(
    (state) => state.ProductReducer.SelectedProduct
  );
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

  const hasActualDiscount = () => {
    let discounts = SelectedProduct.priceReductionList;
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

  const updateItem = async () => {
    saveEditedItemSelected(SelectedProduct).then(async (response) => {
      getAllProducts().then(async (response) => {
        dispatch(getProducts(await response.json()));
      });
      props.onClose();
    });
  };

  const getActualDiscount = () => {
    let discounts = SelectedProduct.priceReductionList;
    const today = new Date();
    let activeDiscount = discounts.filter(
      (actual_discount) =>
        isBefore(
          parse(actual_discount.startDate, "dd-MM-yyyy", new Date()),
          today
        ) &&
        isAfter(parse(actual_discount.endDate, "dd-MM-yyyy", new Date()), today)
    );
    let discountString;
    if (activeDiscount[0] !== undefined)
      discountString =
        activeDiscount[0]?.reducedPrice +
        "% hasta el " +
        activeDiscount[0]?.endDate;
    return discountString;
  };

  //HANDLES
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      ProductSelectedAttribute({
        [name]: value,
      })
    );
  };

  const handleDateChange = (date, value) => {
    dispatch(
      ProductSelectedAttribute({
        creationDate: value,
      })
    );
  };

  const handleChangeSupplier = (e, value, reason, detail) => {
    switch (reason) {
      case "select-option":
        dispatch(AddSupplierToSelectedProduct(detail.option));
        break;
      case "remove-option":
        dispatch(RemoveSupplierToSelectedProduct(detail.option));
        break;
      case "clear":
        dispatch(RemoveAllSuppliersFromSelectedProduct());
        break;
      default:
        break;
    }
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
      <h3>Actualizar Producto</h3>
      <ValidatorForm
        onSubmit={(event) => handleSubmit(event)}
        instantValidate
        onError={(errors) => handleErrors(errors)}
      >
        <TextField
          name="itemCode"
          className={classes.inputMaterial}
          label="Código"
          disabled={true}
          value={SelectedProduct.code}
        />
        <br />
        <TextValidator
          name="description"
          className={classes.inputMaterial}
          label="Descripción"
          validators={['required']}
          errorMessages={["Campo requerido"]}
          onChange={handleChange}
          value={SelectedProduct.description}
          autoFocus
        />
        <br />
        <TextField
          name="creator"
          className={classes.inputMaterial}
          label="Creador"
          disabled={true}
          value={
            SelectedProduct.creator.name + " " + SelectedProduct.creator.surname
          }
        />
        <br />
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <KeyboardDatePicker
            margin="normal"
            name="Fecha de creación"
            id="date-picker-dialog"
            label="Fecha de creación"
            format="dd-MM-yyyy"
            inputValue={SelectedProduct.creationDate.split(" ")[0]}
            value={SelectedProduct.creationDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <br />
        <TextField
          type="number"
          name="price"
          className={classes.inputMaterial}
          label="Precio"
          onChange={handleChange}
          value={SelectedProduct.price}
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
        <br />
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
            className={classes.modal}
            onClose={handleClose}
            setDiscountToProduct={setSelectedProductDiscountToProduct}
          />
        </Popover>
        <br />
        <TextField
          className={classes.inputMaterial}
          label="Descuentos"
          disabled
          value={getActualDiscount()}
          onChange={handleChange}
        />
        <br />
        <Autocomplete
          multiple
          filterSelectedOptions={true}
          id="suppliers-select"
          options={suppliers}
          value={SelectedProduct.suppliers}
          onChange={handleChangeSupplier}
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => option.name === value.name}
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

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Historial de activaciones
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {SelectedProduct &&
              SelectedProduct.activationHistory.map((row) => (
                <div>
                  <p>{"Nuevo estado: " + row.newState + "\n"}</p>
                  <p>{"Realizado por: " + row.performedByUser}</p>
                  <p>{"Motivo: " + row.description}</p>
                </div>
              ))}
          </AccordionDetails>
        </Accordion>
        <br />
        <br />
        <div align="right">
          <Button color="primary" type="submit">
            Editar
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

export default EditProductForm;
