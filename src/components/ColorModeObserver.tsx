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
  // If a theme-ui-<something> class exists don't set anything
  useEffect(() => {
    if (!isElementDirty(document.body)) {
      setThemeUIClass(document.body, props.initialMode)
      makeDirty(document.body)
    }
  }, [props.initialMode])

  // Replace the current theme-ui class with the new one
  useEffect(() => {
    /**
     * Callback function in response to change mode event
     * @param mode - the new mode to set
     */
    function handleEvent(mode: string): void {
      setThemeUIClass(document.body, mode)
    }

    props.channel.addListener<string>(CHANGE_MODE, handleEvent)

    return (): void => {
      props.channel.removeListener<string>(CHANGE_MODE, handleEvent)
    }
  }, [props.channel])

  return (
    <ThemeProvider theme={props.theme}>
      <ColorMode />
      <Styled.root>{props.children}</Styled.root>
    </ThemeProvider>
  )
}

export const ColorModeObserver = React.memo(BaseColorModeObserver)
