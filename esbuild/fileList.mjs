import glob from "tiny-glob";

export default async function () {
  const fileList = await glob("./src/**/*.mjs");
  return fileList;
}
