import React, { useState } from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import Channel from '@storybook/channels'
import { useColorModeAddonState } from '../hooks/useColorModeAddonState'
import { ColorModeItem } from '../models'

type ColorModeChannel = Pick<Channel, 'emit' | 'addListener' | 'removeListener'>

jest.mock('@storybook/api', () => ({
  useAddonState: jest.fn((id, initialState) =>
    useState(Object.assign({ id }, initialState))
  ),
}))

jest.mock('@storybook/addons', () => ({
  addons: {
    getChannel: (): ColorModeChannel => ({
      emit: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }),
  },
}))

const mockList: ColorModeItem[] = [
  { id: 'default', name: 'Default' },
  { id: 'dark', name: 'Darkness' },
  { id: 'random', name: 'Super Cool' },
]

/**
 * Fake component to test useColorModeAddonState
 */
function MockColorMode(): React.ReactElement {
  const {
    currentIndex,
    setIndex,
    nextIndex,
    prevIndex,
  } = useColorModeAddonState(mockList, 0)

  return (
    <div>
      <h1 data-testid="header">{mockList[currentIndex].name}</h1>
      <button data-testid="set" onClick={(): void => setIndex(2)}>
        Set
      </button>
      <button data-testid="next" onClick={(): void => nextIndex()}>
        Next
      </button>
      <button data-testid="prev" onClick={(): void => prevIndex()}>
        Prev
      </button>
    </div>
  )
}

/**
 * TODO: Render and trigger button clicks and observe the
 * output from the header
 * Things to keep in mind:
 *  - Make sure it wraps around for both next and prev
 *  - What if setIndex is sent a value beyond 9?
 */
describe('useColorModeAddonState', () => {
  it('should initially render with text as Default', () => {
    const { getByTestId } = render(<MockColorMode />)

    const header = getByTestId('header')
    expect(header.textContent).toEqual('Default')
  })

  it('should go to the next mode when nextIndex is called', () => {
    const { getByTestId } = render(<MockColorMode />)

    const header = getByTestId('header')
    const button = getByTestId('next')

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Darkness')
  })

  it('should wrap back around when nextIndex is called list.length times', () => {
    const { getByTestId } = render(<MockColorMode />)

    const header = getByTestId('header')
    const button = getByTestId('next')

    act(() => {
      fireEvent.click(button)
    })

    act(() => {
      fireEvent.click(button)
    })

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Default')
  })

  it('should wrap back to the end when prevIndex is called', () => {
    const { getByTestId } = render(<MockColorMode />)

    const header = getByTestId('header')
    const button = getByTestId('prev')

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Super Cool')
  })

  it('should wrap back to the end when prevIndex is called', () => {
    const { getByTestId } = render(<MockColorMode />)

    const header = getByTestId('header')
    const button = getByTestId('prev')

    act(() => {
      fireEvent.click(button)
    })

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Darkness')
  })

  it('should jump to index 2 by triggering set index', () => {
    const { getByTestId } = render(<MockColorMode />)

    const header = getByTestId('header')
    const button = getByTestId('set')

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Super Cool')
  })
})
