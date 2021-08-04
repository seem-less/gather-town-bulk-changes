import { useState, createRef, useContext } from 'react'
import { Context } from '../Store/Store'
import { ActionType } from '../Store/Reducer'
import { JsonForms } from '@jsonforms/react'
import ajv from 'ajv'
import { MapData, Portal, NewPortal, TargetExternalUrl, TargetInternalMap, ExternalUrlPortal, InternalMapPortal } from '../interfaces/mapData'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { Button, IconButton, Snackbar, Tooltip } from '@material-ui/core'
import PublishIcon from '@material-ui/icons/Publish'
import { ConfirmationModal } from './ConfirmationModal'
import CloseIcon from '@material-ui/icons/Close'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

function Alert (props: AlertProps): JSX.Element {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

interface TabbedTableProps {
  mapDataSchema: any
  mapDataUISchema: any
  mapData: string | MapData
}

function TabbedTable ({ mapDataSchema, mapDataUISchema, mapData }: TabbedTableProps): JSX.Element {
  const { state, dispatch } = useContext(Context)

  const [formData, setFormData] = useState(mapData)
  const [formErrors, setFormErrors] = useState<ajv.ErrorObject[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)
  const [apiResponse, setApiResponse] = useState('')

  const reshapeDataForPost = (data: MapData | string): MapData => {
    if (typeof data === 'string') {
      throw new Error('Data from form is a string')
    };
    data.portals.forEach((p: Portal) => {
      if ((p as NewPortal<TargetExternalUrl>).targetMapOrUrl != null) {
        if ((p as NewPortal<TargetExternalUrl>).targetMapOrUrl?.targetUrl != null) {
          (p as ExternalUrlPortal).targetUrl = (p as NewPortal<TargetExternalUrl>).targetMapOrUrl?.targetUrl
          delete (p as InternalMapPortal).targetX
          delete (p as InternalMapPortal).targetY
          delete (p as InternalMapPortal).targetMap
          delete (p as NewPortal<TargetExternalUrl>).targetMapOrUrl
        } else {
          (p as InternalMapPortal).targetX = (p as NewPortal<TargetInternalMap>).targetMapOrUrl?.targetX;
          (p as InternalMapPortal).targetY = (p as NewPortal<TargetInternalMap>).targetMapOrUrl?.targetY;
          (p as InternalMapPortal).targetMap = (p as NewPortal<TargetInternalMap>).targetMapOrUrl?.targetMap
          delete (p as ExternalUrlPortal).targetUrl
          delete (p as NewPortal<TargetInternalMap>).targetMapOrUrl
        }
      }
    })

    return data
  }

  const uploadFromFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    if (e.target.files != null) {
      e.target.files[0].text().then(JSON.parse).then(setFormData).catch(console.log)
    }
  }

  const handleNotificationClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string): void => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNotification(false)
  }

  const submitChanges = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
      const response = await fetch('/setMap',
        {
          method: 'POST',
          body: JSON.stringify({
            apiKey: state.apiKey,
            spaceId: state.selected?.spaceId,
            mapId: state.selected?.mapId,
            mapContent: reshapeDataForPost(formData)
          }),
          headers: { 'Content-Type': 'application/json' }
        })
      setApiResponse(await response.text())
      setOpenModal(false)
      setOpenNotification(true)
      await new Promise(resolve => { setTimeout(resolve, 3000) })
      dispatch({ type: ActionType.SELECT_SPACE, payload: null })
      dispatch({ type: ActionType.SELECT_SPACE, payload: state.selected })
    } catch (error) {
      throw new Error(`Error: ${error as string}`);
    }
  }

  return (
    <>
      <JsonForms
        schema={mapDataSchema}
        uischema={mapDataUISchema}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data }) => {
          setFormErrors(errors === undefined ? [] : errors)
          setFormData(data)
        }}
      />
      <input
        accept='application/JSON'
        id='uploadJsonButton'
        type='file'
        hidden
        onChange={uploadFromFile}
      />
      <Tooltip title='Upload attributes for this category from a backed up JSON file'>
        <label htmlFor='uploadJsonButton'>
          <Button variant='contained' color='primary' component='span'>
            Upload from file&nbsp;<PublishIcon />
          </Button>
        </label>
      </Tooltip>
      <Tooltip title='Click to update map'>
        <Button
          onClick={() => setOpenModal(true)}
          color='primary'
          variant='contained'
          style={{ float: 'right', marginRight: '10px' }}
        >
          Save
        </Button>
      </Tooltip>
      <ConfirmationModal openModal={openModal} setOpenModal={setOpenModal} formErrors={formErrors} submitChanges={submitChanges} ref={createRef()} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={openNotification}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleNotificationClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      >
        <Alert severity='info' onClose={handleNotificationClose}>
          {'Response from server: ' + apiResponse}
        </Alert>
      </Snackbar>
    </>
  )
}

export default TabbedTable
