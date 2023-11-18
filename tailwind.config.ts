import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "card-gradient":
          "linear-gradient(180deg, var(--special-bg-color), var(--special-color))",
      },
      colors: {
        "subtle-color": "var(--subtle-color)",
        "mark-color": "var(--mark-color)",
        "special-color": "var(--special-color)",
        "special-bg-color": "var(--special-bg-color)",
        "card-color": "var(--card-color)",
        "skeleton-color": "var(--skeleton-color)",
        "bg-color": "var(--bg-color)",
        "border-color": "var(--border-color)",
        "shadow-color": "var(--shadow-color)",
        "input-color": "var(--input-color)",
        "outline-color": "var(--outline-color)",
        "special-text-color": "var(--special-text-color)",
        "special-shadow-color": "var(--special-shadow-color)",
        "special-mark-color": "var(--special-mark-color)",
        "light-color": "var(--light-color)",
        "dark-color": "var(--dark-color)",

        "alert-color": "var(--alert-color)",
        "alert-bg-color": "var(--alert-bg-color)",
        "success-color": "var(--success-color)",
        "success-bg-color": "var(--success-bg-color)",
        "warning-color": "var(--warning-color)",
        "warning-bg-color": "var(--warning-bg-color)",
        "hover-bg-color": "var(--hover-bg-color)",
      },
      textColor: {
        "basic-color": "var(--text-color)",
        "soft-color": "var(--text-soft-color)",
        "strong-color": "var(--text-strong-color)",
      },
      stroke: {
        "text-color": "var(--text-soft-color)",

        "alert-color": "var(--alert-color)",
        "alert-bg-color": "var(--alert-bg-color)",
        "success-color": "var(--success-color)",
        "success-bg-color": "var(--success-bg-color)",
        "warning-color": "var(--warning-color)",
        "warning-bg-color": "var(--warning-bg-color)",
      },
      borderColor: {
        "text-color": "var(--text-color)",
        "subtle-color": "var(--subtle-color)",
        "mark-color": "var(--mark-color)",
        "special-color": "var(--special-color)",
        "special-bg-color": "var(--special-bg-color)",
        "card-color": "var(--card-color)",
        "skeleton-color": "var(--skeleton-color)",
        "bg-color": "var(--bg-color)",
        "border-color": "var(--border-color)",
        "soft-border-color": "var(--soft-border-color)",
        "shadow-color": "var(--shadow-color)",
        "input-color": "var(--input-color)",
        "outline-color": "var(--outline-color)",
        "special-text-color": "var(--special-text-color)",
        "special-shadow-color": "var(--special-shadow-color)",
        "special-mark-color": "var(--special-mark-color)",
        "light-color": "var(--light-color)",
        "dark-color": "var(--dark-color)",

        "alert-color": "var(--alert-color)",
        "alert-bg-color": "var(--alert-bg-color)",
        "success-color": "var(--success-color)",
        "success-bg-color": "var(--success-bg-color)",
        "warning-color": "var(--warning-color)",
        "warning-bg-color": "var(--warning-bg-color)",
      },
      screens: {
        sm: { max: "640px" },
        md: { max: "768px", min: "640px" },
        lg: { max: "1024px", min: "768px" },
        xl: { max: "1280px", min: "1024px" },
        "2xl": { max: "1536px", min: "1280px" },
      },
      width: {
        "128": "32rem",
      },
      keyframes: {
        "up-down": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "rotate-anticlockwise": {
          from: {
            transform: "rotate(100deg) translateX(100px) rotate(100deg);",
          },
          to: {
            transform: "rotate(-260deg) translateX(100px) rotate(460deg)",
          },
        },
        "rotate-clockwise": {
          from: {
            transform: "rotate(-100deg) translateX(100px) rotate(-100deg);",
          },
          to: {
            transform: "rotate(260deg) translateX(100px) rotate(-460deg)",
          },
        },
      },
      animation: {
        "up-down": "up-down 5s linear infinite",
        "rotate-anticlockwise": "rotate-anticlockwise 9s linear infinite",
        "rotate-clockwise": "rotate-clockwise 9s linear infinite",
      },
      padding: {
        "74": "18.5rem",
      },
    },
  },
  plugins: [],
  darkMode: "class",
}
export default config
