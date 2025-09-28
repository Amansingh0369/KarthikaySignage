/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ['karthikay11.s3.ap-southeast-2.amazonaws.com'],
  },
};