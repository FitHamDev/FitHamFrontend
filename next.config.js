/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS || false;
const repo = 'FitHamFrontend';

module.exports = {
  // Only use static export when building for GitHub Pages
  ...(isGithubPages ? { output: 'export' } : {}),
  basePath: isGithubPages ? `/${repo}` : '',
  assetPrefix: isGithubPages ? `/${repo}/` : '',
};