require("dotenv").config();
module.exports = {
  //DB settings
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbPassword: process.env.DB_PASSWORD,
  dbUser: process.env.DB_USER,
  mongoURI: process.env.MONGO_URI,
  //SYSTEM CONFIG
  dev: process.env.NODE_ENV !== "production",
  port: process.env.SERVER_PORT,
  serverUrl:
    process.env.NODE_ENV !== "production"
      ? `http://localhost:${process.env.SERVER_PORT}`
      : process.env.SERVER_URL,
  //Auth
  authJwtSecret: process.env.AUTH_JWT_SECRET
};
