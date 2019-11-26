import React from 'react'
import {
  makeDecorator,
  MakeDecoratorResult,
  StoryWrapper,
  StoryGetter,
  StoryContext,
  WrapperSettings,
} from '@storybook/addons'
import { Theme } from 'theme-ui'
import { ColorModeObserver } from './components/ColorModeObserver'
import { ColorModeAddonParams } from './models'

/**
 * Factory method to create a closure around a wrapper component using
 * a theme configuration from theme-ui
 * @param theme - the provided theme object
 * @returns a wrapper component used with stories
 */
function makeWrapperWithTheme(theme: Theme): StoryWrapper {
  return function wrapper(
    story: StoryGetter,
    context: StoryContext,
    settings: WrapperSettings
  ): JSX.Element {
    const params = settings.parameters as ColorModeAddonParams

    return (
      <ColorModeObserver initialMode={params.defaultMode} theme={theme}>
        {story(context)}
      </ColorModeObserver>
    )
  }
}

/**
 * The main function used in stories to expose a theme's color
 * mode to your components.
 * @param theme - theme object from theme-ui
 * @returns A decorator to include with storybook
 */
export function withThemeProvider(theme: Theme): MakeDecoratorResult {
  return makeDecorator({
    name: 'withThemeProvider',
    parameterName: 'colorMode',
    skipIfNoParametersOrOptions: false,
    wrapper: makeWrapperWithTheme(theme),
  })
}
