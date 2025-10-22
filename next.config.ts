import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (required for Next.js 16)
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    // Disable canvas for react-pdf
    config.resolve.alias.canvas = false;
    
    // Fix for react-pdf on server side
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas'];
    }
    
    return config;
  },
  
  // Rewrite uppercase API routes to lowercase (for document verification)
  async rewrites() {
    return [
      {
        source: '/API/doc_verification',
        destination: '/api/doc_verification',
      },
    ];
  },
  
  // Allow loading PDFs from external sources
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
