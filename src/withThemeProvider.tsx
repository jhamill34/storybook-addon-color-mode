import React from 'react'
import addons, {
  makeDecorator,
  MakeDecoratorResult,
  StoryWrapper,
} from '@storybook/addons'
import { Theme } from 'theme-ui'
import { ColorModeObserver } from './components/ColorModeObserver'
import { ColorModeAddonParams } from './models'

export const makeWrapperWithTheme = (theme: Theme): StoryWrapper => (
  story,
  context,
  settings
): JSX.Element => {
  const channel = addons.getChannel()
  const params = settings.parameters as ColorModeAddonParams

  return (
    <ColorModeObserver
      initialMode={params.defaultMode}
      theme={theme}
      channel={channel}
    >
      {story(context)}
    </ColorModeObserver>
  )
}

export const withThemeProvider = (theme: Theme): MakeDecoratorResult =>
  makeDecorator({
    name: 'withThemeProvider',
    parameterName: 'colorMode',
    skipIfNoParametersOrOptions: false,
    wrapper: makeWrapperWithTheme(theme),
  })
