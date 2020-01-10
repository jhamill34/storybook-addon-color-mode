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
import 'storybook-addon-color-mode/register'
```

You should now be able to see the color mode addon icon in the the toolbar at the top of the screen.

## Configuration

The color mode addon is configured by story parameters with the `colorMode` key. To configure globally, import `addParameters` from your app layer in your `config.js` file.

```js
import { addParameters } from '@storybook/react';
import { Key } from 'storybook-addon-color-mode';

addParameters({
  colorMode: {
    modes: {
      dark: {
        name: 'Dark'
      }
    },
    defaultMode: 'dark',
    bindings: {
      prefix: {
        ctrlKey: true,
        altKey: true,
        shiftKey: false,
      },
      previousTrigger: Key.LeftArrow,
      nextTrigger: Key.RightArrow,
    }
  },
});
```

Options can take a object with the following keys:

### modes: Object

A key-value pair of color modes's key and properties (see `Color Mode Model` definition below) for all color modes to be displayed. 

#### Color Mode Model

```ts
type ColorMode = {
  /**
   * name to display in the dropdown
   */
  name: string
}
```

### defaultMode: string

A string representing the key that you would like to use as your default color mode. This will 
be the color mode that will load up when your storybook starts and when you reload the page. 
This can also be set on a per-story basis as well. 

### bindings: KeyBinding

Keybindings can be configured to cycle through different color modes. However, this is 
completely optional. Keybindings are defined by a *prefix* and a *trigger* key to complete an action. 

The default *prefix* is to hold down `Ctrl + Alt` (or `Control + Option` on a Mac). You can configure
this with any combination of `Ctrl`, `Alt`, and `Shift`. 

The default *trigger* keys are defined by three different actions: next, previous, and set. 

| Action | Trigger Key | Configurable | 
|:-------|:-----------:|:------------:|
| Next Mode | `Ctrl` (`^`, `Control`) | `true` | 
| Previous Mode | `Alt` (`Option`) | `true` |
| Set Mode Index | # Keys (0 - 9) | `false` |

```ts
/**
 * Configuration to outline a common keybinding prefix
 * for triggering events.
 */
type KeyBindingPrefix = {
  /** Set true if Control (^ or Ctrl) Key is part of prefix */
  ctrlKey: boolean

  /** Set true if Alt (or Option) Key is part of prefix */
  altKey: boolean

  /** Set true if Shift Key is part of prefix */
  shiftKey: boolean
}

/**
 * Complete configuration for keybindings
 */
type KeyBinding = {
  /** See Above */
  prefix: KeyBindingPrefix

  /** Which keycode should trigger going to the next color mode */
  previousTrigger: Key

  /** Which keycode should trigger going to the previous color mode */
  nextTrigger: Key
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
    },
    defaultMode: 'dark' // Dark mode will start automatically 
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

## Inspiration 

This project was highly influenced by [@storybook/addon-viewport](https://github.com/storybookjs/storybook/tree/next/addons/viewport)
