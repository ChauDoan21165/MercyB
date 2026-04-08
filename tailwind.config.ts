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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* Typography Scale */
      fontSize: {
        xs: ["var(--font-xs)", { lineHeight: "var(--leading-tight)" }],
        sm: ["var(--font-sm)", { lineHeight: "var(--leading-normal)" }],
        base: ["var(--font-base)", { lineHeight: "var(--leading-normal)" }],
        lg: ["var(--font-lg)", { lineHeight: "var(--leading-normal)" }],
        xl: ["var(--font-xl)", { lineHeight: "var(--leading-snug)" }],
        "2xl": ["var(--font-2xl)", { lineHeight: "var(--leading-snug)" }],
        "3xl": ["var(--font-3xl)", { lineHeight: "var(--leading-tight)" }],
        "4xl": ["var(--font-4xl)", { lineHeight: "var(--leading-tight)" }],
      },

      /* Spacing Scale */
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        12: "var(--space-12)",
        16: "var(--space-16)",
      },

      /* Box Shadow */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        glow: "var(--shadow-glow)",

        /* Mercy 2026 additions */
        "mercy-soft": "0 8px 24px rgba(15, 23, 42, 0.06)",
        "mercy-card": "0 10px 28px rgba(148, 163, 184, 0.06)",
        "mercy-active-warm": "0 10px 22px rgba(255, 138, 101, 0.14)",
        "mercy-active-mint": "0 10px 22px rgba(16, 185, 129, 0.12)",
        "mercy-active-blue": "0 10px 22px rgba(59, 130, 246, 0.12)",
        "mercy-active-purple": "0 10px 22px rgba(168, 85, 247, 0.12)",
        "mercy-premium": "0 10px 26px rgba(168, 85, 247, 0.24)",
      },

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

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        mercy: {
          /* existing */
          pink: "hsl(var(--mercy-pink))",
          orange: "hsl(var(--mercy-orange))",
          yellow: "hsl(var(--mercy-yellow))",
          green: "hsl(var(--mercy-green))",
          blue: "hsl(var(--mercy-blue))",
          purple: "hsl(var(--mercy-purple))",

          /* Mercy 2026 system */
          brand: {
            violet: "#5E4B9C",
            lavender: "#A78BFA",
            sky: "#7DD3FC",
            mint: "#6EE7B7",
            gold: "#FDE68A",
          },

          action: {
            primary: "#14B8A6",
            "primary-hover": "#0F9484",
            secondary: "#C4B5FD",
            "secondary-hover": "#A78BFA",
          },

          bg: {
            main: "#FAF7F2",
            soft: "#F7F3FF",
            card: "#FFFFFF",
            elevated: "#FFFDF8",
            accent: "#F0EBFF",
          },

          text: {
            primary: "#1F2937",
            secondary: "#4B5563",
            soft: "#6B7280",
            brand: "#5E4B9C",
          },

          emotion: {
            sky: "#67E8F9",
            mint: "#6EE7B7",
            peach: "#FDD4A6",
            gold: "#FDE68A",
          },

          journey: {
            from: "#FFF1EA",
            to: "#FFF8F4",
            border: "#FFB39A",
            text: "#E76F51",
            icon: "#FF8A65",
          },

          grammar: {
            from: "#ECFDF5",
            to: "#F7FFF9",
            border: "#A7F3D0",
            text: "#0F9F6E",
            icon: "#10B981",
          },

          speak: {
            from: "#EFF6FF",
            to: "#F7FBFF",
            border: "#BFDBFE",
            text: "#2563EB",
            icon: "#3B82F6",
          },

          logic: {
            from: "#FAF5FF",
            to: "#FFF9FF",
            border: "#E9D5FF",
            text: "#9333EA",
            icon: "#A855F7",
          },

          active: {
            from: "#FFF1EA",
            to: "#FFF8F4",
            border: "#FFB39A",
            text: "#E76F51",
          },

          feedback: {
            success: "#10B981",
            warning: "#F59E0B",
            danger: "#EF4444",
            info: "#3B82F6",
          },
        },

        kids: {
          rainbow: {
            red: "0 90% 55%",
            "red-light": "0 85% 65%",
            orange: "30 95% 50%",
            "orange-light": "30 90% 60%",
            yellow: "48 100% 50%",
            "yellow-light": "48 95% 60%",
            green: "145 80% 45%",
            "green-light": "145 75% 55%",
            cyan: "190 85% 45%",
            "cyan-light": "190 80% 55%",
            blue: "220 90% 55%",
            "blue-light": "220 85% 65%",
            purple: "270 85% 55%",
            "purple-light": "270 80% 65%",
            magenta: "310 85% 50%",
            "magenta-light": "310 80% 60%",
          },
        },
      },

      borderRadius: {
        /* existing */
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",

        /* Mercy additions */
        "mercy-sm": "0.875rem",
        "mercy-md": "1rem",
        "mercy-lg": "1.25rem",
        "mercy-xl": "1.5rem",
        "mercy-2xl": "1.75rem",
        "mercy-3xl": "2rem",
      },

      backgroundImage: {
        "mercy-brand":
          "linear-gradient(90deg, #A78BFA 0%, #7DD3FC 33%, #6EE7B7 66%, #FDE68A 100%)",
        "mercy-warm":
          "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 55%, #FFFDF8 100%)",
        "mercy-logic":
          "linear-gradient(135deg, #FFF8F1 0%, #FFFCFA 55%, #F7F5FF 100%)",
        "mercy-premium":
          "linear-gradient(90deg, #7C3AED 0%, #D946EF 50%, #FB7185 100%)",
        "mercy-action":
          "linear-gradient(90deg, #14B8A6 0%, #0F9484 100%)",
      },

      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        blink: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.3",
          },
        },
        shine: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px currentColor, 0 0 10px currentColor",
          },
          "50%": {
            boxShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        sparkle: {
          "0%, 100%": {
            opacity: "0",
            transform: "scale(0) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1) rotate(180deg)",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "rainbow-border": {
          "0%": {
            borderColor: "#ef4444",
          },
          "14%": {
            borderColor: "#f97316",
          },
          "28%": {
            borderColor: "#fbbf24",
          },
          "42%": {
            borderColor: "#22c55e",
          },
          "57%": {
            borderColor: "#06b6d4",
          },
          "71%": {
            borderColor: "#3b82f6",
          },
          "85%": {
            borderColor: "#8b5cf6",
          },
          "100%": {
            borderColor: "#ec4899",
          },
        },
        ripple: {
          "0%": {
            transform: "translate(-50%, -50%) scale(0)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(40)",
            opacity: "0",
          },
        },
        "pulse-soft": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.02)",
          },
        },
        "mouth-talk": {
          "0%, 100%": {
            height: "4px",
            borderRadius: "9999px",
          },
          "50%": {
            height: "10px",
            borderRadius: "50%",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        blink: "blink 1.5s ease-in-out infinite",
        shine: "shine 3s linear infinite",
        glow: "glow 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "rainbow-border": "rainbow-border 3s linear infinite",
        ripple: "ripple 0.6s ease-out",
        "mouth-talk": "mouth-talk 0.3s ease-in-out infinite",
      },

      transitionDuration: {
        fast: "var(--duration-fast)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
        "mb-short": "150ms",
        "mb-medium": "250ms",
        "mb-long": "400ms",
      },

      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        out: "var(--ease-out)",
        "mb-default": "cubic-bezier(0.16, 1, 0.3, 1)",
        "mb-soft": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;