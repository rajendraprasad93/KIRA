/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// Government Official Colors (MCD Style)
  			govBlue: {
  				50: '#E3EEF7',
  				100: '#C7DDEE',
  				200: '#8FBBDD',
  				300: '#5799CC',
  				400: '#3B7BB8',
  				500: '#1F4E78', // Primary Government Blue
  				600: '#1A3E5F',
  				700: '#153456',
  				800: '#10294D',
  				900: '#0F1F33'
  			},
  			govOrange: {
  				50: '#FFF4E6',
  				100: '#FEE5D3',
  				200: '#FDC8A7',
  				300: '#FCAB7B',
  				400: '#F99746',
  				500: '#F77F00', // Secondary Government Orange
  				600: '#DC7000',
  				700: '#C16400',
  				800: '#A65800',
  				900: '#8B4C00'
  			},
  			civic: {
  				50: '#E8F5E9',
  				100: '#C8E6C9',
  				200: '#A5D6A7',
  				300: '#81C784',
  				400: '#66BB6A',
  				500: '#2E7D32', // Tertiary Civic Green
  				600: '#2C6B2F',
  				700: '#1B5E20',
  				800: '#1B4332',
  				900: '#0D2818'
  			},
  			govText: '#1B3A4B',      // Dark blue-black text
  			govBg: '#F5F7FA',        // Official light gray background
  			govAlert: '#D32F2F',     // Alert red (flag color)
  			govSuccess: '#2E7D32',   // Success green
  			govWarning: '#F77F00',   // Warning orange
  			
  			// Keep existing shadcn colors for compatibility
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};