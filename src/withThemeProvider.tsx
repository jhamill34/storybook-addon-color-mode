import React from 'react'
import addons, {
  makeDecorator,
  MakeDecoratorResult,
  StoryWrapper,
} from '@storybook/addons'
import { Theme } from 'theme-ui'
import { ColorModeObserver } from './components/ColorModeObserver'

export const makeWrapperWithTheme = (theme: Theme): StoryWrapper => (
  story,
  context
): JSX.Element => {
  const channel = addons.getChannel()

  return (
    <ColorModeObserver theme={theme} channel={channel}>
      {story(context)}
    </ColorModeObserver>
  )
}

export const withThemeProvider = (theme: Theme): MakeDecoratorResult =>
  makeDecorator({
    name: 'withThemeProvider',
    parameterName: 'modes',
    skipIfNoParametersOrOptions: false,
    wrapper: makeWrapperWithTheme(theme),
  })
