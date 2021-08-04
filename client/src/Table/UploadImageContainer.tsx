import { useState, useContext } from 'react'
import { Context } from '../Store/Store'
import { ActionType } from '../Store/Reducer'
import SpaceInfo from '../interfaces/SpaceInfo'
import { Button, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core'
import PublishIcon from '@material-ui/icons/Publish'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

interface Column {
  id: 'copyUrl' | 'delete' | 'fileName' | 'gatherTownUrl'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: Column[] = [
  { id: 'copyUrl', label: 'Copy URL', minWidth: 30 },
  { id: 'delete', label: 'Delete', minWidth: 30 },
  { id: 'fileName', label: 'File Name', minWidth: 30 },
  { id: 'gatherTownUrl', label: 'Gather Town Storage URL', minWidth: 30 }
]

export interface UploadImageData {
  fileName: File['name']
  gatherTownUrl: URL
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%'
  },
  container: {
    maxHeight: 440
  },
  input: {
    display: 'none'
  }
}))

function UploadImageContainer (): JSX.Element {
  const classes = useStyles()

  const { state, dispatch } = useContext(Context)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openNotification, setOpenNotification] = useState(false)
  const [copyNotification, setCopyNotificaiton] = useState(true)

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    if (e.target.files != null) {
      uploadFiles(e.target.files)
        .then((res) => {
          const currentSpaces: SpaceInfo[] = JSON.parse(localStorage.getItem('spaces') ?? '[]')
          const selectedSpaceIndex = findSpaceIndex(currentSpaces, state.selected)
          const newLinks = res.map((l: Object) => {
            const key = Object.keys(l)[0]
            const value = new URL(Object.values(l)[0])
            const mappedObj: UploadImageData = {
              fileName: key,
              gatherTownUrl: value
            }
            return mappedObj
          })
          const newUploadedImages = currentSpaces[selectedSpaceIndex].uploadedImages.concat(newLinks)
          currentSpaces[selectedSpaceIndex] = {
            ...currentSpaces[selectedSpaceIndex],
            uploadedImages: newUploadedImages
          }
          dispatch({ type: ActionType.SET_SPACES, payload: currentSpaces })
          dispatch({ type: ActionType.SELECT_SPACE, payload: currentSpaces[selectedSpaceIndex] })
        })
        .catch(err => { throw new Error(err) })
    }
  }

  const uploadFiles = async (files: FileList): Promise<Array<{
    [x: string]: unknown
  }>> => {
    const imageLinks = (
      await Promise.all(
        Array.from(files).map(async (file) => {
          return {
            [file.name]: await new Promise((resolve, reject) => {
              var reader = new FileReader()
              reader.onload = () => {
                fetch('/uploadImageData',
                  {
                    method: 'POST',
                    body: JSON.stringify({
                      bytes: reader.result,
                      spaceId: state.selected?.spaceId
                    }),
                    headers: { 'Content-Type': 'application/json' }
                  }).then(async res => await res.text()).then(resolve).catch(reject)
              }
              reader.readAsDataURL(file)
            })
          }
        })
      )
    )
    return imageLinks
  }

  const copyUrlToClipBoard = async (url: URL): Promise<void> => {
    try {
      navigator.clipboard.writeText(url.toString())
      setCopyNotificaiton(true)
      setOpenNotification(true)
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleNotificationClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string): void => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNotification(false)
  }

  const findSpaceIndex = (spaces: SpaceInfo[], selectedSpace: SpaceInfo | null): number => {
    const index = spaces.findIndex(s => s.spaceId === selectedSpace?.spaceId && s.mapId === selectedSpace?.mapId)
    if (index === -1) {
      throw new Error('Selected space not found in list of spaces')
    }
    return index
  }

  const deleteUrlFromLocalStorage = (fileName: string): void => {
    const currentSpaces: SpaceInfo[] = JSON.parse(localStorage.getItem('spaces') ?? '[]')
    const selectedSpaceIndex = findSpaceIndex(currentSpaces, state.selected)
    const newUploadedImages = currentSpaces[selectedSpaceIndex].uploadedImages.filter(u => u.fileName !== fileName)
    currentSpaces[selectedSpaceIndex] = {
      ...currentSpaces[selectedSpaceIndex],
      uploadedImages: newUploadedImages
    }
    dispatch({ type: ActionType.SET_SPACES, payload: currentSpaces })
    dispatch({ type: ActionType.SELECT_SPACE, payload: currentSpaces[selectedSpaceIndex] })
    setCopyNotificaiton(false)
    setOpenNotification(true)
  }

  const DataTable = (): JSX.Element => {
    return (
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ width: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {state.selected?.uploadedImages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.fileName}>
                    <TableCell key={columns[0].id} align={columns[0].align}>
                      <Button>
                        <FileCopyIcon onClick={async () => await copyUrlToClipBoard(row.gatherTownUrl)} />
                      </Button>
                    </TableCell>
                    <TableCell key={columns[1].id} align={columns[1].align}>
                      <Button>
                        <DeleteIcon onClick={() => deleteUrlFromLocalStorage(row.fileName)} />
                      </Button>
                    </TableCell>
                    <TableCell key={columns[2].id} align={columns[2].align}>
                      {row.fileName}
                    </TableCell>
                    <TableCell key={columns[3].id} align={columns[3].align}>
                      {row.gatherTownUrl.toString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={state.selected?.uploadedImages.length as number}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    )
  }

  return (
    <>
      <Container>
        <Typography variant='h5'>Upload Image to Gather Town</Typography>
        <p>If you want to use your own images for elements of the space; upload them here, copy the image URL and put it in the desired fields.</p>
        <p>Upload images to be used for the space:</p>
        <p><b>{state.selected?.spaceId}</b></p>
        <input
          accept='image'
          className={classes.input}
          id='contained-button-file'
          multiple
          type='file'
          name='file'
          onChange={changeHandler}
        />
        <label htmlFor='contained-button-file'>
          <Button
            size='small' variant='contained' color='primary' component='span'
            style={{ float: 'right' }}
          >
            Upload local image/s&nbsp;<PublishIcon />
          </Button>
        </label>
        <DataTable />
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={openNotification}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={copyNotification ? 'Copied to Clipboard!' : 'URL deleted from local storage'}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleNotificationClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      />
    </>
  )
}

export default UploadImageContainer
