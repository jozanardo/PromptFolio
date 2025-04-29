/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dracula-bg': '#282a36',
        'dracula-current': '#44475a',
        'dracula-fg': '#f8f8f2',
        'dracula-comment': '#6272a4',
        'dracula-cyan': '#8be9fd',
        'dracula-green': '#50fa7b',
        'dracula-orange': '#ffb86c',
        'dracula-pink': '#ff79c6',
        'dracula-purple': '#bd93f9',
        'dracula-red': '#ff5555',
        'dracula-yellow': '#f1fa8c',
        accent: '#00A67E'
      },
      fontFamily: {
        mono: ['\'Courier New\'', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
