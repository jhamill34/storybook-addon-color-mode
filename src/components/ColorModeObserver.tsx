import React, { useEffect, useState } from 'react'
import { ColorModeChannel } from '../models'
import { Styled, ColorMode, Theme } from 'theme-ui'
import { CHANGE_MODE } from '../constants'
import { ThemeProvider } from 'emotion-theming'

interface ColorModeObserverProps {
  theme: Theme
  children: React.ReactNode
  channel: ColorModeChannel
}

export const ColorModeObserver: React.FC<ColorModeObserverProps> = (
  props: ColorModeObserverProps
) => {
  const [mode, setMode] = useState()

  useEffect(() => {
    const handleEvent = (newMode: string): void => {
      if (mode !== newMode) {
        document.body.classList.remove('theme-ui-' + mode)
        document.body.classList.add('theme-ui-' + newMode)

        setMode(newMode)
      }
    }

    props.channel.addListener(CHANGE_MODE, handleEvent)

    return (): void => {
      props.channel.removeListener(CHANGE_MODE, handleEvent)
    }
  }, [mode, props.channel, setMode])

  return (
    <ThemeProvider theme={props.theme}>
      <ColorMode />
      <Styled.root>{props.children}</Styled.root>
    </ThemeProvider>
  )
}
