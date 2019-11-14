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
      <ColorModeObserver theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(container).toMatchSnapshot()
  })

  test('a listener should be added upon mounting', () => {
    render(
      <ColorModeObserver theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    expect(mockChannel.addListener).toBeCalledTimes(1)
  })

  test('a listener should be removed upon unmounting', () => {
    const { unmount } = render(
      <ColorModeObserver theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    unmount()

    expect(mockChannel.removeListener).toBeCalledTimes(1)
  })

  test('emit CHANGE_MODE should set the class of the body element', () => {
    render(
      <ColorModeObserver theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    act(() => {
      registry[CHANGE_MODE]('dark')
    })

    expect(document.body.className).toEqual('theme-ui-dark')
  })

  test('emit CHANGE_MODE should remove the class of the previous mode', () => {
    render(
      <ColorModeObserver theme={{}} channel={mockChannel}>
        <h1>This is a test</h1>
      </ColorModeObserver>
    )

    act(() => {
      registry[CHANGE_MODE]('dark')
    })

    act(() => {
      registry[CHANGE_MODE]('default')
    })

    act(() => {
      registry[CHANGE_MODE]('default')
    })

    expect(document.body.className).toEqual('theme-ui-default')
  })
})
