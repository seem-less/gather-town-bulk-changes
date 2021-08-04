import SpaceInfo from './SpaceInfo'
export default interface ConfigState {
  spaces: SpaceInfo[]
  apiKey: string
  selected: null|SpaceInfo
}
