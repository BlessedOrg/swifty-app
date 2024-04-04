/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    THIRDWEB_FACTORY_ADDRESS: process.env.THIRDWEB_FACTORY_ADDRESS,
    GELATO_API_KEY: process.env.GELATO_API_KEY,
  },
};

module.exports = nextConfig;
