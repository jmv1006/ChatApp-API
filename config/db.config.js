module.exports = {
  host: process.env.DB_ENDPOINT,
  user: "root",
  port: "3306",
  password: process.env.DB_PASSWORD,
  database: "chatapp",
};
