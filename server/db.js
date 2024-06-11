const {Pool} = require('pg')

//172.18.0.4

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'orpheus_db',
    password: 'orpheus',
    port: 5432,
})

module.exports = {
    query: (text, params) => pool.query(text, params)
};