import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
          pink: "hsl(var(--mercy-pink))",
          orange: "hsl(var(--mercy-orange))",
          yellow: "hsl(var(--mercy-yellow))",
          green: "hsl(var(--mercy-green))",
          blue: "hsl(var(--mercy-blue))",
          purple: "hsl(var(--mercy-purple))",
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "blink": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.3",
          },
        },
        "shine": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "glow": {
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
        "sparkle": {
          "0%, 100%": {
            opacity: "0",
            transform: "scale(0) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1) rotate(180deg)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blink": "blink 1.5s ease-in-out infinite",
        "shine": "shine 3s linear infinite",
        "glow": "glow 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "rainbow-border": "rainbow-border 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
