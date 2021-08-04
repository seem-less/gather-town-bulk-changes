import { UploadImageData } from '../Table/UploadImageContainer'
export default interface SpaceInfo {
  spaceId: string
  mapId: string
  success: boolean
  uploadedImages: UploadImageData[]
}
