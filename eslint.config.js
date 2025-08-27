import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["@eslint/js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node, // Add this line
        ...globals.es2021,
      },
    },
  },
]);
