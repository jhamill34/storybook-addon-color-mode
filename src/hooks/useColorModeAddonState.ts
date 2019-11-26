import { useEffect } from 'react'
import { useAddonState } from '@storybook/api'
import { addons } from '@storybook/addons'
import Channel from '@storybook/channels'
import { ColorModeAddonState, ColorModeItem } from '../models'
import { ADDON_ID, CHANGE_MODE } from '../constants'

export type IndexSetter = {
  /**
   * Updates selected mode to provided index
   * @param  newIndex - the new index to set the current mode (0 \<= newIndex \< list.length)
   * @throws Index out of bounds (<newIndex>)
   */
  (newIndex: number): void
}

export type IndexStepper = {
  /** Moves to an adjacent index. Will also wrap around */
  (): void
}

export type ColorModeAddonHook = {
  /**
   * Current mode's index. Will be guaranteed to be between 0 and
   * list.length
   */
  currentIndex: number

  setIndex: IndexSetter

  /**
   * Increments the current mode to the next in the list.
   * Useful for handling keyboard actions.
   * Wraps back to the first item in the list if it goes beyond the
   * array bounds.
   */
  nextIndex: IndexStepper

  /**
   * Decrements the current mode to the previous in the list.
   * Useful for handling keyboard actions.
   * Wraps back to the last item in the list if it goes beyond the
   * array bounds.
   */
  prevIndex: IndexStepper
}

/**
 * Custom React hook that provides useful methods to manage the
 * current color mode presented.
 * @param list - color mode items to use
 * @param defaultIndex - the default index to use (must be between 0 and list.length)
 * @throws Default Index out of Bounds
 * @returns fields used to interact with hook
 */
export function useColorModeAddonState(
  list: ColorModeItem[],
  defaultIndex: number
): ColorModeAddonHook {
  if (defaultIndex >= list.length || defaultIndex < 0) {
    throw new Error(`Default Index out of Bounds: (${defaultIndex})`)
  }

  const channel: Channel = addons.getChannel()

  const [state, setState] = useAddonState<ColorModeAddonState>(ADDON_ID, {
    currentIndex: defaultIndex,
  })

  const { currentIndex } = state

  useEffect(() => {
    channel.emit(CHANGE_MODE, list[currentIndex].id)
  })

  /**
   * See [[IndexSetter]]
   */
  function setIndex(newIndex: number): void {
    if (newIndex < 0 || newIndex >= list.length) {
      throw new Error(`Index out of bounds: (${newIndex})`)
    }

    setState({
      currentIndex: newIndex,
    })
  }

  /**
   * See [[ColorModeAddonHook]]
   * See [[IndexStepper]]
   */
  function nextIndex(): void {
    const newIndex = currentIndex + 1
    if (newIndex > list.length - 1) {
      setState({
        currentIndex: 0,
      })
    } else {
      setState({
        currentIndex: newIndex,
      })
    }
  }

  /**
   * See [[ColorModeAddonHook]]
   * See [[IndexStepper]]
   */
  function prevIndex(): void {
    const newIndex = currentIndex - 1
    if (newIndex < 0) {
      setState({
        currentIndex: list.length - 1,
      })
    } else {
      setState({
        currentIndex: newIndex,
      })
    }
  }

  return {
    currentIndex,
    setIndex,
    nextIndex,
    prevIndex,
  }
}
