export interface ColorModeItem {
  id: string
  name: string
}

export interface ColorMode {
  name: string
}

export interface ColorModeMap {
  [id: string]: ColorMode
}

export type ColorModeAddonState = {
  currentIndex: number
}

export type ColorModeAddonParams = {
  modes: ColorModeMap
  defaultMode: string
}

export interface ColorModeLink {
  id: string
  title: string
  onClick: () => void
}

export type Listener<T> = (event: T) => void

export interface ColorModeChannel {
  emit<T>(event: string, args: T): void
  addListener<T>(event: string, listener: Listener<T>): void
  removeListener<T>(event: string, listener: Listener<T>): void
}
