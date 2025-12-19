module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-font-magician': {
      foundries: ['custom'],
      variants: true,
      display: 'swap'
    }
  }
}
