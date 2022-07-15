const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const db = require("./queries");
const cors = require("cors");
const { process_params } = require("express/lib/router");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ hello: "world" });
});

app.get("/customers", db.getCustomers);
app.get("/customers/:id", db.getCustomer);
app.post("/customers", db.createCustomer);
app.delete("/customers/:id", db.deleteCustomer);
app.patch("/customers/:id", db.editNumber);
app.post("/orders", db.createOrder);
app.get("/vendors/:id", db.getVendorDetailsAsVendor);
app.patch("/vendors/menu_item/:id", db.updateMenuItem);
app.get("/vendors/menu_item/:id", db.getMenuItemAsVendor);
app.delete("/vendors/menu_item/:id", db.deleteMenuItem);
app.post("/vendors/:vendorid", db.addMenuItem);

app.listen(port, () => {
  console.log("My node app is running on port", port);
});
