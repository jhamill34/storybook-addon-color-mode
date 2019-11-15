import { useEffect } from 'react'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { ColorModeChannel } from './models'

export const useKeyCode = (channel: ColorModeChannel): void => {
  useEffect(() => {
    const handleEvent = (event: KeyboardEvent): void => {
      console.log(event.keyCode)
    }

    const channelHandleEvent = (args: { event: KeyboardEvent }): void => {
      handleEvent(args.event)
    }

    channel.addListener<{ event: KeyboardEvent }>(
      PREVIEW_KEYDOWN,
      channelHandleEvent
    )
    document.addEventListener('keydown', handleEvent)

    return (): void => {
      channel.removeListener<{ event: KeyboardEvent }>(
        PREVIEW_KEYDOWN,
        channelHandleEvent
      )
      document.removeEventListener('keydown', handleEvent)
    }
  }, [channel])
}
