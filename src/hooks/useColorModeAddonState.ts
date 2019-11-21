import React, { useEffect } from 'react'
import { useAddonState } from '@storybook/api'
import { addons } from '@storybook/addons'
import { ColorModeAddonState, ColorModeItem, ColorModeChannel } from '../models'
import { ADDON_ID, CHANGE_MODE } from '../constants'

export type IndexSetter = (newIndex: number) => void
export type IndexStepper = () => void

export type ColorModeAddonHook = {
  currentIndex: number
  list: ColorModeItem[]
  setIndex: IndexSetter
  nextIndex: IndexStepper
  prevIndex: IndexStepper
}

/**
 * Custom React hook that provides useful methods to manage the
 * current color mode presented.
 * @param list - color mode items to use
 * @param defaultMode - the default mode
 * @returns fields used to interact with hook
 */
export function useColorModeAddonState(
  list: ColorModeItem[],
  defaultMode: string
): ColorModeAddonHook {
  const defaultIndex = React.useMemo(
    () => list.findIndex(m => m.id === defaultMode),
    [defaultMode, list]
  )

  const channel: ColorModeChannel = addons.getChannel()

  const [state, setState] = useAddonState<ColorModeAddonState>(ADDON_ID, {
    currentIndex: defaultIndex,
  })

  const { currentIndex } = state

  useEffect(() => {
    channel.emit<string>(CHANGE_MODE, list[currentIndex].id)
  })

  /**
   * Updates selected mode to provided index
   * @param  newIndex - the new index to set the current mode
   */
  function setIndex(newIndex: number): void {
    setState({
      currentIndex: newIndex,
    })
  }

  /**
   * Increments the current mode to the next in the list.
   * Useful for handling keyboard actions.
   * Wraps back to the first item in the list if it goes beyond the
   * array bounds.
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
   * Decrements the current mode to the previous in the list.
   * Useful for handling keyboard actions.
   * Wraps back to the last item in the list if it goes beyond the
   * array bounds.
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
    list,
    setIndex,
    nextIndex,
    prevIndex,
  }
}
