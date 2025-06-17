import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))",
  			},
  			secondary: {
  				DEFAULT: "hsl(var(--secondary))",
  				foreground: "hsl(var(--secondary-foreground))",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))",
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent))",
  				foreground: "hsl(var(--accent-foreground))",
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))",
  			},
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))",
  			},
  			// Cannabis-themed color palette
  			"app-bg": "#F8FAF6",
  			"app-secondary": "#E8F2E8",
  			"app-accent": "#D4F2D4",
  			"app-green": {
  				50: "#F0F9F0",
  				100: "#E1F3E1",
  				200: "#C3E7C3",
  				300: "#9DD69D",
  				400: "#6ABE6A", 
  				500: "#4A9F4A",
  				600: "#2B5D3F",
  				700: "#1F4A2F",
  				800: "#163A23",
  				900: "#0D2918",
  			},
  			"app-purple": {
  				50: "#F5F2FF",
  				100: "#EDE8FF", 
  				200: "#DDD4FF",
  				300: "#C4B5FF",
  				400: "#A388FF",
  				500: "#8B5DFF",
  				600: "#7C3AED",
  				700: "#6B21A8",
  				800: "#581C87",
  				900: "#4C1D95",
  			}
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
  			"fade-in": {
  				from: { opacity: "0" },
  				to: { opacity: "1" },
  			},
  			"slide-up": {
  				from: { 
  					opacity: "0", 
  					transform: "translateY(20px)" 
  				},
  				to: { 
  					opacity: "1", 
  					transform: "translateY(0)" 
  				},
  			},
  			"scale-in": {
  				from: { 
  					opacity: "0", 
  					transform: "scale(0.9)" 
  				},
  				to: { 
  					opacity: "1", 
  					transform: "scale(1)" 
  				},
  			},
  			"float": {
  				"0%, 100%": { transform: "translateY(0px)" },
  				"50%": { transform: "translateY(-10px)" },
  			},
  			"glow": {
  				"0%, 100%": { 
  					textShadow: "0 0 5px currentColor" 
  				},
  				"50%": { 
  					textShadow: "0 0 20px currentColor, 0 0 30px currentColor" 
  				},
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  			"fade-in": "fade-in 0.6s ease-out",
  			"slide-up": "slide-up 0.6s ease-out",
  			"scale-in": "scale-in 0.4s ease-out",
  			"float": "float 3s ease-in-out infinite",
  			"glow": "glow 2s ease-in-out infinite",
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
  // Purge unused styles in production
  ...(process.env.NODE_ENV === 'production' && {
    purge: {
      enabled: true,
      content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
      options: {
        safelist: [
          // Keep critical classes that might be added dynamically
          'animate-pulse',
          'animate-spin',
          'animate-bounce',
          'opacity-0',
          'opacity-100',
          'translate-y-0',
          'translate-y-8',
          'scale-100',
          'scale-110',
        ]
      }
    }
  })
}

export default config;
