import * as dotenv from "dotenv";
dotenv.config();
export default {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  DB_URL: process.env.DB_URL,
};
