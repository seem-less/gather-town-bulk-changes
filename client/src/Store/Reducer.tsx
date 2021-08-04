import ConfigState from '../interfaces/ConfigState'
import SpaceInfo from '../interfaces/SpaceInfo'

export enum ActionType {
  SET_SPACES = 'SET_SPACES',
  SET_API_KEY = 'SET_API_KEY',
  SELECT_SPACE = 'SELECT_SPACE',
}

type Action =
    | {
      type: ActionType.SET_SPACES
      payload: SpaceInfo[]
    }
    | {
      type: ActionType.SET_API_KEY
      payload: string
    }
    | {
      type: ActionType.SELECT_SPACE
      payload: SpaceInfo
    }

const Reducer = (state: ConfigState, action: Action): ConfigState => {
  switch (action.type) {
    case ActionType.SET_SPACES:
      const newState: ConfigState = {
        ...state,
        spaces: action.payload
      }
      localStorage.setItem('spaces', JSON.stringify(newState.spaces))
      return newState
    case ActionType.SET_API_KEY:
      const newApiKey = {
        ...state,
        apiKey: action.payload
      }
      localStorage.setItem('apikey', JSON.stringify(newApiKey.apiKey))
      return newApiKey
    case ActionType.SELECT_SPACE:
      const selectedSpace = {
        ...state,
        selected: action.payload
      }
      localStorage.setItem('selected', JSON.stringify(selectedSpace.selected))
      return selectedSpace
    default:
      return state
  }
}

export default Reducer
