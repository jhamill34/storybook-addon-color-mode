import React from 'react'
import { addons, types } from '@storybook/addons'

import { ColorModeTool } from './Tool'
import { ADDON_ID, PARAM_KEY } from './constants'

addons.register(ADDON_ID, () => {
  function render(): JSX.Element {
    return <ColorModeTool />
  }

  const title = 'Color Mode'

  addons.add(ADDON_ID, {
    type: types.TOOL,
    title,
    render,
    paramKey: PARAM_KEY,
  })
})
