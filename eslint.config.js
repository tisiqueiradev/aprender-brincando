import js from "@eslint/js"
import tseslint from "typescript-eslint"
import globals from "globals"

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["api/**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
]
