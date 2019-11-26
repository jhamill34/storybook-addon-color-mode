import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider, convert } from '@storybook/theming'
import Channel from '@storybook/channels'
import { ColorModeTool } from '../components/ColorModeTool'

type ColorModeChannel = Pick<Channel, 'emit' | 'addListener' | 'removeListener'>

const mockSetState = jest.fn()
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

jest.mock('@storybook/api', () => ({
  ...jest.requireActual('@storybook/api'),
  useAddonState: jest.fn(() => {
    return [{ currentIndex: 0 }, mockSetState]
  }),
  useParameter: jest.fn(() => {
    return { modes: {} }
  }),
}))

describe('ColorModeTool', () => {
  test('renders initial styles properly', () => {
    const { container } = render(
      <ThemeProvider theme={convert()}>
        <ColorModeTool />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
