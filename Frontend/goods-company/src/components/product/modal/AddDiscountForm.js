import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Button, Input } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns/esm";
import esLocale from "date-fns/locale/es";

import useStyles from "../../../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";

import {
  setNewProductDiscount,
  setNewProductDiscountAttribute,
} from "../../../actions/ProductAction";

const AddDiscountForm = (props) => {
  const classes = useStyles();
  const newProductDiscount = useSelector(
    (state) => state.ProductReducer.newProductDiscount
  );
  const dispatch = useDispatch();

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    dispatch(
      setNewProductDiscountAttribute({
        [name]: value,
      })
    );
  };

  const addDiscountToProduct = () => {
    dispatch(props.setDiscountToProduct(newProductDiscount));
    props.onClose();
  };

  const handleStartDateChange = (date, value) => {
    dispatch(
      setNewProductDiscountAttribute({
        startDate: value,
      })
    );
  };

  const handleEndDateChange = (date, value) => {
    dispatch(
      setNewProductDiscountAttribute({
        endDate: value,
      })
    );
  };

  useEffect(() => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    dispatch(
      setNewProductDiscount({
        reducedPrice: 1,
        startDate: format(today, "dd-MM-yyyy"),
        endDate: format(tomorrow, "dd-MM-yyyy"),
      })
    );
  }, [dispatch]);

  return (
    <div className={classes.popover}>
      <Input
        type="number"
        name="reducedPrice"
        value={newProductDiscount && newProductDiscount.reducedPrice}
        className={classes.inputMaterial}
        label="Porcentaje"
        onChange={handleChangeNew}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
        <KeyboardDatePicker
          className={classes.inputMaterial}
          onChange={handleStartDateChange}
          value={newProductDiscount && newProductDiscount.startDate}
          inputValue={newProductDiscount && newProductDiscount.startDate}
          margin="normal"
          name="Fecha de inicio"
          id="date-picker-dialog"
          label="Fecha de inicio"
          format="dd-MM-yyyy"
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
        <KeyboardDatePicker
          className={classes.inputMaterial}
          onChange={handleEndDateChange}
          value={newProductDiscount && newProductDiscount.endDate}
          inputValue={newProductDiscount && newProductDiscount.endDate}
          margin="normal"
          name="Fecha de fin"
          id="date-picker-dialog"
          label="Fecha de fin"
          format="dd-MM-yyyy"
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
      <div align="right">
        <Button onClick={() => addDiscountToProduct()} color="primary">
          Guardar
        </Button>
        <Button onClick={props.onClose} color="secondary">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

AddDiscountForm.propTypes = {
  onClose: PropTypes.func,
};

export default AddDiscountForm;
