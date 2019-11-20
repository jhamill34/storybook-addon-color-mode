import React from 'react'
import {
  WithTooltip,
  IconButton,
  Icons,
  TooltipLinkList,
} from '@storybook/components'
import { styled } from '@storybook/theming'
import { useParameter } from '@storybook/api'
import { toList, toLinks } from './utils'
import { TOOL_TIP_TITLE, DEFAULT_MODE_ID, PARAM_KEY } from './constants'
import {
  useColorModeAddonState,
  ColorModeAddonHook,
} from './useColorModeAddonState'
import { useKeyCode, createKeyCodeHandler } from './useKeyCode'
import { ColorModeAddonParams } from './models'

const IconButtonWithLabel = styled(IconButton)`
  display: flex;
  align-items: center;
`

const IconButtonLabel = styled.div`
  margin-left: 1em;
`

export const ColorModeTool: React.FC = () => {
  const { modes, defaultMode } = useParameter<ColorModeAddonParams>(PARAM_KEY, {
    modes: {},
    defaultMode: DEFAULT_MODE_ID,
  })
  const list = React.useMemo(() => toList(modes), [modes])

  const hook: ColorModeAddonHook = useColorModeAddonState(list, defaultMode)

  const keyboardHandler = createKeyCodeHandler(hook)

  useKeyCode(keyboardHandler)

  const active = hook.currentIndex !== 0

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }): React.ReactNode => (
        <TooltipLinkList
          links={toLinks(list, hook.currentIndex, hook.setIndex, onHide)}
        />
      )}
      closeOnClick
    >
      <IconButtonWithLabel active={active} title={TOOL_TIP_TITLE}>
        <Icons icon="category" />
        {active ? (
          <IconButtonLabel>{list[hook.currentIndex].name}</IconButtonLabel>
        ) : null}
      </IconButtonWithLabel>
    </WithTooltip>
  )
}
