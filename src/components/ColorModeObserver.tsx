import React from 'react'
import { Styled, ColorMode, Theme, ThemeProvider } from 'theme-ui'
import { useColorMode } from '../hooks/useColorMode'

type ColorModeObserverProps = {
  /**
   * The mode that should be initially rendered
   */
  initialMode: string

  /**
   * The theme object that provides styles for components
   * that use theme-ui
   */
  theme: Theme

  /**
   * Components rendered in the story
   */
  children: React.ReactNode
}

/**
 * Wraps stories to provide theme-ui styles.
 */
function BaseColorModeObserver(
  props: ColorModeObserverProps
): React.ReactElement {
  const { initialMode, theme, children } = props

  useColorMode(initialMode)

  return (
    <ThemeProvider theme={theme}>
      <ColorMode />
      <Styled.root>{children}</Styled.root>
    </ThemeProvider>
  )
}

export const ColorModeObserver = React.memo(BaseColorModeObserver)
