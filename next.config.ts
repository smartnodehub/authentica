import type { NextConfig } from "next";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [tailwindcss, autoprefixer],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
