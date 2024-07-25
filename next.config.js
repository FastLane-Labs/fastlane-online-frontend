const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev')
const path = require('path')

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform()
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    config.resolve.alias['fastlane-atlas-sdk'] = path.resolve(__dirname, 'atlas-sdk-rfq')
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  images: {
    remotePatterns: [{ hostname: '*' }],
    unoptimized: true,
  },
  output: 'export',
}

module.exports = nextConfig
