import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				orbitron: ['Orbitron', 'sans-serif'],
				cormorant: ['"Cormorant Garamond"', 'serif'],
				fira: ['"Fira Code"', 'monospace'],
			},
			colors: {
				void: '#0A1128',
				fleet: '#1A2A5A',
				gold: '#FFB347',
				blood: '#8B0000',
				cold: '#E0E0E0',
				warm: '#FFF5E6',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'glitch': {
					'0%,100%': { transform: 'translate(0)', filter: 'none' },
					'20%': { transform: 'translate(-3px,2px)', filter: 'hue-rotate(40deg)' },
					'40%': { transform: 'translate(3px,-2px)', filter: 'hue-rotate(-40deg)' },
					'60%': { transform: 'translate(-2px,-1px)' },
					'80%': { transform: 'translate(2px,1px)' }
				},
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(24px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'flicker': {
					'0%,100%': { opacity: '1' },
					'50%': { opacity: '0.45' }
				},
				'twinkle': {
					'0%,100%': { opacity: '0.2' },
					'50%': { opacity: '1' }
				},
				'star-pulse': {
					'0%,100%': { transform: 'scale(1)', filter: 'brightness(1)' },
					'50%': { transform: 'scale(1.15)', filter: 'brightness(1.6)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glitch': 'glitch 0.3s steps(2) infinite',
				'fade-up': 'fade-up 0.8s ease-out forwards',
				'flicker': 'flicker 2.5s ease-in-out infinite',
				'twinkle': 'twinkle 3s ease-in-out infinite',
				'star-pulse': 'star-pulse 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;