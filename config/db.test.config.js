module.exports = {
    host: process.env.TEST_DB_ENDPOINT,
    user: "root",
    port: 3306,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
};


  