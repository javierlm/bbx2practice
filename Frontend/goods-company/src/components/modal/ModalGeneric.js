
import { Dialog, Grow } from "@material-ui/core";
import useStyles from "../../styles/FormMaterialStyles";

const ModalGeneric = (props) => {
  const classes = useStyles();

  return (
    <Dialog open={props.open} onClose={props.onClose} TransitionComponent={Grow} transitionDuration={200} >
      <div className={classes.dialog}> { props.children }</div>
    </Dialog>
  );
};

export default ModalGeneric;
