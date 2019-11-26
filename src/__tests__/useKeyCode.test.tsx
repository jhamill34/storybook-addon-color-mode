import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Channel, { Listener } from '@storybook/channels'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { useKeyCode, createKeyCodeHandler } from '../hooks/useKeyCode'
import { Key } from '../keycodes'
import { KeyBinding } from '../models'

type ColorModeChannel = Pick<Channel, 'emit' | 'addListener' | 'removeListener'>

interface Registry {
  [key: string]: Listener
}

const mockAddListener = jest.fn()
const mockRemoveListener = jest.fn()

jest.mock('@storybook/addons', () => ({
  addons: {
    getChannel: (): ColorModeChannel => ({
      emit: jest.fn(),
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
    }),
  },
}))

const mockPrev = jest.fn()
const mockNext = jest.fn()
const mockSet = jest.fn()

const mockKeyBindings: KeyBinding = {
  prefix: {
    ctrlKey: true,
    altKey: true,
    shiftKey: false,
  },
  previousTrigger: Key.LeftArrow,
  nextTrigger: Key.RightArrow,
}

/**
 * Fake component to test useKeyCode
 */
function MockKeyCode(): React.ReactElement {
  const keyboardHandler = createKeyCodeHandler(
    mockPrev,
    mockNext,
    mockSet,
    mockKeyBindings
  )
  useKeyCode(keyboardHandler)
  return <div>MockKeyCode</div>
}

describe('Color Mode Hooks', () => {
  let registry: Registry

  describe('Storybook Channel', () => {
    beforeEach(() => {
      registry = {}

      mockNext.mockReset()
      mockPrev.mockReset()
      mockSet.mockReset()
      mockAddListener.mockReset()
      mockRemoveListener.mockReset()

      mockAddListener.mockImplementation((event, callback) => {
        registry[event] = callback
      })
    })

    it('should register a listener when the component is mounted', () => {
      render(<MockKeyCode />)

      expect(mockAddListener).toHaveBeenCalledTimes(1)
    })

    it('should unregister a listener when the component is unmounted', () => {
      const { unmount } = render(<MockKeyCode />)

      unmount()

      expect(mockAddListener).toHaveBeenCalledTimes(1)
      expect(mockRemoveListener).toHaveBeenCalledTimes(1)
    })

    it('should only call next index if event is emitted and <prefix> + RightArrow', () => {
      render(<MockKeyCode />)
      registry[PREVIEW_KEYDOWN]({
        event: {
          ctrlKey: true,
          altKey: true,
          shiftKey: false,
          keyCode: Key.RightArrow,
        },
      })

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })

    it('should only call prev index if event is emitted and <prefix> + LeftArrow', () => {
      render(<MockKeyCode />)
      registry[PREVIEW_KEYDOWN]({
        event: {
          ctrlKey: true,
          altKey: true,
          shiftKey: false,
          keyCode: Key.LeftArrow,
        },
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })

    it('should only call set index if event is emitted and <prefix> + <number>', () => {
      render(<MockKeyCode />)
      registry[PREVIEW_KEYDOWN]({
        event: {
          ctrlKey: true,
          altKey: true,
          shiftKey: false,
          keyCode: Key.One,
        },
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledWith(1)
    })

    it('should not call anything if the wrong prefix is set', () => {
      render(<MockKeyCode />)
      registry[PREVIEW_KEYDOWN]({
        event: {
          ctrlKey: false,
          altKey: true,
          shiftKey: false,
          keyCode: Key.One,
        },
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })

    it('should not call anything if prefix is set but wrong key is pressed', () => {
      render(<MockKeyCode />)
      registry[PREVIEW_KEYDOWN]({
        event: {
          ctrlKey: true,
          altKey: true,
          shiftKey: false,
          keyCode: Key.A,
        },
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })
  })

  describe('Document Keydown Event', () => {
    beforeEach(() => {
      mockNext.mockReset()
      mockPrev.mockReset()
      mockSet.mockReset()
    })

    it('should call next when <prefix> and Right Arrow is triggered on document', () => {
      render(<MockKeyCode />)
      fireEvent.keyDown(document, {
        ctrlKey: true,
        altKey: true,
        shiftKey: false,
        keyCode: Key.RightArrow,
      })

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })

    it('should call prev when <prefix> and Left Arrow is triggered on document', () => {
      render(<MockKeyCode />)
      fireEvent.keyDown(document, {
        ctrlKey: true,
        altKey: true,
        shiftKey: false,
        keyCode: Key.LeftArrow,
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })

    it('should call set index when <prefix> and number is triggered on document', () => {
      render(<MockKeyCode />)
      fireEvent.keyDown(document, {
        ctrlKey: true,
        altKey: true,
        shiftKey: false,
        keyCode: Key.Two,
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledWith(2)
    })

    it('should not call anything if the wrong prefix is set', () => {
      render(<MockKeyCode />)
      fireEvent.keyDown(document, {
        ctrlKey: false,
        altKey: true,
        shiftKey: false,
        keyCode: Key.Two,
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })

    it('should not call anything correct prefix is set but wrong key is pressed', () => {
      render(<MockKeyCode />)
      fireEvent.keyDown(document, {
        ctrlKey: true,
        altKey: true,
        shiftKey: false,
        keyCode: Key.A,
      })

      expect(mockNext).toHaveBeenCalledTimes(0)
      expect(mockPrev).toHaveBeenCalledTimes(0)
      expect(mockSet).toHaveBeenCalledTimes(0)
    })
  })
})
