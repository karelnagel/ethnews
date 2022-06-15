/* eslint-env node */

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      'primary': '#1fb6ff',
      'secondary': '#ffc107',
    },
    extend: {
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        'primary': '#1fb6ff',
        'secondary': '#ffc107',
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
}
