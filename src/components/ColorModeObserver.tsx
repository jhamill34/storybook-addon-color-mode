import React, { useEffect } from 'react'
import { Styled, ColorMode, useColorMode } from 'theme-ui'
import Channel from '@storybook/channels'
import { CHANGE_MODE } from '../constants'

interface ColorModeObserverProps {
  children: React.ReactNode
  channel: Channel
}

export const ColorModeObserver: React.FC<ColorModeObserverProps> = (
  props: ColorModeObserverProps
) => {
  const [mode, setMode] = useColorMode()

  useEffect(() => {
    const handleEvent = (newMode: string): void => {
      if (mode !== newMode) {
        setMode(newMode)
      }
    }

    props.channel.addListener(CHANGE_MODE, handleEvent)

    return (): void => {
      props.channel.removeListener(CHANGE_MODE, handleEvent)
    }
  }, [mode, props.channel, setMode])

  return (
    <>
      <ColorMode />
      <Styled.root>{props.children}</Styled.root>
    </>
  )
}
