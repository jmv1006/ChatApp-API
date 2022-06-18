module.exports = {
  host: process.env.DB_ENDPOINT,
  user: "root",
  port: 3290,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
