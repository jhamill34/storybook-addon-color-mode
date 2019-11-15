import {
  toList,
  toLinks,
  isElementDirty,
  makeDirty,
  setThemeUIClass,
} from '../utils'
import { ColorModeItem } from '../models'

describe('Utility Functions', () => {
  describe('toList', () => {
    test('contains default item when nothing else is passed', () => {
      const result = toList({})

      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('default')
      expect(result[0].name).toEqual('Default')
    })

    test('contains new mode when provided', () => {
      const result = toList({
        dark: {
          name: 'Darkness',
        },
      })

      expect(result).toHaveLength(2)
      expect(result[1].id).toEqual('dark')
      expect(result[1].name).toEqual('Darkness')
    })
  })

  describe('toLinks', () => {
    let items: Array<ColorModeItem>
    let mockSet: (id: string) => void
    let mockClose: () => void

    beforeEach(() => {
      items = [
        { id: 'default', name: 'Default' },
        { id: 'dark', name: 'Darkness' },
      ]
      mockSet = jest.fn()
      mockClose = jest.fn()
    })

    test('creates an empty list when no items are provided', () => {
      const result = toLinks(items, 'default', mockSet, mockClose)
      expect(result).toHaveLength(2)
      expect(result[1].id).toEqual('dark')
      expect(result[1].title).toEqual('Darkness')
    })

    test('calls the close function when clicked', () => {
      const result = toLinks(items, 'default', mockSet, mockClose)
      result[0].onClick()
      result[1].onClick()
      expect(mockClose).toHaveBeenCalledTimes(2)
    })

    test('calls the set function when current id is not clicked', () => {
      const result = toLinks(items, 'default', mockSet, mockClose)
      result[1].onClick()
      expect(mockSet).toHaveBeenCalledTimes(1)
    })

    test('does not call the set function when the current id is clicked', () => {
      const result = toLinks(items, 'default', mockSet, mockClose)
      result[0].onClick()
      expect(mockSet).not.toHaveBeenCalled()
    })
  })

  describe('isElementDirty/makeDirty', () => {
    test('check for clean element', () => {
      const div = document.createElement('div')

      expect(isElementDirty(div)).toBeFalsy()
    })

    test('check for dirty element', () => {
      const div = document.createElement('div')
      makeDirty(div)

      expect(isElementDirty(div)).toBeTruthy()
    })
  })

  describe('setThemeUIClass', () => {
    test('should set theme if not theme-ui class exists but other classes exist', () => {
      const div = document.createElement('div')
      div.className = 'test-class'

      setThemeUIClass(div, 'dark')

      expect(div.classList).toContain('theme-ui-dark')
    })

    test('should replace theme-ui class if one exists', () => {
      const div = document.createElement('div')
      div.className = 'theme-ui-random test-class'

      setThemeUIClass(div, 'dark')

      expect(div.classList).toContain('theme-ui-dark')
      expect(div.classList).not.toContain('theme-ui-random')
    })
  })
})
