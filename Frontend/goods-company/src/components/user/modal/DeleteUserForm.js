import React from "react";
import PropTypes from "prop-types";
import Cookie from "js-cookie";
import useStyles from "../../../styles/FormMaterialStyles";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUserSelected } from "../../../services/UserService";
import { DeleteUser, getUsers } from "../../../actions/UserAction";

const DeleteUserForm = (props) => {
  const classes = useStyles();

  const SelectedUser = useSelector((state) => state.UserReducer.SelectedUser);
  const dispatch = useDispatch();

  const deleteItem = async () => {
    deleteUserSelected(SelectedUser).then(async (response) => {
      if (response.status === 204) {
        dispatch(DeleteUser(SelectedUser));
        getAllUsers().then(async (response) => {
          dispatch(getUsers(await response.json()));
        });
        props.onClose();
      } else if (response.status === 404) {
        getAllUsers();
      }
    });
  };

  if (SelectedUser.username !== Cookie.get("name")) {
    return (
      <div className={classes.modal}>
        <p>
          ¿Está seguro que desea borrar el usuario <b>{SelectedUser.name}</b> ?{" "}
        </p>
        <div align="right">
          <Button color="secondary" onClick={() => deleteItem()}>
            Sí
          </Button>
          <Button onClick={() => props.onClose()}>No</Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.modal}>
        <p>¡No puedes borrarte a ti mismo!</p>
        <div align="right">
          <Button onClick={() => props.onClose()}>Aceptar</Button>
        </div>
      </div>
    );
  }
};

DeleteUserForm.propTypes = {
  onClick: PropTypes.func
};

export default DeleteUserForm;
