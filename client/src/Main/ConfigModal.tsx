import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { validate } from './FormValidationRules'
import useForm from './useForm'
import { ModalTypes } from './Main'

const getModalStyle = (): {top: string, left: string, transform: string} => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

const ConfigModal = React.forwardRef((props: any, ref) => {
  const { show, confirmButtonText, type, close, confirmButtonAction } = props

  const {
    formValues,
    errors,
    handleChange,
    handleSubmit
  } = useForm(validate)

  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()
  return (

    <Modal open={show} onClose={close}>
      <div style={modalStyle} className={classes.paper}>
        <h2 id='simple-modal-title'>{props.children[0]}</h2>
        <p id='simple-modal-description'>
          {props.children[1]}
        </p>
        <form onSubmit={(e) => handleSubmit(e, type, confirmButtonAction)}>
          {type === ModalTypes.SPACE &&
                        (
                          <>
                            <TextField
                              error={!!errors.spaceId}
                              id='spaceId'
                              name='spaceId'
                              label='Enter Space ID'
                              variant='outlined'
                              onChange={handleChange} value={formValues.spaceId || ''}
                              helperText="Space ID needs to include a '/' character."
                              required
                            />
                            <TextField id='mapId' name='mapId' label='Enter Map name' variant='outlined' onChange={handleChange} value={formValues.mapId || ''} required />
                          </>
                        )}
          {type === ModalTypes.API &&
                        (
                          <TextField id='apiKey' name='apiKey' label='Enter API Key' variant='outlined' onChange={handleChange} value={formValues.apiKey || ''} />
                        )}

          <Button type='submit' color='primary' className='ModalButton'>
            {confirmButtonText}
          </Button>
          <Button color='secondary' onClick={close}>Close</Button>
        </form>
      </div>
    </Modal>
  )
})

export default ConfigModal
