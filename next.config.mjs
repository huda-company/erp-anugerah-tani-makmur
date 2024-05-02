/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["id", "en"],
    defaultLocale: "id",
    localeDetection: false,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
