import * as dotenv from "dotenv";
dotenv.config();
export default {
  POST: process.env.POST,
  HOST: process.env.HOST,
};
