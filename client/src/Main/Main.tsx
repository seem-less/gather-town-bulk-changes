import { useReducer, useContext, useState } from 'react'
import { Context } from '../Store/Store'
import { ActionType } from '../Store/Reducer'
import { Drawer, List, Divider, ListItem, ListItemSecondaryAction, ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import MapIcon from '@material-ui/icons/Map'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ConfigModal from './ConfigModal'
import SpaceInfo from '../interfaces/SpaceInfo'
import Table from '../Table/Table'
import UploadImageContainer from '../Table/UploadImageContainer'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#282c34',
    alignItems: 'center',
    justifyContent: 'center'
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  permanentdrawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  permanentdrawerPaper: {
    width: drawerWidth
  },
  tempdrawer: {
    width: 2 * drawerWidth,
    flexShrink: 0
  },
  tempdrawerPaper: {
    width: 2 * drawerWidth
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  errorText: {
    color: '#DF1C44'
  }
}))

export enum ModalTypes {
  SPACE = 'space',
  API = 'api'
}

enum Actions {
  SET_API = 'SET_API',
  ADD_SPACE = 'ADD_SPACE',
  CLOSE = 'CLOSE',
  BLOCK_CONFIRM = 'BLOCK_CONFIRM',
}

interface ModalState {
  type: string
  heading: string
  content: string
  confirmButtonText: string
  confirmButtonAction?: () => void
  show: boolean
}

export default function Main (): JSX.Element {
  const { state, dispatch } = useContext(Context)
  const classes = useStyles()

  const [uploadImagePanelSelected, setUploadImagePanelSelected] = useState(false)

  const modalReducer = (state: ModalState, action: { type: string }) => {
    switch (action.type) {
      case Actions.SET_API:
        return {
          type: ModalTypes.API,
          heading: 'Edit API Key',
          content: 'Your API key can be generated at\nhttps://gather.town/apiKeys',
          confirmButtonText: 'Set',
          confirmButtonAction: () => dispatchModalAction(Actions.CLOSE),
          show: true
        }
      case Actions.ADD_SPACE:
        return {
          type: ModalTypes.SPACE,
          heading: 'Add Space-ID and Map-ID',
          content: 'Your Space-ID and Map-ID can be found in the URL of your Gather.Town space.',
          confirmButtonText: 'Add Space',
          confirmButtonAction: () => dispatchModalAction(Actions.CLOSE),
          show: true
        }
      case Actions.CLOSE:
      default:
        return {
          type: '',
          heading: '',
          content: '',
          confirmButtonText: '',
          show: false
        }
    }
  }

  const [modalState, modalDispatch] = useReducer(modalReducer, {
    type: '',
    heading: '',
    content: '',
    confirmButtonText: '',
    show: false
  })

  const dispatchModalAction = (action: string): void => {
    modalDispatch({
      type: action
    })
  }

  const closeModalHandler = (): void => {
    modalDispatch({
      type: Actions.CLOSE
    })
  }

  const deleteSpace = (spaceId: string): void => {
    const newSpaceArray = state.spaces.filter((s: SpaceInfo) => s.spaceId !== spaceId)
    dispatch({ type: ActionType.SET_SPACES, payload: newSpaceArray })
    dispatch({ type: ActionType.SELECT_SPACE, payload: null })
  }

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.permanentdrawer}
        variant='permanent'
        classes={{
          paper: classes.permanentdrawerPaper
        }}
        anchor='left'
      >
        <ListItem>
          <ListItemText primary='Gather Town Bulk Changes' />
        </ListItem>
        <ListItem button key='apiKey' onClick={() => dispatchModalAction(Actions.SET_API)}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary='Edit API Key' />
        </ListItem>
        <Divider />
        <List>
          {state.spaces.map((spaceInfo: SpaceInfo, index: number) => (
            <ListItem button key={index} selected={spaceInfo === state.selected} onClick={() => dispatch({ type: ActionType.SELECT_SPACE, payload: spaceInfo })}>
              <ListItemIcon><MapIcon /></ListItemIcon>
              <ListItemText primary={spaceInfo.spaceId.split('\\')[1] + ' - ' + spaceInfo.mapId} className={!spaceInfo.success ? classes.errorText : ''} />
              <ListItemSecondaryAction>
                <ListItemIcon><DeleteIcon onClick={() => deleteSpace(spaceInfo.spaceId)} /></ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem button key='new' onClick={() => dispatchModalAction(Actions.ADD_SPACE)}>
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary='Add new Space' />
          </ListItem>
        </List>
        <Drawer
          open={uploadImagePanelSelected}
          onClose={() => setUploadImagePanelSelected(false)}
          className={classes.tempdrawer}
          classes={{
            paper: classes.tempdrawerPaper
          }}
          anchor='left'
        >
          <UploadImageContainer />
        </Drawer>
      </Drawer>
      <Table setUploadImagePanelSelected={setUploadImagePanelSelected} />
      <ConfigModal
        type={modalState.type}
        show={modalState.show}
        close={closeModalHandler}
        confirmButtonText={modalState.confirmButtonText}
        confirmButtonAction={modalState.confirmButtonAction}
      >
        {modalState.heading}
        {modalState.content}
      </ConfigModal>
    </div>
  )
}
