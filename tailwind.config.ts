import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    'animate-pulse',
    'animate-spin',
    'animate-bounce',
    'opacity-0',
    'opacity-100',
    'translate-y-0',
    'translate-y-8',
    'scale-100',
    'scale-110',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: "2rem",
  		screens: {
  			"2xl": "1400px",
  		},
  	},
  	extend: {
  		colors: {
  			border: "hsl(var(--border))",
  			input: "hsl(var(--input))",
  			ring: "hsl(var(--ring))",
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
  			primary: {
  				DEFAULT: "#2B5D3F",
  				foreground: "#FFFFFF",
  				50: "#F0F7F3",
  				100: "#E1F0E7", 
  				200: "#C3E1CF",
  				300: "#A5D2B7",
  				400: "#87C39F",
  				500: "#69B487",
  				600: "#2B5D3F",
  				700: "#225031",
  				800: "#1A3E26",
  				900: "#112B1B",
  			},
  			secondary: {
  				DEFAULT: "#F8FBF9",
  				foreground: "#2B5D3F",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
  			},
  			muted: {
  				DEFAULT: "#F5F8F6",
  				foreground: "#6B7280",
  			},
  			accent: {
  				DEFAULT: "#E8F5E8",
  				foreground: "#2B5D3F",
  			},
  			popover: {
  				DEFAULT: "#FFFFFF",
  				foreground: "#2B5D3F",
  			},
  			card: {
  				DEFAULT: "#FFFFFF",
  				foreground: "#2B5D3F",
  			},
  			'app-green': {
  				50: '#F0F7F3',
  				100: '#E1F0E7',
  				200: '#C3E1CF', 
  				300: '#A5D2B7',
  				400: '#87C39F',
  				500: '#69B487',
  				600: '#2B5D3F',
  				700: '#225031',
  				800: '#1A3E26',
  				900: '#112B1B',
  			},
  			'app-bg': '#FEFFFE',
  			'app-secondary': '#F8FBF9',
  			'app-accent': '#E8F5E8',
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)",
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: "0" },
  			},
  			"shimmer": {
  				"0%": { transform: "translateX(-100%)" },
  				"100%": { transform: "translateX(100%)" },
  			},
  			"float": {
  				"0%, 100%": { transform: "translateY(0px)" },
  				"50%": { transform: "translateY(-6px)" },
  			},
  			"glow": {
  				"0%, 100%": { 
  					boxShadow: "0 0 20px rgba(139, 195, 159, 0.3)" 
  				},
  				"50%": { 
  					boxShadow: "0 0 30px rgba(139, 195, 159, 0.5)" 
  				},
  			},
  			"fade-in": {
  				"0%": { opacity: "0", transform: "translateY(10px)" },
  				"100%": { opacity: "1", transform: "translateY(0)" },
  			},
  			"slide-up": {
  				"0%": { opacity: "0", transform: "translateY(20px)" },
  				"100%": { opacity: "1", transform: "translateY(0)" },
  			},
  			"scale-in": {
  				"0%": { opacity: "0", transform: "scale(0.95)" },
  				"100%": { opacity: "1", transform: "scale(1)" },
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  			"shimmer": "shimmer 1.5s infinite",
  			"float": "float 3s ease-in-out infinite",
  			"glow": "glow 2s ease-in-out infinite",
  			"fade-in": "fade-in 0.3s ease-out",
  			"slide-up": "slide-up 0.4s ease-out",
  			"scale-in": "scale-in 0.2s ease-out",
  		},
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  		},
  		backdropBlur: {
  			xs: '2px',
  		},
  		boxShadow: {
  			'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  			'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  		},
  		transitionTimingFunction: {
  			'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  		},
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }: any) {
      const newUtilities = {
        '.glass-morphism': {
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-card-morphism': {
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'background-color': 'rgba(255, 255, 255, 0.25)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-nav-morphism': {
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'background-color': 'rgba(255, 255, 255, 0.8)',
          'border-bottom': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 2px 20px 0 rgba(31, 38, 135, 0.1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  // Production optimizations
  corePlugins: {
    // Disable unused core plugins for smaller CSS
    preflight: true,
    container: true,
  },
}

export default config;
