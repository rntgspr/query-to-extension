import dotenv from "dotenv";
import esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

import watcher from "./watcher.mjs";
import version from "./version.mjs";
import fileList from "./fileList.mjs";

dotenv.config();

(async () => {
  const entryPoints = await fileList();

  const context = await esbuild.context({
    outbase: "src",
    outdir: "./dist",
    format: "esm",
    platform: "browser",
    bundle: false,
    logLevel: process.env.NODE_ENV !== "development" ? "info" : "debug",
    packages: "external",
    minify: process.env.NODE_ENV !== "development",
    define: {
      VERSION: JSON.stringify(version),
    },
    entryPoints,
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: {
          from: ["./src/index.d.ts"],
          to: ["./dist"],
        },
        watch: true,
      }),
      copy({
        resolveFrom: "cwd",
        assets: {
          from: ["./README.md"],
          to: ["./dist/README.md"],
        },
      }),
    ],
  });

  await watcher(context);
})();
