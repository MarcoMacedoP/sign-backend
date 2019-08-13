require("dotenv").config();
module.exports = {
  //DB settings
  dbName        : process.env.DB_NAME,
  dbHost        : process.env.DB_HOST,
  dbPort        : process.env.DB_PORT,
  dbPassword    : process.env.DB_PASSWORD,
  dbUser        : process.env.DB_USER,
  //SYSTEM CONFIG
  dev           : process.env.NODE_ENV !== "production",
  port          : process.env.SERVER_PORT,
  //Auth
  authJwtSecret : process.env.AUTH_JWT_SECRET
};
