export default {
  "*": ["secretlint"],
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{ts,tsx}": () => "npm run typecheck",
};
