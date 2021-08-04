import { useEffect, useState, useContext, useCallback } from 'react'
import { Context } from '../Store/Store'
import { MapData, Portal, ExternalUrlPortal, NewPortal, TargetExternalUrl, InternalMapPortal, TargetInternalMap } from '../interfaces/mapData'
import SpaceInfo from '../interfaces/SpaceInfo'
import { ActionType } from '../Store/Reducer'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, Tooltip, AppBar, Toolbar, Tabs, Tab, Box, Typography } from '@material-ui/core'
import TabbedTable from './TabbedTable'

const mapDataSchema = require('./mapDataSchema.json')

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '80vw'
  },
  tabStyle: {
    marginRight: theme.spacing(2)
  },
  appBarButtons: {
    marginLeft: '5vw'
  }
}))

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel (props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const Table = (props: { setUploadImagePanelSelected: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {
  const { setUploadImagePanelSelected } = props
  const { content, tabStyle, appBarButtons } = useStyles()
  const { state, dispatch } = useContext(Context)

  const [data, setData] = useState<MapData | string>('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const getSpace = async (apiKey: string, spaceId: string, mapId: string): Promise<any> => {
    const response = await fetch(`/getSpace?${new URLSearchParams(
      {
        apiKey: apiKey,
        spaceId: spaceId,
        mapId: mapId
      }).toString()}`)
    const text = await response.text()
    try {
      const parsedText = await JSON.parse(text)
      return parsedText
    } catch (err) {
      return text
    }
  }

  const reshapeDataForForm = (data: MapData): MapData => {
    data.objects.forEach((o) => {
      o.distThreshold = typeof o.distThreshold === 'string' ? parseInt(o.distThreshold) : o.distThreshold
    })
    data.portals.forEach((p: Portal) => {
      if ((p as ExternalUrlPortal).targetUrl != null) {
        (p as NewPortal<TargetExternalUrl>).targetMapOrUrl = { targetUrl: (p as ExternalUrlPortal).targetUrl }
        delete (p as InternalMapPortal).targetX
        delete (p as InternalMapPortal).targetY
        delete (p as InternalMapPortal).targetMap
      } else {
        (p as NewPortal<TargetInternalMap>).targetMapOrUrl = {
          targetX: (p as InternalMapPortal).targetX,
          targetY: (p as InternalMapPortal).targetY,
          targetMap: (p as InternalMapPortal).targetMap
        }
        delete (p as ExternalUrlPortal).targetUrl
      }
    })
    return data
  }

  const backupJson = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault()
    const link = document.createElement('a')
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
    link.setAttribute(
      'download',
      `${state.selected?.spaceId ?? 'nullSpaceId'} - ${state.selected?.mapId ?? 'nullMapId'}.json`
    )
    document.body.appendChild(link)
    link.click()
  }

  function a11yProps (index: number): {
    id: string
    'aria-controls': string
  } {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }
  const [value, setValue] = useState(0)
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue)
  }

  const ShowData = (props: { selected: SpaceInfo | null, loading: boolean, data: string | MapData, apiError: string }): JSX.Element => {
    const { data, apiError, loading, selected } = props
    const textColor = '#F0FFFF'

    if (selected == null) {
      return <h1 style={{ color: textColor }}>Select a space to be shown it's data</h1>
    }

    if (apiError !== '') {
      return (<h1 style={{ color: 'red' }}>Error: {apiError}</h1>)
    } else {
      const formData = typeof data !== 'string' && !loading && reshapeDataForForm(data)
      return loading ? <h1 style={{ color: textColor }}>Loading...</h1>
        : (<>
          {!!formData &&
            <main className={content}>
              <AppBar position='static'>
                <Toolbar>
                  <Tabs
                    variant='scrollable'
                    scrollButtons='auto'
                    className={tabStyle}
                    value={value}
                    onChange={handleChange}
                    aria-label='simple tabs'
                  >
                    <Tab label='General' {...a11yProps(0)} />
                    <Tab label='Map Objects' {...a11yProps(1)} />
                    <Tab label='Spawns' {...a11yProps(2)} />
                    <Tab label='Portals' {...a11yProps(3)} />
                    <Tab label='Private Area' {...a11yProps(4)} />
                    <Tab label='Spotlight' {...a11yProps(5)} />
                  </Tabs>
                  <Box className={appBarButtons}>
                    <Tooltip title='Backup data from Gather Town server to JSON file'>
                      <Button
                        onClick={backupJson}
                        variant='contained'
                        color='primary'
                      >
                        Backup to file
                      </Button>
                    </Tooltip>
                    <Tooltip title='Upload Images for this Space'>
                      <Button
                        onClick={() => setUploadImagePanelSelected(true)}
                        variant='contained'
                        color='primary'
                      >
                        Manage Uploaded Images
                      </Button>
                    </Tooltip>
                  </Box>
                </Toolbar>
              </AppBar>
              <TabPanel value={value} index={0}>
                <TabbedTable mapDataSchema={mapDataSchema} mapDataUISchema={require('./UIschema/GeneralUISchema.json')} mapData={formData} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TabbedTable mapDataSchema={mapDataSchema} mapDataUISchema={require('./UIschema/ObjectsUISchema.json')} mapData={formData} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <TabbedTable mapDataSchema={mapDataSchema} mapDataUISchema={require('./UIschema/SpawnsUISchema.json')} mapData={formData} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <TabbedTable mapDataSchema={mapDataSchema} mapDataUISchema={require('./UIschema/PortalsUISchema.json')} mapData={formData} />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <TabbedTable mapDataSchema={mapDataSchema} mapDataUISchema={require('./UIschema/PrivateAreaUISchema.json')} mapData={formData} />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <TabbedTable mapDataSchema={mapDataSchema} mapDataUISchema={require('./UIschema/SpotlightUISchema.json')} mapData={formData} />
              </TabPanel>
              <br />
            </main>}
        </>
        )
    }
  }

  const setSpaceSuccess = useCallback((success: boolean) => {
    const settingSpace = state.spaces.filter(s => s.spaceId === state.selected?.spaceId && s.mapId === state.selected.mapId)[0]
    settingSpace.success = success
    state.spaces.splice(state.spaces.findIndex(s => s === state.selected), 1)
    state.spaces.push(settingSpace)
    dispatch({ type: ActionType.SET_SPACES, payload: state.spaces })
  }, [dispatch, state.selected, state.spaces])

  useEffect(() => {
    let isMounted = true
    const fetchData = async (): Promise<void> => {
      if (state.selected != null) {
        setLoading(true)
        try {
          const body: MapData | string = await getSpace(state.apiKey, state.selected.spaceId, state.selected.mapId)
          if (typeof body === 'string') {
            setApiError(body)
            setSpaceSuccess(false)
          } else {
            setApiError('')
            setSpaceSuccess(true)
            isMounted && setData(body)
          }
        } catch (err) {
          throw new Error(err)
        }
        setLoading(false)
      }
    }
    void fetchData()

    return () => {
      isMounted = false
    }
  }, [dispatch, state.apiKey, state.selected, state.spaces, setSpaceSuccess])

  return (
    <ShowData selected={state.selected} loading={loading} data={data} apiError={apiError} />
  )
}

export default Table
