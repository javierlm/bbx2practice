import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
  },
  dialog: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  popover: {
    padding: theme.spacing(2, 4, 3),
  },
  inputMaterial: {
    width: "100%",
    whiteSpace: "pre-line"
  },
  loginInput: {
    width: "100%",
    whiteSpace: "pre-line"
  },
  loginForm: {
    marginLeft: "auto",
    marginRight: "auto",
    padding: "3%",
    display: "inline-block"
  },
  redText: {
    color: "red"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    width: 200,
  },
  icons: {
    cursor: "pointer",
  },
  fab: {
    marginTop: "0.5em",
    marginBottom: "1em",
  },
  table: {
    marginLeft: "5%",
    marginRight: "5%",
  },
  typography: {
    padding: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    marginLeft: "auto",
    marginRight: "auto"
  },
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
  usernameText: {
    marginTop: "1%",
  },
  marginButton: {
    width: "100%",
    marginTop: "1%",
  }
}));

export default useStyles;
