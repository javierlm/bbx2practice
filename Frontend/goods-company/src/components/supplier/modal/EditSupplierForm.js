
import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@material-ui/core'
import useStyles from '../../../styles/FormMaterialStyles';
import { useDispatch, useSelector } from 'react-redux';

import { AddProductToSelectedSupplier, getSuppliers, RemoveProductToSelectedSupplier, SupplierSelectedAttribute, RemoveAllProductsFromSelectedSupplier } from '../../../actions/SupplierAction';
import { getAllSuppliers, saveEditedItemSelected } from '../../../services/SupplierService';
import { Autocomplete } from '@material-ui/lab';

const EditSupplierForm = props => {
    const classes = useStyles();
    const SelectedSupplier = useSelector(state => state.SupplierReducer.SelectedSupplier);
    const CountryList = useSelector((state) => state.CountryReducer.countries);
    const products = useSelector((state) => state.ProductReducer.products);
    const dispatch = useDispatch();

    //HANDLES
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(SupplierSelectedAttribute({
        [name]: value
    }));
  };

  const handleChangeCountryNew = (e, value, reason, detail) => {
    switch(reason){
      case 'select-option':
        dispatch(SupplierSelectedAttribute({
          country: detail.option
        }));
        break;
      default:
        break;
    }
  };

  const handleChangeProduct = (e, value, reason, detail) => {
    switch(reason){
      case 'select-option':
        dispatch(
          AddProductToSelectedSupplier(detail.option)
        );
        break;
      case 'remove-option':
        dispatch(
          RemoveProductToSelectedSupplier(detail.option)
        );
        break;
      case 'clear':
        dispatch(
          RemoveAllProductsFromSelectedSupplier()
        );
        break;
      default:
        break;
    }
  };

  const updateItem = async () => {
    saveEditedItemSelected(SelectedSupplier).then(async (response) => {
      getAllSuppliers().then(async (response) => {
        dispatch(getSuppliers(await response.json()));
      });
      props.onClose();
    });
  };

    return (
        <div className={classes.modal}>
        <h3>Modificar proveedor</h3>
        <TextField
          className={classes.inputMaterial}
          name="name"
          label="Nombre"
          autoFocus
          onChange={handleChange}
          value={SelectedSupplier.name}
        />
        <br /><br />
        <Autocomplete
        id="suppliers-select"
        options={CountryList}
        name="country"
        value={SelectedSupplier.country}
        onChange={handleChangeCountryNew}
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
        id="products-select"
        options={products}
        value={SelectedSupplier.products}
        onChange={handleChangeProduct}
        getOptionLabel={(option) => option.description}
        getOptionSelected={(option, value) => option.description === value.description}
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
          <Button onClick={() => updateItem()} color="primary">
            Guardar
          </Button>
          <Button onClick={props.onClose} color="secondary">
            Cancelar
          </Button>
        </div>
      </div>
    )
}

EditSupplierForm.propTypes = {
  onClose: PropTypes.func
}

export default EditSupplierForm


