/** @type {import("prettier").Config} */

const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn"],

  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true
};

export default config;
