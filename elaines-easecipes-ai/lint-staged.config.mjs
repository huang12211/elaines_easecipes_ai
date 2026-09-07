export default {
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{ts,tsx}": () => "npm run typecheck",
};
