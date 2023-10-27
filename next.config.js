/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: 'construtoraagvelasco.com.br' }],
  },
};

module.exports = nextConfig;
