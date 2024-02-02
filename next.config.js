/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,  
  // swcMinify: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['thorcollections.s3.us-west-1.amazonaws.com', 'ipfs.io', 'img.joepegs.com']
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/explore/collections',
        permanent: true,
      },
    ]
  }
};

module.exports = nextConfig;
