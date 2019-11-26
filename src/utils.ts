import { ColorModeItem, ColorModeMap, ColorModeLink } from './models'
import { DEFAULT_MODE_ID, DIRTY_CLASS } from './constants'
import { IndexSetter } from './hooks/useColorModeAddonState'

/**
 * Internally used default mode. This mode is
 * added regardless of what is found in the parameters.
 */
const defaultMode: ColorModeItem = {
  id: DEFAULT_MODE_ID,
  name: 'Default',
}

/**
 * Converts a color mode map to a list
 * @param map - Provided color mode map
 * @returns resulting flattend map
 */
export function toList(map: ColorModeMap): ColorModeItem[] {
  return [
    defaultMode,
    ...Object.entries(map).map(
      ([id, item]): ColorModeItem => ({
        id,
        ...item,
      })
    ),
  ]
}

/**
 * Converts a list of color modes into usable links for the storybook toolbar.
 * @param  items - color mode items list (from toList).
 * @param  currentIndex - The currently selected mode.
 * @param  set - How the modes will get selected.
 * @param  close - Callback for when the link is closed.
 * @returns Mapped list of links used by storybook.
 */
export function toLinks(
  items: ColorModeItem[],
  currentIndex: number,
  set: IndexSetter,
  close: () => void
): ColorModeLink[] {
  return items.map(
    (i: ColorModeItem, index: number): ColorModeLink => ({
      id: i.id,
      title: i.name,
      onClick: (): void => {
        if (currentIndex !== index) {
          set(index)
        }
        close()
      },
    })
  )
}

/**
 * Determines if the element is dirty (been used)
 * from this addon. This is done by adding a class
 * @param element - Provided element
 * @returns result if element is "dirty"
 */
export function isElementDirty(element: HTMLElement): boolean {
  return element.classList.contains(DIRTY_CLASS)
}

/**
 * Marks a given element as dirty by adding a CSS class.
 * @param element - provided element
 */
export function makeDirty(element: HTMLElement): void {
  element.classList.add(DIRTY_CLASS)
}

/**
 * A given html element is given a theme-ui class
 * to indicate the currently active color mode.
 * @param element - root element for theme-ui
 * @param newMode - the mode to set
 */
export function setThemeUIClass(element: HTMLElement, newMode: string): void {
  const oldClassName = element.className
  const themeUIRegex = /theme-ui-[\w-]+/
  const newClassName = `theme-ui-${newMode}`

  if (themeUIRegex.test(oldClassName)) {
    element.className = oldClassName.replace(themeUIRegex, newClassName)
  } else {
    element.classList.add(newClassName)
  }
}
