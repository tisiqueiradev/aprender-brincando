/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",

        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",

        math: "hsl(var(--math))",
        "math-foreground": "hsl(var(--math-foreground))",

        portuguese: "hsl(var(--portuguese))",
        "portuguese-foreground": "hsl(var(--portuguese-foreground))",

        geo: "hsl(var(--geo))",
        "geo-foreground": "hsl(var(--geo-foreground))",

        science: "hsl(var(--science))",
        "science-foreground": "hsl(var(--science-foreground))",

        english: "hsl(var(--english))",
        "english-foreground": "hsl(var(--english-foreground))",

        arts: "hsl(var(--arts))",
        "arts-foreground": "hsl(var(--arts-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [],
}
