/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        estate: {
          bg: '#0C1018',
          panel: '#121722',
          panel2: '#161C2A',
          panel3: '#1B2233',
          border: 'rgba(226,232,245,0.09)',
          gold: '#E7B860',
          goldLight: '#F2CE8A',
          goldDeep: '#C89038',
          ink: '#F1EFE9',
          slate: '#A9B1C2',
          faint: '#6F7889',
          green: '#4CC38A',
          red: '#F26D6D',
          blue: '#5B9BD5',
          purple: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        estate: '0 18px 50px rgba(0,0,0,.22)',
        'estate-glow': '0 10px 30px rgba(231,184,96,.22)',
      },
    },
  },
  plugins: [],
}
