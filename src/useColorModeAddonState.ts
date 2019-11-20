import React, { useEffect } from 'react'
import { useAddonState } from '@storybook/api'
import { addons } from '@storybook/addons'
import { ColorModeAddonState, ColorModeItem, ColorModeChannel } from './models'
import { ADDON_ID, CHANGE_MODE } from './constants'

export interface ColorModeAddonHook extends ColorModeAddonState {
  list: ColorModeItem[]
  setIndex: (newIndex: number) => void
  nextIndex: () => void
  prevIndex: () => void
}

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

  function setIndex(newIndex: number): void {
    setState({
      currentIndex: newIndex,
    })
  }

  function nextIndex(): void {
    const newIndex = state.currentIndex + 1
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

  function prevIndex(): void {
    const newIndex = state.currentIndex - 1
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

  useEffect(() => {
    channel.emit<string>(CHANGE_MODE, list[state.currentIndex].id)
  })

  return {
    ...state,
    list,
    setIndex,
    nextIndex,
    prevIndex,
  }
}
