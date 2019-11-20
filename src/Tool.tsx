import React from 'react'
import {
  WithTooltip,
  IconButton,
  Icons,
  TooltipLinkList,
} from '@storybook/components'
import { styled } from '@storybook/theming'
import { toList, toLinks } from './utils'
import { TOOL_TIP_TITLE, DEFAULT_MODE_ID, PARAM_KEY } from './constants'
import { useColorModeAddonState } from './useColorModeAddonState'
import { useKeyCode } from './useKeyCode'
import { Key } from './keycodes'
import { ColorModeAddonParams } from './models'
import { useParameter } from '@storybook/api'

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

  const {
    currentIndex,
    setIndex,
    nextIndex,
    prevIndex,
  } = useColorModeAddonState(list, defaultMode)

  const keyboardHandler = (event: KeyboardEvent): void => {
    const { ctrlKey, altKey, keyCode } = event
    const prefix = ctrlKey && altKey

    if (prefix) {
      if (keyCode === Key.LeftArrow) {
        prevIndex()
      } else if (keyCode === Key.RightArrow) {
        nextIndex()
      } else if (keyCode >= Key.Zero && keyCode <= Key.Nine) {
        setIndex(keyCode - Key.Zero)
      }
    }
  }

  useKeyCode(keyboardHandler)

  const active = currentIndex !== 0

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }): React.ReactNode => (
        <TooltipLinkList
          links={toLinks(list, currentIndex, setIndex, onHide)}
        />
      )}
      closeOnClick
    >
      <IconButtonWithLabel
        active={active}
        title={TOOL_TIP_TITLE}
        onDoubleClick={(): void => {
          setIndex(0)
        }}
      >
        <Icons icon="category" />
        {active ? (
          <IconButtonLabel>{list[currentIndex].name}</IconButtonLabel>
        ) : null}
      </IconButtonWithLabel>
    </WithTooltip>
  )
}
