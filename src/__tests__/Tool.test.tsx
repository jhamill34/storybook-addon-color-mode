import React from 'react'
import { render } from '@testing-library/react'
import { ColorModeTool } from '../Tool'
import { ColorModeChannel } from '../models'

/**
 * Storybook Components require a theme provider
 * to provide props to styled components in emotion.
 */
import { ThemeProvider, convert } from '@storybook/theming'

/**
 * Mock out the useAddonState and useParameter
 * so we don't need to worry about not having
 * the context created from `useStorybookApi()`
 */
const mockSetState = jest.fn()
jest.mock('@storybook/api', () => ({
  ...jest.requireActual('@storybook/api'),
  useAddonState: jest.fn(() => {
    return [{ currentId: 'default' }, mockSetState]
  }),
  useParameter: jest.fn(() => {
    return { modes: {} }
  }),
}))

describe('ColorModeTool', () => {
  let mockChannel: ColorModeChannel

  beforeEach(() => {
    mockChannel = {
      emit: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }
  })

  test('renders initial styles properly', () => {
    const { container } = render(
      <ThemeProvider theme={convert()}>
        <ColorModeTool channel={mockChannel} />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
