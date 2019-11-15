import React, { useEffect } from 'react'
import { ColorModeChannel } from '../models'
import { Styled, ColorMode, Theme, ThemeProvider } from 'theme-ui'
import { CHANGE_MODE } from '../constants'
import { isElementDirty, makeDirty, setThemeUIClass } from '../utils'

interface ColorModeObserverProps {
  children: React.ReactNode
  channel: ColorModeChannel
  initialMode: string
  theme: Theme
}

const BaseColorModeObserver: React.FC<ColorModeObserverProps> = (
  props: ColorModeObserverProps
) => {
  // If a theme-ui-<something> class exists don't set anything
  useEffect(() => {
    if (!isElementDirty(document.body)) {
      setThemeUIClass(document.body, props.initialMode)
      makeDirty(document.body)
    }
  }, [props.initialMode])

  // Replace the current theme-ui class with the new one
  useEffect(() => {
    const handleEvent = (mode: string): void => {
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
