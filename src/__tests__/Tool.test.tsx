import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider, convert } from '@storybook/theming'
import { ColorModeTool } from '../ColorModeTool'
import { ColorModeChannel } from '../models'

const mockChannel: ColorModeChannel = {
  emit: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}

const mockSetState = jest.fn()

jest.mock('@storybook/api', () => ({
  ...jest.requireActual('@storybook/api'),
  useAddonState: jest.fn(() => {
    return [{ currentIndex: 0 }, mockSetState]
  }),
  useParameter: jest.fn(() => {
    return { modes: {} }
  }),
}))

jest.mock('@storybook/addons', () => ({
  ...jest.requireActual('@storybook/addons'),
  addons: {
    getChannel: (): ColorModeChannel => mockChannel,
  },
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
