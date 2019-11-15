import React from 'react'
import { render, act } from '@testing-library/react'
import { ColorModeObserver } from '../components/ColorModeObserver'
import { ColorModeChannel } from '../models'
import { CHANGE_MODE } from '../constants'

const mockSetMode = jest.fn()

interface Registry {
  [key: string]: (mode: string) => void
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
      <ColorModeObserver initialMode="dark" theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(container).toMatchSnapshot()
  })

  test('a listener should be added upon mounting', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(mockChannel.addListener).toBeCalledTimes(1)
  })

  test('a listener should be removed upon unmounting', () => {
    const { unmount } = render(
      <ColorModeObserver initialMode="dark" theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    unmount()

    expect(mockChannel.removeListener).toBeCalledTimes(1)
  })

  test('first render should add a default mode and mark as dirty', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(document.body.classList).toContain('theme-ui-dark')
    expect(document.body.classList).toContain('dirty-color-mode-addon')
  })

  test('emit CHANGE_MODE should set the class of the body element', () => {
    render(
      <ColorModeObserver initialMode="dark" theme={{}} channel={mockChannel}>
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
      <ColorModeObserver initialMode="dark" theme={{}} channel={mockChannel}>
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
