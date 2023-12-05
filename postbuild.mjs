import "dotenv/config";
import fs from "fs";

import packageJson from "./package.json" assert { type: "json" };

const peerDependencies = ["@tanstack/react-query", "@types/chrome"];

fs.writeFileSync(
  "./dist/package.json",
  JSON.stringify(
    {
      ...packageJson,
      files: undefined,
      scripts: undefined,
      devDependencies: undefined,
      dependencies: undefined,
      peerDependencies: Object.keys(packageJson.dependencies).reduce(
        (acc, item) => {
          if (peerDependencies.indexOf(item) !== -1) {
            acc[item] = packageJson.dependencies[item];
          }

          return acc;
        },
        {}
      ),
      main: "./index.js",
    },
    null,
    2
  )
);
