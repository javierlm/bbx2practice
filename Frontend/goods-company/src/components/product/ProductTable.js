import { useEffect, useState } from "react";

import { getAllProducts } from "../../services/ProductService";

import ModalGeneric from "../modal/ModalGeneric";

import Switch from "@material-ui/core/Switch";

import SaveStateForm from "./modal/ChangeStateForm";
import DeleteProductForm from "./modal/DeleteProductForm";
import SaveProductForm from "./modal/SaveProductForm";
import EditProductForm from "./modal/EditProductForm";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  ProductSelectedState,
  ProductStateChanged,
} from "../../actions/ProductAction";
import { Can } from "../../permissions/Can";
import MUIDataTable from "mui-datatables";
import useStyles from "../../styles/FormMaterialStyles";
import SecuredAddButton from "../SecuredAddButton";
import SecuredEditButton from "../SecuredEditButton";
import SecuredDeleteButton from "../SecuredDeleteButton";

const ProductTable = () => {
  const classes = useStyles();
  const products = useSelector((state) => state.ProductReducer.products);

  const dispatch = useDispatch();
  const [modalSave, setModalSave] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalStateChange, setmodalStateChange] = useState(false);

  const handleActivationChange = (e, code) => {
    const { checked } = e.target;
    const activationValue = checked ? "ACTIVE" : "DISCONTINUED";
    dispatch(
      ProductStateChanged({
        code: code,
        newState: activationValue,
      })
    );
    modalOpenCloseStateChange();
  };

  const columns = [
    {
      name: "code",
      label: "Código",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "description",
      label: "Descripción",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "price",
      label: "Precio (€)",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "creationDate",
      label: "Fecha de creación",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "state",
      label: "Estado",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <Can I="edit" on="all" passThrough>
                {(allowed) =>
                  allowed ? (
                    <Switch
                      className={classes.root}
                      checked={value === "ACTIVE" ? true : false}
                      color="primary"
                      onChange={(event) =>
                        handleActivationChange(event, tableMeta.rowData[0])
                      }
                      name="state"
                    />
                  ) : (
                    <Switch
                      className={classes.root}
                      checked={value === "ACTIVE" ? true : false}
                      color="primary"
                      disabled={true}
                      name="state"
                    />
                  )
                }
              </Can>
            </div>
          );
        },
      },
    },
    {
      name: "code",
      label: "Acciones",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <SecuredEditButton
                permission="edit"
                subject="all"
                value={value}
                onClick={selectItem}
              ></SecuredEditButton>
              <SecuredDeleteButton
                permission="delete"
                subject="all"
                value={value}
                onClick={selectItem}
              ></SecuredDeleteButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
  };

  //Activación modales
  const modalOpenCloseSave = () => {
    setModalSave(!modalSave);
  };

  const modalOpenCloseStateChange = () => {
    setmodalStateChange(!modalStateChange);
  };

  const modalOpenCloseEdit = () => {
    setModalEdit(!modalEdit);
  };

  const modalOpenCloseDelete = () => {
    setModalDelete(!modalDelete);
  };

  const selectItem = (item, mode) => {
    dispatch(ProductSelectedState(products.find((user) => user.code === item)));
    mode === "Edit" ? setModalEdit(true) : modalOpenCloseDelete(true);
  };

  //Trae los elementos desde el servidor antes de renderizar la tabla por primera vez
  useEffect(() => {
    getAllProducts().then(async (response) => {
      dispatch(getProducts(await response.json()));
    });
  }, [dispatch]);

  return (
    <div className={classes.table}>
      <MUIDataTable data={products} columns={columns} options={options} />

      <SecuredAddButton
        onClick={modalOpenCloseSave}
        permission="create"
        subject="all"
      ></SecuredAddButton>

      <ModalGeneric open={modalSave} onClose={modalOpenCloseSave}>
        <SaveProductForm onClose={modalOpenCloseSave}></SaveProductForm>
      </ModalGeneric>
      <ModalGeneric open={modalEdit} onClose={modalOpenCloseEdit}>
        <EditProductForm onClose={modalOpenCloseEdit}></EditProductForm>
      </ModalGeneric>
      <ModalGeneric open={modalDelete} onClose={modalOpenCloseDelete}>
        <DeleteProductForm onClose={modalOpenCloseDelete}></DeleteProductForm>
      </ModalGeneric>
      <ModalGeneric open={modalStateChange} onClose={modalOpenCloseStateChange}>
        <SaveStateForm onClose={modalOpenCloseStateChange}></SaveStateForm>
      </ModalGeneric>
    </div>
  );
};

export default ProductTable;
