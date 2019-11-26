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

type EBProps = {
  children: React.ReactNode
}

type EBState = {
  message: string | null
}

class MockErrorBoundary extends React.Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props)

    this.state = {
      message: null,
    }
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { message: error.message }
  }

  render(): React.ReactNode {
    if (this.state.message) {
      return <div>{this.state.message}</div>
    }

    return this.props.children
  }
}

type Props = {
  jumpTo: number
  defaultIndex?: number
}

/**
 * Fake component to test useColorModeAddonState
 */
function MockColorMode({
  jumpTo,
  defaultIndex = 0,
}: Props): React.ReactElement {
  const {
    currentIndex,
    setIndex,
    nextIndex,
    prevIndex,
  } = useColorModeAddonState(mockList, defaultIndex)
  const [error, setError] = useState<Error | null>(null)

  return (
    <div>
      <h1 data-testid="header">{mockList[currentIndex].name}</h1>
      {error && <h2 data-testid="error">{error.message}</h2>}
      <button
        data-testid="set"
        onClick={(): void => {
          try {
            setIndex(jumpTo)
          } catch (e) {
            setError(e)
          }
        }}
      >
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

describe('useColorModeAddonState', () => {
  it('should initially render with text as Default', () => {
    const { getByTestId } = render(<MockColorMode jumpTo={2} />)

    const header = getByTestId('header')
    expect(header.textContent).toEqual('Default')
  })

  it('should go to the next mode when nextIndex is called', () => {
    const { getByTestId } = render(<MockColorMode jumpTo={2} />)

    const header = getByTestId('header')
    const button = getByTestId('next')

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Darkness')
  })

  it('should wrap back around when nextIndex is called list.length times', () => {
    const { getByTestId } = render(<MockColorMode jumpTo={2} />)

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
    const { getByTestId } = render(<MockColorMode jumpTo={2} />)

    const header = getByTestId('header')
    const button = getByTestId('prev')

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Super Cool')
  })

  it('should wrap back to the end when prevIndex is called', () => {
    const { getByTestId } = render(<MockColorMode jumpTo={2} />)

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
    const { getByTestId } = render(<MockColorMode jumpTo={2} />)

    const header = getByTestId('header')
    const button = getByTestId('set')

    act(() => {
      fireEvent.click(button)
    })

    expect(header.textContent).toEqual('Super Cool')
  })

  it('should throw an error if index is beyond the length of the list', () => {
    const { getByTestId, queryByTestId } = render(<MockColorMode jumpTo={7} />)

    const button = getByTestId('set')

    expect(queryByTestId('error')).toBeNull()

    act(() => {
      fireEvent.click(button)
    })

    const error = getByTestId('error')
    expect(error.textContent).toEqual('Index out of bounds: (7)')
  })

  it('should throw an error if index is negative', () => {
    const { getByTestId, queryByTestId } = render(<MockColorMode jumpTo={-1} />)

    const button = getByTestId('set')

    expect(queryByTestId('error')).toBeNull()

    act(() => {
      fireEvent.click(button)
    })

    const error = getByTestId('error')
    expect(error.textContent).toEqual('Index out of bounds: (-1)')
  })

  describe('Error Boundaries', () => {
    // This is okay because we render the error message
    // in the DOM anyway, so if we get an error we don't
    // expect it will end up in our expect statement
    let spy: jest.SpyInstance
    beforeEach(() => {
      spy = jest.spyOn(console, 'error')
      spy.mockImplementation(() => {})
    })

    afterEach(() => {
      spy.mockRestore()
    })

    it('should throw an error if the default index is out of bounds', () => {
      const { container } = render(
        <MockErrorBoundary>
          <MockColorMode jumpTo={0} defaultIndex={3} />
        </MockErrorBoundary>
      )

      expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          Default Index out of Bounds: (3)
        </div>
      </div>
    `)
    })

    it('should throw an error if the default index less than 0', () => {
      const { container } = render(
        <MockErrorBoundary>
          <MockColorMode jumpTo={0} defaultIndex={-1} />
        </MockErrorBoundary>
      )

      expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          Default Index out of Bounds: (-1)
        </div>
      </div>
    `)
    })
  })
})
