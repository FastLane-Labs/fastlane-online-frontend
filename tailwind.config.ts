import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {},
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    // More details at https://daisyui.com/docs/config/
    // themes: ['dark, dim, sunset, dracula, retro, night'],
    // themes: ['cupcake', 'bumblebee', 'lemonade', 'nord' ],
    // themes: ['dark', 'retro'],
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: 'F12379', // pink
          'primary-content': '#FE3187', // lighter-pink
          secondary: '#F3A042', // orange
          accent: '#A72F60', // dark pink
          'accent-content': '#78143C', // darkest pink
          neutral: '#0D0935', // dark blue
          'neutral-content': 'white', // white
          'base-content': '#9CA3AF', // gray-300
          'base-300': '#020810', // black blue bg
        },
      },
      {
        retro: {
          ...require('daisyui/src/theming/themes')['retro'],
          primary: 'F12379', // pink
          secondary: '#F3A042', // orange
          accent: '#A72F60', // dark pink
          'accent-content': '#78143C', // darkest pink
          // neutral: '#0D0935', // dark blue
          'neutral-content': 'white', // white
          'base-300': '#ECE2C9', // beige
        },
      },
      {
        bumblebee: {
          ...require('daisyui/src/theming/themes')['bumblebee'],
          primary: '#302c2c',
          'base-300': '#302c2c',
        },
      },
    ],
  },
}
export default config
