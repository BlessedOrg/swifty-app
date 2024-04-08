/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    THIRDWEB_FACTORY_ADDRESS: process.env.THIRDWEB_FACTORY_ADDRESS,
    GELATO_API_KEY: process.env.GELATO_API_KEY,
    THIRDWEB_AUTH_PRIVATE_KEY: process.env.THIRDWEB_AUTH_PRIVATE_KEY,
    THIRDWEB_AUTH_SECRET_KEY: process.env.THIRDWEB_AUTH_SECRET_KEY,
    GELATO_API_KEY: process.env.GELATO_API_KEY,
  },
};

module.exports = nextConfig;
