[![Build Status](https://travis-ci.com/joshrasmussen34/storybook-addon-color-mode.svg?branch=master)](https://travis-ci.com/joshrasmussen34/storybook-addon-color-mode)

# Storybook Color Mode Addon

Storybook Color Addon allows your stories to be displayed in their various color modes specified by theme-ui

## Installation

Install the following npm module:

```sh
npm i --save-dev storybook-addon-color-mode theme-ui react
```

or with yarn:

```sh
yarn add -D storybook-addon-color-mode theme-ui react
```

Then, add following content to .storybook/addons.js

```js
import 'storybook-addon-color-mode/dist/register'
```

You should now be able to see the color mode addon icon in the the toolbar at the top of the screen.

## Configuration

The color mode addon is configured by story parameters with the `colorMode` key. To configure globally, import `addParameters` from your app layer in your `config.js` file.

```js
import { addParameters } from '@storybook/react';

addParameters({
  colorMode: {
    modes: {
      dark: {
        name: 'Dark'
      }
    }
  },
});
```

Options can take a object with the following keys:

### modes: Object

---

A key-value pair of color modes's key and properties (see `Color Mode Model` definition below) for all color modes to be displayed. 

#### Color Mode Model

```js
{
  /**
   * name to display in the dropdown
   * @type {String}
   */
  name: 'Darkness',
}
```

## Example

When setting your color modes the `key` must be identical to the key that is used in your `theme-ui` theme.

### Storybook Config

```js
import { addParameters } from '@storybook/react';

addParameters({
  colorMode: {
    modes: {
      dark: {
        name: 'Dark' // This is what will be displayed in the Storybook UI
      }
    }
  },
});
```

### Theme-UI Config

```js
const theme = {
  colors: {
    text: '#000',
    background: '#fff',
    modes: {
      // This key must be the same as the one specified in your storybook config.
      dark: {
        text: '#fff',
        background: '#000'
      }
    }
  }
}
```
