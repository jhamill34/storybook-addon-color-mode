// eslint-disable-next-line tsdoc/syntax
/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import {
  WithTooltip,
  IconButton,
  Icons,
  TooltipLinkList,
} from '@storybook/components'
import { useParameter } from '@storybook/api'
import { toList, toLinks } from '../utils'
import { TOOL_TIP_TITLE, DEFAULT_MODE_ID, PARAM_KEY } from '../constants'
import {
  useColorModeAddonState,
  ColorModeAddonHook,
} from '../hooks/useColorModeAddonState'
import { useKeyCode, createKeyCodeHandler } from '../hooks/useKeyCode'
import { ColorModeAddonParams } from '../models'

/**
 * Provides interface in UI to be able to change the color mode
 * with a dropdown menu. Color modes can also be changed with the
 * use of keyboard short cuts (Default: Ctrl + Alt + action)
 * Actions include Left and Right arrow keys and number keys.
 */
export function ColorModeTool(): React.ReactElement {
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
      <IconButton
        css={{
          display: 'flex',
          alignItems: 'center',
        }}
        active={active}
        title={TOOL_TIP_TITLE}
      >
        <Icons icon="category" />
        {active ? (
          <div
            css={{
              marginLeft: '1em',
            }}
          >
            {list[hook.currentIndex].name}
          </div>
        ) : null}
      </IconButton>
    </WithTooltip>
  )
}
