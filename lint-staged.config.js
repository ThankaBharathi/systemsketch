module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',           // Fix linting errors
    'prettier --write',       // Format code
  ],

  // JSON, Markdown, YAML files
  '*.{json,md,yml,yaml}': [
    'prettier --write',       // Format only
  ],

  // CSS files
  '*.{css,scss}': [
    'prettier --write',       // Format only
  ],
};