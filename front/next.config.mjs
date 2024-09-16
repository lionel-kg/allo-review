/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    //ENVIRONNEMENT: 'dev',
    ENVIRONNEMENT: 'production',
    AUTH_API_BASE_URL: 'http://localhost:4000',
    BDD_API_BASE_URL: 'http://localhost:7000/api',
    MAIL_SMS_BASE_API_URL: 'http://localhost:5000',
    STRIPE_API_BASE_URL: 'http://localhost:9000',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      'pk_test_51P6JmwItkzdIGiy5e63MLvBZwQUbE9emnUD5jl3o0YXp3V5P9ZOv87jxTK428OPknVTjA3hYzbjHER80ndUeeDpK00fD5xLrvc',
    FIREBASE_API_KEY: 'AIzaSyBnfhAF-HZaIGiqC57EXkvNW15l__mgBKY',
    FIREBASE_AUTH_DOMAIN: 'cineflex-d6e61.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'cineflex-d6e61',
    FIREBASE_STORAGE_BUCKET: 'cineflex-d6e61.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '983072955436',
    FIREBASE_APP_ID: '1:983072955436:web:a6ac23e9f7d29113dd4589',
    AUTH_API_BASE_URL: 'https://oauth-faille.lionelkg.com',
    STRIPE_API_BASE_URL: 'https://payment-faille.lionelkg.com',
    BDD_API_BASE_URL: 'https://api-faille.lionelkg.com/api',
    MAIL_SMS_BASE_API_URL: 'https://notif-faille.lionelkg.com',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'media.pathe.fr',
      },
    ],
  },
};

export default nextConfig;
