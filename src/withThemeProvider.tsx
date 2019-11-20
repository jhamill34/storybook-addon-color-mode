import React from 'react'
import addons, {
  makeDecorator,
  MakeDecoratorResult,
  StoryWrapper,
} from '@storybook/addons'
import { Theme } from 'theme-ui'
import { ColorModeObserver } from './components/ColorModeObserver'
import { ColorModeAddonParams } from './models'

export function makeWrapperWithTheme(theme: Theme): StoryWrapper {
  return function wrapper(story, context, settings): JSX.Element {
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
}

export function withThemeProvider(theme: Theme): MakeDecoratorResult {
  return makeDecorator({
    name: 'withThemeProvider',
    parameterName: 'colorMode',
    skipIfNoParametersOrOptions: false,
    wrapper: makeWrapperWithTheme(theme),
  })
}
