
import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteProduct, getProducts } from '../../../actions/ProductAction';
import { deleteItemSelected, getAllProducts } from '../../../services/ProductService';

const DeleteProductForm = (props) => {
  const SelectedProduct = useSelector(state => state.ProductReducer.SelectedProduct);

  const dispatch = useDispatch();

    const deleteItem = async () => {
        deleteItemSelected(SelectedProduct).then(async (response) => {
          if (response.status === 204) {
            dispatch(DeleteProduct(SelectedProduct));
              getAllProducts().then(async (response) => {
                dispatch(getProducts(await response.json()));
              });
            props.onClose();
          } else if (response.status === 403){
            alert("No dispone de los permisos necesarios para llevar a cabo dicha acción");
            props.onClose();
          }
          else if (response.status === 404) {
            alert("No se ha encontrado el objeto solicitado");
            getAllProducts();
          }
        });
      };

    return (
    <div>
      <p>
        ¿Está seguro que desea borrar el elemento{" "}
        <b>{SelectedProduct.description}</b> ?{" "}
      </p>
      <div align="right">
        <Button color="secondary" onClick={() => deleteItem()}>
          Sí
        </Button>
        <Button onClick={props.onClose}>No</Button>
      </div>
    </div>
    )
}

export default DeleteProductForm;
