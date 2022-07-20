const { response } = require("express");
const jwt_decode = require("jwt-decode");
const { pool, fetchVendor } = require("./DB/index");

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

module.exports = {
  getCustomers,
  createCustomer,
  getCustomer,
  deleteCustomer,
  editNumber,
};
