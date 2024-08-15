import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {},
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: 'F12379', // pink
          'primary-content': '#FE3187', // lighter-pink
          secondary: '#F3A042', // orange
          'secondary-content': '#140f3d', // light blue
          accent: '#A72F60', // dark pink
          'accent-content': '#78143C', // darkest pink
          neutral: '#0D0935', // dark blue
          'neutral-content': 'white', // white
          'base-content': '#9CA3AF', // gray-300
          'base-100': '#27272a', // zinc-800
          'base-200': '000000', // black
          'base-300': '#020810', // black blue bg
          '.gradient-bg': {
            background: 'linear-gradient(290deg, rgba(241,35,121, .1) 10%, rgba(7, 76, 255 , .1) 100%)',
          },
          '.gear': {
            color: '#ffffff',
          },
          '.bg-theme': {
            background: '#0D0935',
          },
          '.gray-text': {
            // zinc-300
            color: '#d4d4d8',
          },
        },
      },
      {
        bumblebee: {
          ...require('daisyui/src/theming/themes')['bumblebee'],
          primary: '#F12379', // pink
          'primary-content': '#FE3187', // lighter-pink
          secondary: '#F3A042', // orange
          'secondary-content': '#d7d7d7', // gray-orange
          accent: '#e07000', // darkest orange
          'accent-content': '#F3A042', // dark orange
          neutral: '#d5d5d7', // zinc-200
          'neutral-content': '#000000', // black
          'base-100': '#888', // inverted zinc
          'base-200': 'ffffff', // white
          'base-300': '#e8e8e8', // white gray
          '.gradient-bg': {
            // background: 'linear-gradient(90deg, rgba(0,105,255,1) 26%, rgba(255,0,0,1) 100%)',
            // background: '#e8e8e8',
          },
          '.gear': {
            color: '#e07000', // dark orange
          },
          '.bg-theme': {
            background: 'transparent',
          },
          '.gray-text': {
            color: '#3f3f46',
          },
        },
      },
    ],
  },
}
export default config
