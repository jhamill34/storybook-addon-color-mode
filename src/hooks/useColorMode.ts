import { useEffect } from 'react'
import Channel from '@storybook/channels'
import addons from '@storybook/addons'
import { CHANGE_MODE } from '../constants'
import { isElementDirty, makeDirty, setThemeUIClass } from '../utils'

/**
 * Custom React hook that provides listeners
 * to update body element with theme-ui classes
 */
export function useColorMode(initialMode: string): void {
  const channel: Channel = addons.getChannel()

  useEffect(() => {
    if (!isElementDirty(document.body)) {
      setThemeUIClass(document.body, initialMode)
      makeDirty(document.body)
    }
  }, [initialMode])

  useEffect(() => {
    /**
     * Callback function in response to change mode event
     * @param mode - the new mode to set
     */
    function handleEvent(mode: string): void {
      setThemeUIClass(document.body, mode)
    }

    channel.addListener(CHANGE_MODE, handleEvent)

    return (): void => {
      channel.removeListener(CHANGE_MODE, handleEvent)
    }
  }, [channel])
}
