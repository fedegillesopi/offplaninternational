import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        primary: {
          main: "#ebc03f",
          dark: "#827254",
          light: "#f9ecc5",
        },
        text: {
          primary: "#1c1c1c",
          secondary: "#333333",
          hint: "whitesmoke",
        },
        others: {
          white: "#ffffff",
          black: "#000000",
          "grey-50": "#dbdbdb",
          "grey-100": "#b6b6b6",
          "grey-200": "#929292",
          "grey-300": "#6d6d6d",
          "grey-400": "#494949",
          "grey-500": "#242424",
        },
        secondary: {
          main: "#142521",
        },
        accent: {
          main: "#2b83af",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      spacing: {
        "0": "4px",
        "1": "8px",
        "2": "16px",
        "3": "24px",
        "4": "32px",
        "5": "40px",
        "6": "48px",
        "7": "56px",
        "8": "64px",
        "9": "72px",
        "10": "80px",
      },
      fontSize: {
        "h1": ["68px", { lineHeight: "110%", fontWeight: "500" }],
        "h2": ["36px", { lineHeight: "100%", fontWeight: "700" }],
        "h3": ["40px", { lineHeight: "105%", fontWeight: "600" }],
        "h4": ["28px", { lineHeight: "100%", fontWeight: "700" }],
        "h5": ["28px", { lineHeight: "115%", fontWeight: "700" }],
        "subtitle-1": ["20px", { lineHeight: "100%", fontWeight: "300" }],
        "subtitle-2": ["16px", { lineHeight: "100%", fontWeight: "300" }],
        "body-1": ["16px", { lineHeight: "135%", fontWeight: "300" }],
        "overline": ["14px", { lineHeight: "120%", fontWeight: "300" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "1": "8px",
        "2": "16px",
        "3": "24px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // eslint-disable-line
} satisfies Config;
