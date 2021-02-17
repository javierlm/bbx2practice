
import React from 'react'
import PropTypes from 'prop-types'
import { Can } from '../permissions/Can'
import { Fab } from '@material-ui/core'
import { AddIcon } from '@material-ui/data-grid'
import useStyles from '../styles/FormMaterialStyles'

const SecuredAddButton = props => {
    const classes = useStyles();

    return (
        <Can I={props.permission} on={props.subject} passThrough>
        {(allowed) =>
          allowed ? (
            <Fab
              className={classes.fab}
              color="primary"
              aria-label="add"
              onClick={props.onClick}
            >
              <AddIcon />
            </Fab>
          ) : (
            <Fab
              className={classes.fab}
              color="primary"
              aria-label="add"
              disabled={true}
            >
              <AddIcon />
            </Fab>
          )
        }
      </Can>
    )
}

SecuredAddButton.propTypes = {
    onClick: PropTypes.func,
    permission: PropTypes.string,
    subject: PropTypes.string
}

export default SecuredAddButton

