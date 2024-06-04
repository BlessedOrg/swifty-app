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
    DATABASE_URL: process.env.DATABASE_URL,
    OPERATOR_PRIVATE_KEY: process.env.OPERATOR_PRIVATE_KEY,
  },
  images: {
    domains: ["creatorshub.s3.eu-central-1.amazonaws.com", "blessed.fan"],
  },
};

module.exports = nextConfig;
