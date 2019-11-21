import React, { useEffect } from 'react'
import { Styled, ColorMode, Theme, ThemeProvider } from 'theme-ui'
import { ColorModeChannel } from '../models'
import { CHANGE_MODE } from '../constants'
import { isElementDirty, makeDirty, setThemeUIClass } from '../utils'

type ColorModeObserverProps = {
  /**
   * Channel that listens for when the color mode should change
   */
  channel: ColorModeChannel

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
  const { channel, initialMode, theme, children } = props
  // If a theme-ui-<something> class exists don't set anything
  useEffect(() => {
    if (!isElementDirty(document.body)) {
      setThemeUIClass(document.body, initialMode)
      makeDirty(document.body)
    }
  }, [initialMode])

  // Replace the current theme-ui class with the new one
  useEffect(() => {
    /**
     * Callback function in response to change mode event
     * @param mode - the new mode to set
     */
    function handleEvent(mode: string): void {
      setThemeUIClass(document.body, mode)
    }

    channel.addListener<string>(CHANGE_MODE, handleEvent)

    return (): void => {
      channel.removeListener<string>(CHANGE_MODE, handleEvent)
    }
  }, [channel])

  return (
    <ThemeProvider theme={theme}>
      <ColorMode />
      <Styled.root>{children}</Styled.root>
    </ThemeProvider>
  )
}

export const ColorModeObserver = React.memo(BaseColorModeObserver)
