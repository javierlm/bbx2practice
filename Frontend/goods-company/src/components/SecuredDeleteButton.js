
import React from 'react'
import PropTypes from 'prop-types'
import { Can } from '../permissions/Can'
import { IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import useStyles from '../styles/FormMaterialStyles'

const SecuredDeleteButton = props => {
    const classes = useStyles();

    return (
        <Can I={props.permission} on={props.subject} passThrough>
                {(allowed) =>
                  allowed ? (
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="home"
                      onClick={() => props.onClick(props.value, "Delete")}
                    >
                      <Delete color="secondary" className={classes.icons} />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="home"
                      disabled={true}
                    >
                      <Delete className={classes.icons} />
                    </IconButton>
                  )
                }
              </Can>
    )
}

SecuredDeleteButton.propTypes = {
    onClick: PropTypes.func
}

export default SecuredDeleteButton

