import { useEffect } from 'react'
import { PREVIEW_KEYDOWN } from '@storybook/core-events'
import { addons } from '@storybook/addons'
import Channel from '@storybook/channels'
import { Key } from '../keycodes'
import { KeyBinding } from '../models'
import { IndexStepper, IndexSetter } from './useColorModeAddonState'

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
 * @param prevIndex - function for handling how to move to the previous mode
 * @param nextIndex - function for handling how to move to the next mode
 * @param setIndex - function for handling how to move any mode
 * @param bindings - configuration for determining when to trigger events
 * @returns resulting function closed around hook that
 *  is called when keyboard events are triggered.
 */
export function createKeyCodeHandler(
  prevIndex: IndexStepper,
  nextIndex: IndexStepper,
  setIndex: IndexSetter,
  bindings: KeyBinding
): KeyboardHandler {
  return function keyCodeHandler(event: KeyboardEvent): void {
    const { prefix, previousTrigger, nextTrigger } = bindings

    const hasPrefix: boolean =
      prefix.altKey === event.altKey &&
      prefix.ctrlKey === event.ctrlKey &&
      prefix.shiftKey === event.shiftKey

    if (hasPrefix) {
      if (event.keyCode === previousTrigger) {
        prevIndex()
      } else if (event.keyCode === nextTrigger) {
        nextIndex()
      } else if (event.keyCode >= Key.Zero && event.keyCode <= Key.Nine) {
        setIndex(event.keyCode - Key.Zero)
      }
    }
  }
}

/**
 * React hook function to bind keyboard events to the provided handler
 * @param  handleEvent - function triggered on keyboard events
 */
export function useKeyCode(handleEvent: KeyboardHandler): void {
  const channel: Channel = addons.getChannel()

  useEffect(() => {
    /**
     * Storybook events look slightly different and need to be cleaned
     * up just a bit sending them to the actual handler
     * @param  args - Storybook event adapter
     */
    function channelHandleEvent(args: { event: KeyboardEvent }): void {
      handleEvent(args.event)
    }

    channel.addListener(PREVIEW_KEYDOWN, channelHandleEvent)
    document.addEventListener('keydown', handleEvent)

    return (): void => {
      channel.removeListener(PREVIEW_KEYDOWN, channelHandleEvent)
      document.removeEventListener('keydown', handleEvent)
    }
  }, [channel, handleEvent])
}
