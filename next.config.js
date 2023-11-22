/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["res.cloudinary.com", "api.dicebear.com"],
  },
}

module.exports = nextConfig
