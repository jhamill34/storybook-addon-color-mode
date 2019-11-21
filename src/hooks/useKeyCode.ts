import { useEffect } from 'react'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { addons } from '@storybook/addons'
import { ColorModeChannel } from '../models'
import { Key } from '../keycodes'
import { ColorModeAddonHook } from './useColorModeAddonState'

type KeyboardHandler = {
  /**
   * Triggers functions provided by the closing hook when
   * prefix keys (Ctrl + Alt) are triggered in conjunction with
   * Left Arrow, Right Arrow, or a number key.
   * @param event - general DOM event for handling keyboard triggers.
   */
  (event: KeyboardEvent): void
}

/**
 * Factory method for creating a keyboard handler method.
 *
 * @param  hook - fields from the result of a `useColorModeAddonState()` call
 * @returns resulting function closed around hook that
 *  is called when keyboard events are triggered.
 */
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

/**
 * React hook function to bind keyboard events to the provided handler
 * @param  handleEvent - function triggered on keyboard events
 */
export function useKeyCode(handleEvent: KeyboardHandler): void {
  const channel: ColorModeChannel = addons.getChannel()

  useEffect(() => {
    /**
     * Storybook events look slightly different and need to be cleaned
     * up just a bit sending them to the actual handler
     * @param  args - Storybook event adapter
     */
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
