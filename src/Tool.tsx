import React from 'react'
import {
  WithTooltip,
  IconButton,
  Icons,
  TooltipLinkList,
} from '@storybook/components'
import { styled } from '@storybook/theming'
import { useAddonState, useParameter } from '@storybook/api'

import { ADDON_ID, PARAM_KEY, CHANGE_MODE } from './constants'
import {
  ColorModeAddonState,
  ColorModeAddonParams,
  ColorModeMap,
  ColorModeItem,
} from './models'
import Channel from '@storybook/channels'

interface Link {
  id: string
  title: string
  right?: React.ReactNode
  onClick?: () => void
}

const IconButtonWithLabel = styled(IconButton)`
  display: flex;
  align-items: center;
`

const IconButtonLabel = styled.div`
  margin-left: 1em;
`

const defaultMode: ColorModeItem = {
  id: 'default',
  name: 'Default',
}

const toList = (map: ColorModeMap): Array<ColorModeItem> => {
  return [
    defaultMode,
    ...Object.entries(map).map(
      ([id, item]): ColorModeItem => ({
        id,
        ...item,
      })
    ),
  ]
}

const toLinks = (
  items: Array<ColorModeItem>,
  currentId: string,
  set: (id: string) => void,
  close: () => void
): Array<Link> => {
  return items.map(
    (i: ColorModeItem): Link => ({
      id: i.id,
      title: i.name,
      onClick: (): void => {
        if (i.id !== currentId) {
          set(i.id)
        }
        close()
      },
    })
  )
}

interface ColorModeToolProps {
  channel: Channel
}

export const ColorModeTool: React.FC<ColorModeToolProps> = (
  props: ColorModeToolProps
) => {
  const [state, setState] = useAddonState<ColorModeAddonState>(ADDON_ID, {
    currentId: 'default',
  })

  const { modes } = useParameter<ColorModeAddonParams>(PARAM_KEY, {
    modes: {},
  })

  const list = toList(modes)

  const active = state.currentId !== 'default'

  const updateMode = (id: string): void => {
    setState({ currentId: id })
    props.channel.emit(CHANGE_MODE, id)
  }

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
        title="Change the current color mode"
        onDoubleClick={(): void => {
          updateMode('default')
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
