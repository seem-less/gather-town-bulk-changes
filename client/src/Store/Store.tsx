import { createContext, useReducer } from 'react'
import Reducer from './Reducer'
import ConfigState from '../interfaces/ConfigState'

const initialState = {
  spaces: JSON.parse(localStorage.getItem('spaces') ?? '[]'),
  apiKey: (localStorage.getItem('apikey') ?? ''),
  selected: null
}

const Store: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

export const Context = createContext<{
  state: ConfigState
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null
})
export default Store
