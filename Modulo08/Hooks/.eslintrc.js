module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb",
    "prettier", // adicionado manualmente
    "preetier/react", // adicionado manualmente
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint", // adicionado manualmente
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: [
    "react",
    "prettier", // adicionado manualmente
    "react-hooks", // adicionado manualmente
  ],
  rules: {
    "prettier/prettier": "error", // adicionado manualmente
    "react/jsx-filename-extension": ["warn", { extension: [".jsx", ".js"] }], // adicionado manualmente
    "import/prefer-default-export": "off",
    "no-param-reassign": "off",
    "no-console": ["error", { allow: ["tron"] }],

    "react-hooks/rules-of-hooks": "error", // rules do Hooks
    "react-hooks/exhaustive-deps": "warn", // rules do Hooks
  },
};
