import { useEffect, useState } from "react";

import { getAllSuppliers } from "../../services/SupplierService";

import ModalGeneric from "../modal/ModalGeneric";
import DeleteSupplierForm from "./modal/DeleteSupplierForm";
import {
  getSuppliers,
  SupplierSelectedState,
} from "../../actions/SupplierAction";
import { useDispatch, useSelector } from "react-redux";
import SaveSupplierForm from "./modal/SaveSupplierForm";
import EditSupplierForm from "./modal/EditSupplierForm";

import MUIDataTable from "mui-datatables";
import SecuredAddButton from "../SecuredAddButton";
import SecuredEditButton from "../SecuredEditButton";
import SecuredDeleteButton from "../SecuredDeleteButton";
import useStyles from "../../styles/FormMaterialStyles";
import { getCountries } from "../../actions/CountryAction";
import getAllCountries from "../../services/CountryService";

const SuppliersTable = () => {
  const classes = useStyles();
  const [modalSave, setModalSave] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const suppliers = useSelector((state) => state.SupplierReducer.suppliers);

  const dispatch = useDispatch();

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Nombre",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "country",
      label: "País",
      options: {
        filter: true,
        filterType: "multiselect",
        sort: true,
        sortCompare: (order) => {
          return (obj1, obj2) => {
            const compValue = obj1.data.name.localeCompare(obj2.data.name);
            return compValue * (order === "asc" ? 1 : -1);
          };
        },
        customFilterListOptions: { render: (v) => `País: ${v}` },
        filterOptions: {
          names: [
            ...new Set(
              suppliers.map((currentSupplier) => currentSupplier.country.name)
            ),
          ],
          logic(country, filterVal) {
            const show = filterVal.includes(country.name);
            return !show;
          },
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value.name}</div>;
        },
      },
    },
    {
      name: "id",
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

  const modalOpenCloseSave = () => {
    setModalSave(!modalSave);
  };

  const modalOpenCloseEdit = () => {
    setModalEdit(!modalEdit);
  };

  const modalOpenCloseDelete = () => {
    setModalDelete(!modalDelete);
  };

  const selectItem = (item, mode) => {
    dispatch(SupplierSelectedState(suppliers.find((user) => user.id === item)));
    mode === "Edit" ? setModalEdit(true) : modalOpenCloseDelete(true);
  };

  useEffect(() => {
    getAllSuppliers().then(async (response) => {
      dispatch(getSuppliers(await response.json()));
    });
    getAllCountries().then(async (response) => {
      dispatch(getCountries(await response.json()));
    });

  }, [dispatch]);

  return (
    <div className={classes.table}>
      <MUIDataTable data={suppliers} columns={columns} options={options} />
      <div>
        <SecuredAddButton
          onClick={modalOpenCloseSave}
          permission="create"
          subject="all"
        ></SecuredAddButton>
      </div>

      <ModalGeneric open={modalSave} onClose={modalOpenCloseSave}>
        <SaveSupplierForm onClose={modalOpenCloseSave}></SaveSupplierForm>
      </ModalGeneric>
      <ModalGeneric open={modalEdit} onClose={modalOpenCloseEdit}>
        <EditSupplierForm onClose={modalOpenCloseEdit}></EditSupplierForm>
      </ModalGeneric>
      <ModalGeneric open={modalDelete} onClose={modalOpenCloseDelete}>
        <DeleteSupplierForm onClose={modalOpenCloseDelete}></DeleteSupplierForm>
      </ModalGeneric>
    </div>
  );
};

export default SuppliersTable;
