import { useState, useContext } from 'react'
import { Context } from '../Store/Store'
import FormValues from '../interfaces/FormValues'
import SpaceInfo from '../interfaces/SpaceInfo'
import { ActionType } from '../Store/Reducer'
import { ModalTypes } from './Main'

const pushNewConfig = (type: ModalTypes, formValues: FormValues, dispatch: React.Dispatch<any>): void => {
  const spaces: SpaceInfo[] = JSON.parse(localStorage.getItem('spaces') ?? '[]')
  switch (type) {
    case ModalTypes.SPACE:
      const spaceIdVals = formValues.spaceId.split('/')
      const apiReadyspaceId = `${spaceIdVals[0]}\\${spaceIdVals[1]}`
      const newSpace: SpaceInfo = {
        spaceId: apiReadyspaceId,
        mapId: formValues.mapId,
        success: true,
        uploadedImages: []
      }
      spaces.push(newSpace)
      dispatch({ type: ActionType.SET_SPACES, payload: spaces })
      dispatch({ type: ActionType.SELECT_SPACE, payload: newSpace })
      break
    case ModalTypes.API:
      dispatch({ type: ActionType.SET_API_KEY, payload: formValues.apiKey })
      break
  }
}

const useForm = (validate: (formValues: FormValues, type: ModalTypes) => FormValues) => {
  const { dispatch } = useContext(Context)

  const [formValues, setFormValues] = useState<FormValues>({ spaceId: '', mapId: '', apiKey: '' })
  const [errors, setErrors] = useState<FormValues>({ spaceId: '', mapId: '', apiKey: '' })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, type: ModalTypes, confirmButtonAction: () => void): void => {
    if (!!event) event.preventDefault()
    setErrors(validate(formValues, type))
    if (Object.values(validate(formValues, type)).every(e => e === '')) {
      pushNewConfig(type, formValues, dispatch)
      confirmButtonAction()
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist()
    setFormValues(formValues => ({ ...formValues, [event.target.name]: event.target.value }))
  }

  return {
    handleChange,
    handleSubmit,
    formValues,
    errors
  }
}

export default useForm
