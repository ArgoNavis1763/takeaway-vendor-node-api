const { response } = require("express");
const jwt_decode = require("jwt-decode");
const { pool, fetchVendor } = require("./index");

const update = async (request, response) => {
  const id = parseInt(request.params.id);
  const { authorization } = request.headers;
  const { name, price, vegan, vegetarian } = request.body;
  const vendor = await fetchVendor(authorization);
  const results = await pool.query("SELECT * FROM menu_items WHERE id = $1", [
    id,
  ]);
  if (vendor.id === results.rows[0].vendor_id) {
    pool.query(
      "UPDATE menu_items SET name = $1, price = $2, vegan = $3, vegetarian = $4 WHERE id = $5",
      [name, price, vegan, vegetarian, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  } else {
    response.status(401).send("You do not have the permission to update this.");
  }
};

const getMenuDetails = async (request, response) => {
  try {
    const vendor = await fetchVendor(request.headers.authorization);
    const { company_name, food_type, id } = vendor;

    const { rows: menuItemRows } = await pool.query(
      "SELECT * FROM menu_items WHERE vendor_id = $1",
      [id]
    );

    const data = { ...vendor, menu_items: menuItemRows };

    response.status(200).json(data);
  } catch (error) {
    throw error;
  }
};

const deleteMenuItem = (request, response) => {
  const { authorization } = request.headers;
  const id = parseInt(request.params.id);
  pool.query("DELETE FROM menu_items WHERE id = $1", [id], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Item with ID ${id} has been deleted`);
  });
};

const addMenuItem = async (request, response) => {
  const { name, price, vegan, vegetarian } = request.body;
  const { authorization } = request.headers;
  const decoded = jwt_decode(authorization);
  const { sub } = decoded;
  const results = await pool.query(
    "SELECT * FROM vendors WHERE auth_0_id = $1",
    [sub]
  );
  pool.query(
    "INSERT INTO menu_items (name, price, vegan, vegetarian, vendor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, price, vegan, vegetarian, results.rows[0].id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send();
    }
  );
};

const createOrder = (request, response) => {
  const { customer_id, address_id, vendor_id, menu_items } = request.body;
  console.log(menu_items);
  pool.query(
    "INSERT INTO orders (requested_at, customer_id, address_id, vendor_id) VALUES (current_timestamp, $1, $2, $3) RETURNING *",
    [customer_id, address_id, vendor_id],
    (error, results) => {
      if (error) {
        throw error;
      }

      menu_items.forEach((menu_item) => {
        pool.query(
          "INSERT INTO menu_item_orders (order_id, menu_item_id) VALUES ($1, $2)",
          [results.rows[0].id, menu_item],
          (error, results) => {
            if (error) {
              throw error;
            }
            console.log(results.rows);
          }
        );
      });
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  update,
  getMenuDetails,
  createOrder,
  deleteMenuItem,
  addMenuItem,
};
