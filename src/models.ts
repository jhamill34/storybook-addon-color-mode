import { Key } from './keycodes'

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

  /**
   *
   */
  bindings: KeyBinding
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

/**
 * Configuration to outline a common keybinding prefix
 * for triggering events.
 */
export type KeyBindingPrefix = {
  /** Set true if Control (^ or Ctrl) Key is part of prefix */
  ctrlKey: boolean

  /** Set true if Alt (or Option) Key is part of prefix */
  altKey: boolean

  /** Set true if Shift Key is part of prefix */
  shiftKey: boolean
}

/**
 * Complete configuration for keybindings
 */
export type KeyBinding = {
  /** See [[KeyBindingPrefix]] */
  prefix: KeyBindingPrefix

  /** Which keycode should trigger going to the next color mode */
  previousTrigger: Key

  /** Which keycode should trigger going to the previous color mode */
  nextTrigger: Key
}
