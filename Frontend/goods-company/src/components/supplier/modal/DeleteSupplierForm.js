import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import useStyles from "../../../styles/FormMaterialStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItemSelected,
  getAllSuppliers,
} from "../../../services/SupplierService";
import { DeleteSupplier, getSuppliers } from "../../../actions/SupplierAction";

const DeleteSupplierForm = (props) => {
  const classes = useStyles();
  const selectedSupplier = useSelector(
    (state) => state.SupplierReducer.SelectedSupplier
  );

  const dispatch = useDispatch();

  const deleteItem = async () => {
    deleteItemSelected(selectedSupplier).then(async (response) => {
      if (response.status === 204) {
        dispatch(DeleteSupplier(selectedSupplier));
        getAllSuppliers().then(async (response) => {
          dispatch(getSuppliers(await response.json()));
        });
        props.onClose();
      } else if (response.status === 404) {
        getAllSuppliers();
      }
    });
  };

  return (
    <div className={classes.modal}>
      <p>
        ¿Está seguro que desea borrar el elemento <b>{selectedSupplier.name}</b>{" "}
        ?{" "}
      </p>
      <div align="right">
        <Button color="secondary" onClick={() => deleteItem()}>
          Sí
        </Button>
        <Button onClick={() => props.onClose()}>No</Button>
      </div>
    </div>
  );
};

DeleteSupplierForm.propTypes = {
  onClose: PropTypes.func,
};

export default DeleteSupplierForm;
