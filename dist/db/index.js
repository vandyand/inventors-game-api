const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "password",
    port: 3002,
});
module.exports = {
    query: (text, params) => pool.query(text, params),
};
// PGHOST='localhost'
// PGUSER=postgres
// PGDATABASE=postgres
// PGPASSWORD=null
// PGPORT=3002
//# sourceMappingURL=index.js.map