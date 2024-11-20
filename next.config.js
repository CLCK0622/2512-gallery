module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/gallery2512/**",
      },
    ],
  },
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ['legacy-js-api'],
  },
};
