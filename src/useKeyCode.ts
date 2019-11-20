import { useEffect } from 'react'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { addons } from '@storybook/addons'
import { ColorModeChannel } from './models'
import { ColorModeAddonHook } from './useColorModeAddonState'
import { Key } from './keycodes'

type KeyboardHandler = (event: KeyboardEvent) => void

export function createKeyCodeHandler(
  hook: ColorModeAddonHook
): KeyboardHandler {
  return function keyCodeHandler(event: KeyboardEvent): void {
    const { ctrlKey, altKey, keyCode } = event
    const prefix = ctrlKey && altKey

    if (prefix) {
      if (keyCode === Key.LeftArrow) {
        hook.prevIndex()
      } else if (keyCode === Key.RightArrow) {
        hook.nextIndex()
      } else if (keyCode >= Key.Zero && keyCode <= Key.Nine) {
        hook.setIndex(keyCode - Key.Zero)
      }
    }
  }
}

export function useKeyCode(handleEvent: (event: KeyboardEvent) => void): void {
  const channel: ColorModeChannel = addons.getChannel()

  useEffect(() => {
    function channelHandleEvent(args: { event: KeyboardEvent }): void {
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
