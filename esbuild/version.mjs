import fs from "fs";

const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));

export default version;
