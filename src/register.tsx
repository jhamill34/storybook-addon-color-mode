import React from 'react'
import { addons, types } from '@storybook/addons'

import { ColorModeTool } from './components/ColorModeTool'
import { ADDON_ID, PARAM_KEY } from './constants'

addons.register(ADDON_ID, () => {
  /**
   * @returns the element to represent our tool
   */
  function render(): JSX.Element {
    return <ColorModeTool />
  }

  const title = 'Color Mode'

  addons.add(ADDON_ID, {
    type: types.TOOL,
    title,
    match: ({ viewMode }) => viewMode === 'story',
    render,
    paramKey: PARAM_KEY,
  })
})
