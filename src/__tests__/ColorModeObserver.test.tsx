import React from 'react'
import { render } from '@testing-library/react'
import { ColorModeObserver } from '../components/ColorModeObserver'
import { ColorModeChannel } from '../models'
import { CHANGE_MODE } from '../constants'

const mockSetMode = jest.fn()
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: jest.fn(() => {
    return ['default', mockSetMode]
  }),
}))

interface Registry {
  [key: string]: (...args: any) => void
}

describe('ColorModeObserver', () => {
  let mockChannel: ColorModeChannel
  let registry: Registry

  beforeEach(() => {
    mockSetMode.mockReset()
    registry = {}

    mockChannel = {
      emit: jest.fn(),
      addListener: jest.fn((event, callback) => {
        registry[event] = callback
      }),
      removeListener: jest.fn(),
    }
  })

  test('renders initial styles properly', () => {
    const { container } = render(
      <ColorModeObserver channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(container).toMatchSnapshot()
  })

  test('a listener should be added upon mounting', () => {
    render(
      <ColorModeObserver channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(mockChannel.addListener).toBeCalledTimes(1)
  })

  test('a listener should be removed upon unmounting', () => {
    const { unmount } = render(
      <ColorModeObserver channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    unmount()

    expect(mockChannel.removeListener).toBeCalledTimes(1)
  })

  test('set mode should have been triggered upon emitting the CHANGE_MODE event', () => {
    render(
      <ColorModeObserver channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    // Roughly equiviant to the emit method
    registry[CHANGE_MODE]('dark')

    expect(mockSetMode).toBeCalledTimes(1)
  })

  test('set mode should not be triggered upon emitting the CHANGE_MODE event for the already set mode', () => {
    render(
      <ColorModeObserver channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    // roughly equivilant to the emit method
    registry[CHANGE_MODE]('default')

    expect(mockSetMode).toBeCalledTimes(0)
  })
})
