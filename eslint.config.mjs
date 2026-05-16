import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic,
    },
  },
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false,
          },
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-require-imports": "off",
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-multiple-empty-lines": "off",
      "@stylistic/no-multiple-empty-lines": [
        "error",
        {
          max: 2,
        },
      ],
    },
  },
);
