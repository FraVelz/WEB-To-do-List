import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      ...tailwind.configs.recommended.rules,
    },
  },

  prettier, // SIEMPRE al final (desactiva conflictos)

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
