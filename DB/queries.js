const { response } = require("express");
const jwt_decode = require("jwt-decode");
const { pool, fetchVendor } = require("./index");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const getCustomers = (request, response) => {
  pool.query("SELECT * FROM customers", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCustomer = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM customers WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const deleteCustomer = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM customers WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Customer with id ${id} has been deleted`);
  });
};

const createCustomer = (request, response) => {
  const { name, phone, date_of_birth } = request.body;
  pool.query(
    "INSERT INTO customers ( name, phone, date_of_birth) VALUES ( $1, $2, $3) RETURNING *",
    [name, phone, date_of_birth],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`Customers created with id ${results.rows[0].id}`);
    }
  );
};

const editNumber = (request, response) => {
  const { phone } = request.body;
  const id = parseInt(request.params.id);
  pool.query(
    "UPDATE customers SET phone = $1 WHERE id = $2 RETURNING *",
    [phone, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createVendor = async (request, response) => {
  const { name, food_type, postcode, description, auth_0_id } = request.body;
  const id = parseInt(request.params.id);
  const decoded = jwt_decode(authorization);
  const { sub } = decoded;
  const result = await pool.query(
    "INSERT INTO vendors (name, food_type, postcode, description, auth_0_id) VALUES ($1, $2, $3, $4, $5",
    [name, food_type, postcode, description, sub]
  );
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomer,
  deleteCustomer,
  editNumber,
  createVendor,
};
