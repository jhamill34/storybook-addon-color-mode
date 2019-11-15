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

  const [state, setState] = useAddonState<ColorModeAddonState>(ADDON_ID, {
    currentId: defaultMode || DEFAULT_MODE_ID,
  })

  const list = toList(modes)
  const active = state.currentId !== DEFAULT_MODE_ID

  const updateMode = (id: string): void => {
    props.channel.emit<string>(CHANGE_MODE, id)
    setState({ currentId: id })
  }

  useKeyCode(props.channel)

  useEffect(() => {
    props.channel.emit<string>(CHANGE_MODE, state.currentId)
  }, [props.channel, state.currentId])

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }): React.ReactNode => (
        <TooltipLinkList
          links={toLinks(list, state.currentId, updateMode, onHide)}
        />
      )}
      closeOnClick
    >
      <IconButtonWithLabel
        active={active}
        title={TOOL_TIP_TITLE}
        onDoubleClick={(): void => {
          updateMode(DEFAULT_MODE_ID)
        }}
      >
        <Icons icon="category" />
        {active ? (
          <IconButtonLabel>{modes[state.currentId].name}</IconButtonLabel>
        ) : null}
      </IconButtonWithLabel>
    </WithTooltip>
  )
}
