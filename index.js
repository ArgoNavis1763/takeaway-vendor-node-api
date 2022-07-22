const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const db = require("./queries");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const menuItems = require("./DB/menu_items");
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://paddington.eu.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://paddington.eu.auth0.com/api/v2/",
  issuer: "https://paddington.eu.auth0.com/",
  algorithms: ["RS256"],
});

app.get("/", (request, response) => {
  response.json({ hello: "world" });
});

app.get("/customers", db.getCustomers);
app.get("/customers/:id", db.getCustomer);
app.post("/customers", db.createCustomer);
app.delete("/customers/:id", db.deleteCustomer);
app.patch("/customers/:id", db.editNumber);
app.post("/orders", menuItems.createOrder);

app.get("/vendor_details", checkJwt, menuItems.getMenuDetails);
app.get("/vendors/menu_item/:id", menuItems.getMenuItem);
app.patch("/vendors/menu_item/:id", menuItems.update);
app.delete("/vendors/menu_item/:id", menuItems.deleteMenuItem);
app.post("/vendors", menuItems.addMenuItem);

app.listen(port, () => {
  console.log("My node app is running on port", port);
});
