
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
			colors: {
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
				},
				erasmatch: {
					blue: '#4F46E5',
					lightblue: '#818CF8',
					green: '#10B981',
					light: '#F9FAFB',
					'light-accent': '#F3F4F6',
					dark: '#111827',
					'dark-accent': '#374151',
					purple: '#8B5CF6',
					pink: '#EC4899',
					orange: '#F97316',
					yellow: '#FBBF24',
					teal: '#14B8A6',
				},
				duo: {
					green: '#58CC02',
					'green-dark': '#58A700',
					blue: '#1CB0F6',
					'blue-dark': '#1899D6',
					purple: '#A560E8',
					red: '#FF4B4B',
					yellow: '#FFC800',
					orange: '#FF9600',
					pink: '#FF82D1',
					gray: '#E5E5E5',
				},
				tinder: {
					red: '#FD3A73',
					'red-dark': '#E31C5F',
					blue: '#2A9DF4',
					white: '#FFFFFF',
					'pink-light': '#FE647B',
					'pink-lightest': '#FF7B91',
					gradient: {
						from: '#FD297B',
						to: '#FF5864',
					},
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},
			fontFamily: {
				sans: ['"Inter"', 'sans-serif'],
				rounded: ['"Nunito"', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
				'button': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'duo': '0 8px 0 0 #58A700', /* Duolingo-style button shadow */
				'tinder': '0 2px 10px 0 rgba(253, 58, 115, 0.2)',
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
				"fade-in": {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" }
				},
				"pulse-soft": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.7" }
				},
				"bounce-light": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" }
				},
				"pop": {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.05)" },
					"100%": { transform: "scale(1)" }
				},
				"spin-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"fade-in": "fade-in 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.3s ease-out",
				"pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
				"bounce-light": "bounce-light 2s ease-in-out infinite",
				"pop": "pop 0.3s ease-out",
				"spin-slow": "spin-slow 15s linear infinite"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
