import { forwardRef, useState, Dispatch } from 'react'
import { Button, Container, List, ListItem, ListItemText, Modal } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import ajv from 'ajv'

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

export const ConfirmationModal = forwardRef((props: {
  openModal: boolean
  formErrors: ajv.ErrorObject[]
  setOpenModal: Dispatch<React.SetStateAction<boolean>>
  submitChanges: (e: React.MouseEvent<HTMLButtonElement>) => void
}, ref) => {
  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()

  const { openModal, formErrors, setOpenModal, submitChanges } = props

  const NoFormErrorModalContent = (): JSX.Element => {
    return (
      <Container>
        <p>There are no form errors. Click 'Update' to save the map data.</p>
        <Button
          onClick={() => setOpenModal(false)}
          color='secondary'
          variant='contained'
        >
          Cancel
        </Button>
        <Button
          onClick={submitChanges}
          color='primary'
          variant='contained'
          style={{ float: 'right', marginRight: '10px' }}
        >
          Update
        </Button>
      </Container>
    )
  }

  const FormErrorModalContent = (): JSX.Element => {
    return (
      <Container>
        <h3>There are form validation errors</h3>
        <p>Please review and fix them before updating the map.</p>
        <List
          component='ul'
          aria-labelledby='nested-list-subheader'
          style={{
            height: '150px',
            overflowY: 'auto'
          }}
        >
          {formErrors.map((e, index) => {
            return (
              <ListItem component='li' key={index}>
                <ListItemText primary={`Error: ${e.dataPath ?? 'bug in retrieving datapath'}, ${e.message ?? 'bug in retrieving error message'}`} />
              </ListItem>
            )
          })}
        </List>
        <Button
          onClick={() => setOpenModal(false)}
          color='secondary'
          variant='contained'
        >
          Cancel
        </Button>
        <Button
          onClick={submitChanges}
          color='primary'
          variant='contained'
          style={{ float: 'right', marginRight: '10px' }}
        >
          Update anyway
        </Button>
      </Container>
    )
  }

  return (
    <Modal ref={ref} open={openModal} onClose={() => setOpenModal(false)}>
      <div style={modalStyle} className={classes.paper}>
        {formErrors.length === 0 ? <NoFormErrorModalContent /> : <FormErrorModalContent />}
      </div>
    </Modal>
  )
})
