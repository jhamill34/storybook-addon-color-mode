import { useEffect } from 'react'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { ColorModeChannel } from './models'
import addons from '@storybook/addons'

export const useKeyCode = (
  handleEvent: (event: KeyboardEvent) => void
): void => {
  const channel: ColorModeChannel = addons.getChannel()

  useEffect(() => {
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
  }, [channel, handleEvent])
}
