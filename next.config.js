/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "sellnity.s3.ap-southeast-1.amazonaws.com",
      "cdn2.iconfinder.com",
    ],
  },
};

module.exports = nextConfig;
