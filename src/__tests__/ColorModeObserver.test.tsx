import React from 'react'
import { render, act } from '@testing-library/react'
import Channel from '@storybook/channels'
import { ColorModeObserver } from '../components/ColorModeObserver'
import { CHANGE_MODE } from '../constants'

type ColorModeChannel = Pick<Channel, 'emit' | 'addListener' | 'removeListener'>

interface Registry {
  [key: string]: (mode: string) => void
}

const mockSetMode = jest.fn()
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

describe('ColorModeObserver', () => {
  let registry: Registry

  beforeEach(() => {
    registry = {}

    mockSetMode.mockReset()
    mockAddListener.mockReset()
    mockRemoveListener.mockReset()

    mockAddListener.mockImplementation((event, callback) => {
      registry[event] = callback
    })
  })

  test('renders initial styles properly', () => {
    const { container } = render(
      <ColorModeObserver initialMode="dark" theme={{}}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(container).toMatchSnapshot()
  })

  test('a listener should be added upon mounting', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(mockAddListener).toBeCalledTimes(1)
  })

  test('a listener should be removed upon unmounting', () => {
    const { unmount } = render(
      <ColorModeObserver initialMode="dark" theme={{}}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    unmount()

    expect(mockAddListener).toBeCalledTimes(1)
    expect(mockRemoveListener).toBeCalledTimes(1)
  })

  test('first render should add a default mode and mark as dirty', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(document.body.classList).toContain('theme-ui-dark')
    expect(document.body.classList).toContain('dirty-color-mode-addon')
  })

  test('emit CHANGE_MODE should set the class of the body element', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    act(() => {
      registry[CHANGE_MODE]('default')
    })

    expect(document.body.classList).toContain('theme-ui-default')
    expect(document.body.classList).not.toContain('theme-ui-dark')
    expect(document.body.classList).toContain('dirty-color-mode-addon')
  })

  test('emit CHANGE_MODE should remove the class of the previous mode', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    act(() => {
      registry[CHANGE_MODE]('default')
    })

    act(() => {
      registry[CHANGE_MODE]('dark')
    })

    expect(document.body.classList).toContain('theme-ui-dark')
    expect(document.body.classList).not.toContain('theme-ui-default')
    expect(document.body.classList).toContain('dirty-color-mode-addon')
  })
})
