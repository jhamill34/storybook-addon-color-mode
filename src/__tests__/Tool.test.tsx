import React from 'react'
import { render } from '@testing-library/react'
import { ColorModeTool } from '../Tool'

/**
 * Storybook Components require a theme provider
 * to provide props to styled components in emotion.
 */
import { ThemeProvider, convert } from '@storybook/theming'
import { ColorModeChannel } from '../models'

/**
 * Mock out the useAddonState and useParameter
 * so we don't need to worry about not having
 * the context created from `useStorybookApi()`
 */

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
