import nextConfig from "eslint-config-next";

// eslint-config-next's own ignores (.next/**, out/**, build/**) are anchored
// to the project root, so they don't reach the nested .next/out copies that
// Netlify's adapter writes under .netlify/. Add that directory explicitly
// as a global ignore (an object with only `ignores` applies everywhere).
const eslintConfig = [{ ignores: [".netlify/**", "_unused-assets-backup/**"] }, ...nextConfig];

export default eslintConfig;
