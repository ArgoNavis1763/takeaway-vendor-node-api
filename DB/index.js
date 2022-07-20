const { response } = require("express");
const jwt_decode = require("jwt-decode");
const connectionString = process.env.DATABASE_URL;

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const fetchVendor = async (authorization) => {
  const decoded = jwt_decode(authorization);
  const { sub } = decoded;
  console.log("sub", sub);
  const results = await pool.query(
    "SELECT * FROM vendors where auth_0_id = $1",
    [sub]
  );
  console.log("results", results);
  return results.rows[0];
};

module.exports = {
  pool,
  fetchVendor,
};
