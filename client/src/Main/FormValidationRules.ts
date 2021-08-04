import FormValues from '../interfaces/FormValues'
import { ModalTypes } from './Main'

export function validate (formValues: FormValues, type: ModalTypes): { spaceId: string, mapId: string, apiKey: string } {
  const errors = { spaceId: '', mapId: '', apiKey: '' }
  if (!formValues.spaceId.includes('/') && type === ModalTypes.SPACE) {
    errors.spaceId = "Space ID should contain a '/'"
  } else {
    errors.spaceId = ''
  }
  return errors
};
