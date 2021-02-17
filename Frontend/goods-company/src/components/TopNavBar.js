import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Container,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import Cookie from "js-cookie";
import { NavLink, useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../actions/UserAction";
import { useEffect } from "react";
import useStyles from "../styles/FormMaterialStyles";
import ModalGeneric from "./modal/ModalGeneric";
import ChangePasswordForm from "./ChangePasswordForm";

const navLinks = [
  { title: `PRODUCTOS`, path: `/products` },
  { title: `PROVEEDORES`, path: `/suppliers` },
  { title: `USUARIOS`, path: `/users` },
];

const TopNavBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [modalChangePassword, setModalChangePassword] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePasswordChange = () => {
    modalOpenCloseChangePassword();
  };

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("name");
    history.push("/");
  };

  const loggedUser = useSelector((state) => state.UserReducer.loggedUser);
  const dispatch = useDispatch();

  const modalOpenCloseChangePassword = () => {
    setModalChangePassword(!modalChangePassword);
  };

  useEffect(() => {
    let readUsername = Cookie.get("name");
    if (readUsername !== undefined) dispatch(setCurrentUser(readUsername));
  }, [dispatch]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container maxWidth="md" className={classes.navbarDisplayFlex}>
          <NavLink to="/" className={classes.linkText} key="home">
            <IconButton edge="start" color="inherit" aria-label="home">
              <Home fontSize="large" />
            </IconButton>
          </NavLink>
          <List
            component="nav"
            aria-labelledby="main navigation"
            className={classes.navDisplayFlex}
          >
            {navLinks.map(({ title, path }) => (
              <NavLink to={path} className={classes.linkText} key={title} activeStyle={{ backgroundColor: '#6574C4', borderRadius: '5px' }}>
                <ListItem button>
                  <ListItemText primary={title} />
                </ListItem>
              </NavLink>
            ))}
          </List>
          <div className={classes.usernameText}>
            <span>Usuario actual: <strong>{Cookie.get("name")}</strong></span>
            <IconButton
              aria-label="account_current_user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleClick}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="logout-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handlePasswordChange}>Cambiar contraseña</MenuItem>
              <MenuItem onClick={handleLogout} className={classes.redText}>Cerrar sesión</MenuItem>
            </Menu>
          </div>
        </Container>
      </Toolbar>
      <ModalGeneric open={modalChangePassword} onClose={modalOpenCloseChangePassword}>
        <ChangePasswordForm onClose={modalOpenCloseChangePassword}></ChangePasswordForm>
      </ModalGeneric>
    </AppBar>
  );
};
export default TopNavBar;
