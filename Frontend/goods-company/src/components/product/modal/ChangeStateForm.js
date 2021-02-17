import { Button, TextField } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  ProductStateChangedReason,
} from "../../../actions/ProductAction";

import {
  getAllProducts,
  changeStateProduct,
} from "../../../services/ProductService";
import useStyles from "../../../styles/FormMaterialStyles";

const SaveStateForm = (props) => {
  const classes = useStyles();
  const itemStateSelected = useSelector(
    (state) => state.ProductReducer.productStateChanged
  );
  const dispatch = useDispatch();

  //Hooks
  const changeStateItem = async (modalOpenCloseStateChange) => {
    changeStateProduct(itemStateSelected).then(async (response) => {
      getAllProducts().then(async (response) => {
        dispatch(getProducts(await response.json()));
      });
      modalOpenCloseStateChange();
    });
  };

  const handleActivationChangeDescription = (e, code, newState) => {
    const { value } = e.target;
    dispatch(
      ProductStateChangedReason({
        description: value,
      })
    );
  };

  return (
    <div>
      <h3>Cambiar estado</h3>
      <TextField
        className={classes.inputMaterial}
        name="description"
        label="Motivo"
        autoFocus
        onChange={(event) =>
          handleActivationChangeDescription(
            event,
            props.codeSelected,
            props.newState
          )
        }
        value={itemStateSelected && itemStateSelected.description}
      />
      <br />
      <div align="right">
        <Button onClick={() => changeStateItem(props.onClose)} color="primary">
          Guardar
        </Button>
        <Button onClick={props.onClose} color="secondary">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default SaveStateForm;
