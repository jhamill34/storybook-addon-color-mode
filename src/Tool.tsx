import React, { useEffect } from 'react'
import {
  WithTooltip,
  IconButton,
  Icons,
  TooltipLinkList,
} from '@storybook/components'
import { styled } from '@storybook/theming'
import { useAddonState, useParameter } from '@storybook/api'
import { toList, toLinks } from './utils'
import {
  ADDON_ID,
  PARAM_KEY,
  CHANGE_MODE,
  DEFAULT_MODE_ID,
  TOOL_TIP_TITLE,
  NEXT_MODE,
} from './constants'
import {
  ColorModeAddonState,
  ColorModeAddonParams,
  ColorModeChannel,
} from './models'
import { useKeyCode } from './useKeyCode'

const IconButtonWithLabel = styled(IconButton)`
  display: flex;
  align-items: center;
`

const IconButtonLabel = styled.div`
  margin-left: 1em;
`

interface ColorModeToolProps {
  channel: ColorModeChannel
}

export const ColorModeTool: React.FC<ColorModeToolProps> = (
  props: ColorModeToolProps
) => {
  const { modes, defaultMode } = useParameter<ColorModeAddonParams>(PARAM_KEY, {
    modes: {},
    defaultMode: DEFAULT_MODE_ID,
  })

  const list = toList(modes)

  const [state, setState] = useAddonState<ColorModeAddonState>(ADDON_ID, {
    currentIndex: list.findIndex(m => m.id === defaultMode),
  })

  const active = state.currentIndex > 0

  const updateMode = (index: number): void => {
    setState({ currentIndex: index })
  }

  useKeyCode(props.channel)

  useEffect(() => {
    props.channel.emit<string>(CHANGE_MODE, list[state.currentIndex].id)
  }, [list, props.channel, state.currentIndex])

  useEffect(() => {
    const handleNextMode = (amount: number): void => {
      let computedIndex = (state.currentIndex + amount) % list.length

      if (computedIndex < 0) {
        computedIndex = list.length - 1
      }

      setState({
        currentIndex: computedIndex,
      })
    }

    props.channel.addListener<number>(NEXT_MODE, handleNextMode)

    return (): void => {
      props.channel.removeListener<number>(NEXT_MODE, handleNextMode)
    }
  }, [list.length, props.channel, setState, state.currentIndex])

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }): React.ReactNode => (
        <TooltipLinkList
          links={toLinks(list, state.currentIndex, updateMode, onHide)}
        />
      )}
      closeOnClick
    >
      <IconButtonWithLabel
        active={active}
        title={TOOL_TIP_TITLE}
        onDoubleClick={(): void => {
          updateMode(0)
        }}
      >
        <Icons icon="category" />
        {active ? (
          <IconButtonLabel>{list[state.currentIndex].name}</IconButtonLabel>
        ) : null}
      </IconButtonWithLabel>
    </WithTooltip>
  )
}
