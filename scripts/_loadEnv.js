const path = require("path");
const dotenv = require("dotenv");

const envFile = process.env.ENV_FILE || ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`✅ Script usando ENV_FILE=${envFile} NODE_ENV=${process.env.NODE_ENV || "?"}`);
