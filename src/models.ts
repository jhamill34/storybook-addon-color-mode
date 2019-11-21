export interface ColorModeItem {
  /**
   * Key referenced in theme-ui's color mode
   */
  id: string

  /**
   * Display Name for the mode
   */
  name: string
}

export interface ColorMode {
  /**
   * Display name for the mode
   */
  name: string
}

export interface ColorModeMap {
  /**
   * Map theme-ui keys to a color mode object
   */
  [id: string]: ColorMode
}

export type ColorModeAddonState = {
  /**
   * The currently selected color mode's index
   */
  currentIndex: number
}

export type ColorModeAddonParams = {
  /**
   * All color modes provided
   */
  modes: ColorModeMap

  /**
   * The default mode that should
   * be rendered initially
   */
  defaultMode: string
}

export interface ColorModeLink {
  /**
   * Key referenced theme-ui's color mode object
   */
  id: string

  /**
   * Display name of the color mode
   */
  title: string

  /**
   * Action to take when the mode is selected
   */
  onClick: () => void
}

// TODO: Channel model should be updatedj

export type Listener<T> = (event: T) => void

export interface ColorModeChannel {
  emit<T>(event: string, args: T): void
  addListener<T>(event: string, listener: Listener<T>): void
  removeListener<T>(event: string, listener: Listener<T>): void
}
