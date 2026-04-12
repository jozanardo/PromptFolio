/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        primary: 'var(--text)',
        muted: 'var(--text-muted)',
        soft: 'var(--text-soft)',
        subtle: 'var(--border)',
        'subtle-strong': 'var(--border-strong)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        success: 'var(--success)',
        danger: 'var(--error)',
        focus: 'var(--focus)',
      },
      fontFamily: {
        mono: [
          '"IBM Plex Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      boxShadow: {
        shell: 'var(--shadow-shell)',
      },
    },
  },
  plugins: [],
}
