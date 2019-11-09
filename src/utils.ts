import { ColorModeItem, ColorModeMap, ColorModeLink } from './models'
import { DEFAULT_MODE_ID } from './constants'

const defaultMode: ColorModeItem = {
  id: DEFAULT_MODE_ID,
  name: 'Default',
}

export const toList = (map: ColorModeMap): Array<ColorModeItem> => {
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

export const toLinks = (
  items: Array<ColorModeItem>,
  currentId: string,
  set: (id: string) => void,
  close: () => void
): Array<ColorModeLink> => {
  return items.map(
    (i: ColorModeItem): ColorModeLink => ({
      id: i.id,
      title: i.name,
      onClick: (): void => {
        if (i.id !== currentId) {
          set(i.id)
        }
        close()
      },
    })
  )
}
