module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "airbnb",
    "prettier", // adicionado manualmente
    "preetier/react" // adicionado manualmente
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint", // adicionado manualmente
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    "react",
    "prettier" // adicionado manualmente
  ],
  rules: {
    "prettier/prettier": "error", // adicionado manualmente
    "react/jsx-filename-extension": ["warn", { extension: [".jsx", ".js"] }], // adicionado manualmente
    "import/prefer-default-export": "off"
  }
};
