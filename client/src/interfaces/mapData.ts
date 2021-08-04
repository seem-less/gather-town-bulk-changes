export interface MapData {
  id: string
  useDrawnBG: boolean
  backgroundImagePath: string
  foregroundImagePath: string
  collisions: string
  spawns: Spawn[]
  spaces: Space[]
  assets: any[]
  announcer: Spawn[]
  dimensions: number[]
  objects: MapObject[]
  portals: Portal[]
}

export interface Portal {
  x: number
  y: number
}

export interface InternalMapPortal extends Portal{
  targetX?: number
  targetY?: number
  targetMap?: string
}

export interface ExternalUrlPortal extends Portal{
  targetUrl?: string
}

export interface NewPortal<T> extends Portal {
  targetMapOrUrl?: T
}

export interface TargetInternalMap{
  targetX?: number
  targetY?: number
  targetMap?: string
}

export interface TargetExternalUrl {
  targetUrl?: string
}

interface MapObject {
  id: string
  _name: string
  width: number
  height: number
  scale: number
  x: number
  y: number
  offsetX?: number
  offsetY?: number
  normal: string
  highlighted: string
  color: string
  type: number
  _tags: string[]
  properties: Properties
  orientation: number
  templateId: string
  distThreshold?: string|number
}

interface Properties {
  url: string
  deterministicUrlPrefix?: string
  loading?: string
}

interface Spawn {
  x: number
  y: number
}

interface Space {
  x: number
  y: number
  colored: boolean
  spaceId: string
}
