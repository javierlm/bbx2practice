import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../services/UserService";
import { getUsers, UserSelectedState } from "../../actions/UserAction";
import SaveUserForm from "./modal/SaveUserForm";
import EditUserForm from "./modal/EditUserForm";
import ModalGeneric from "../modal/ModalGeneric";
import MUIDataTable from "mui-datatables";
import DeleteUserForm from "./modal/DeleteUserForm";
import SecuredAddButton from "../SecuredAddButton";
import useStyles from "../../styles/FormMaterialStyles";
import SecuredEditButton from "../SecuredEditButton";
import SecuredDeleteButton from "../SecuredDeleteButton";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { IconButton } from "@material-ui/core";
import ChangePasswordAdminForm from "./modal/ChangePasswordAdminForm";

const UsersTable = (props) => {
  const classes = useStyles();
  const users = useSelector((state) => state.UserReducer.users);
  const dispatch = useDispatch();

  const [modalSave, setModalSave] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);

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
      name: "surname",
      label: "Apellido",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "username",
      label: "Nombre de usuario",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "e-Mail",
      options: {
        filter: true,
        sort: false,
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="home"
                value={value}
                onClick={() => selectItem(value, "Change_Password")}
              >
                <VpnKeyIcon className={classes.icons} />
              </IconButton>
              <SecuredEditButton
                permission="USER_MANAGEMENT"
                subject="users"
                value={value}
                onClick={selectItem}
              ></SecuredEditButton>
              <SecuredDeleteButton
                permission="USER_MANAGEMENT"
                subject="users"
                value={value}
                onClick={selectItem}
              ></SecuredDeleteButton>
            </div>
          );
        },
      },
    },
  ];

  const modalOpenCloseSave = () => {
    setModalSave(!modalSave);
  };

  const modalOpenCloseEdit = () => {
    setModalEdit(!modalEdit);
  };

  const modalOpenCloseDelete = () => {
    setModalDelete(!modalDelete);
  };

  const modalOpenCloseChangePassword = () => {
    setModalChangePassword(!modalChangePassword);
  };

  const selectItem = (item, mode) => {
    dispatch(UserSelectedState(users.find((user) => user.id === item)));
    //mode === "Edit" ? modalOpenCloseEdit() : modalOpenCloseDelete();
    switch (mode) {
      case "Edit":
        modalOpenCloseEdit();
        break;
      case "Delete":
        modalOpenCloseDelete();
        break;
      case "Change_Password":
        modalOpenCloseChangePassword();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getAllUsers().then(async (response) => {
      dispatch(getUsers(await response.json()));
    });
  }, [dispatch]);

  const options = {
    selectableRows: "none",
  };

  return (
    <div className={classes.table}>
      <MUIDataTable data={users} columns={columns} options={options} />
      <ModalGeneric open={modalSave} onClose={modalOpenCloseSave}>
        <SaveUserForm onClose={modalOpenCloseSave}></SaveUserForm>
      </ModalGeneric>
      <ModalGeneric open={modalEdit} onClose={modalOpenCloseEdit}>
        <EditUserForm onClose={modalOpenCloseEdit}></EditUserForm>
      </ModalGeneric>
      <ModalGeneric open={modalDelete} onClose={modalOpenCloseDelete}>
        <DeleteUserForm onClose={modalOpenCloseDelete}></DeleteUserForm>
      </ModalGeneric>
      <ModalGeneric open={modalChangePassword} onClose={modalOpenCloseChangePassword}>
        <ChangePasswordAdminForm onClose={modalOpenCloseChangePassword}></ChangePasswordAdminForm>
      </ModalGeneric>
      <div>
        <SecuredAddButton
          onClick={modalOpenCloseSave}
          permission="USER_MANAGEMENT"
          subject="users"
        ></SecuredAddButton>
      </div>
    </div>
  );
};

UsersTable.propTypes = {
  onClose: PropTypes.func,
};

export default UsersTable;
