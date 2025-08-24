/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'sabco.com.ng', pathname: '/media/**' },
      { protocol: 'https', hostname: 'www.sabco.com.ng', pathname: '/media/**' },
      { protocol: 'https', hostname: 'api.sabco.com.ng', pathname: '/media/**' }, // if you use a subdomain
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' }, // dev
    ],
  },
}
module.exports = nextConfig