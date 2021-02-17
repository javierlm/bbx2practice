import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Can } from "../permissions/Can";
import { Edit } from "@material-ui/icons";
import useStyles from "../styles/FormMaterialStyles";

const SecuredEditButton = (props) => {
    const classes = useStyles();

  return (
    <Can I={props.permission} on={props.subject} passThrough>
      {(allowed) =>
        allowed ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={() => props.onClick(props.value, "Edit")}
          >
            <Edit className={classes.icons} />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            disabled={true}
          >
            <Edit className={classes.icons} />
          </IconButton>
        )
      }
    </Can>
  );
};

SecuredEditButton.propTypes = {
    permission: PropTypes.string,
    subject: PropTypes.string,
    value: PropTypes.number,
    onClick: PropTypes.func
};

export default SecuredEditButton;
