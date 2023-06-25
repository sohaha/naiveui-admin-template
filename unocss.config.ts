import { defineConfig, presetAttributify, presetUno, } from 'unocss'
import { presetCore, presetThemeDefault } from 'ayyui'
import presetIcons from '@unocss/preset-icons'
import presetWind from '@unocss/preset-wind'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetWind(),
    presetCore(),
    presetThemeDefault(),
    // https://icones.netlify.app/
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'height': '1em',
        'width': '1em',
        'flex-shrink': '0',
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  include: [
    /.*\/ayyui\.js(.*)?$/,
    './**/*.vue',
    './**/*.md',
    './**/*.ts',
    './**/*.tsx',
    './src/menu.json',
  ],
})
