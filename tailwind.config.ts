import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
        '.scrollbar-none::-webkit-scrollbar': {
          display: 'none', /* Chrome, Safari, Opera */
        },
        // Custom Scrollbar
        '.scrollbar-custom': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#0078D4 #30363D', /* Thumb color, track color */
        },
        '.scrollbar-custom::-webkit-scrollbar': {
          width: '8px',
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          background: '#30363D', /* Track color */
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          backgroundColor: '#0078D4', /* Thumb color */
          borderRadius: '10px',
          border: '2px solid #30363D', /* Thumb border */
        },
      });
    }
  ],
};

export default config;
