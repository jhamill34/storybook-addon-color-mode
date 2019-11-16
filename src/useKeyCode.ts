import { useEffect } from 'react'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { ColorModeChannel } from './models'
import { Key } from './keycodes'
import { NEXT_MODE, CHANGE_MODE_INDEX } from './constants'

export const useKeyCode = (channel: ColorModeChannel): void => {
  useEffect(() => {
    const handleEvent = (event: KeyboardEvent): void => {
      const { altKey, ctrlKey, keyCode } = event
      const prefix = altKey && ctrlKey

      if (prefix) {
        if (keyCode === Key.LeftArrow) {
          channel.emit<number>(NEXT_MODE, -1)
        } else if (keyCode === Key.RightArrow) {
          channel.emit<number>(NEXT_MODE, 1)
        } else if (keyCode >= Key.Zero && keyCode <= Key.Nine) {
          channel.emit<number>(CHANGE_MODE_INDEX, keyCode - Key.Zero)
        }
      }
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
