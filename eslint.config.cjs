module.exports = [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "prisma/seed.d.ts"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: "./",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      semi: ["error", "always"],
      indent: ["error", 2],
      quotes: ["error", "single"],
      "max-len": [
        "warn",
        {
          code: 120,
          ignoreStrings: true,
          ignoreUrls: true,
          ignoreComments: true,
        },
      ],
      
      "linebreak-style": ["error", "unix"], 
  
      "eol-last": ["error", "always"],
      "prettier/prettier": "off", // 🔥 Desativando o Prettier dentro do ESLint
    },
  },
];
