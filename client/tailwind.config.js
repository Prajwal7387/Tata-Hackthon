/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: '#121315',         // Dark graphite background
          panel: '#1C1D1F',      // Panel background
          steel: '#2D2E30',      // Steel gray cards
          steelLight: '#3E4042',  // Hover states on steel
          amber: '#FFB300',      // Safety Amber highlights
          amberHover: '#E6A100',  // Amber hover states
          danger: '#DC2626',     // High-contrast safety red
          warning: '#D97706',    // Safety warning orange
          success: '#16A34A',    // System green (OK status)
          border: '#333538',     // Slate-border contrast
          text: '#E2E8F0',       // Main text
          textMuted: '#94A3B8',  // Metadata text
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'ind': '8px',            // Strict 8px rounded corners constraint
      }
    },
  },
  plugins: [],
}
