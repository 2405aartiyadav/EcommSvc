const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const { AuthRouter } = require("./router/AuthRouter");
const mongoConnect = require("./database/mongooseConnection.js");
const { ProductRouter } = require("./router/ProductRouter.js");
const dotenv = require("dotenv");

const app = express();
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
app.use("/auth", AuthRouter);
app.use("/product", ProductRouter);
const port = process.env.PORT || 8080;
app.get("/test", (req, res) => {
  console.log("test api");
  res.send("test api");
});

app.listen(port, () => {
  mongoConnect();
  console.log(`Server running on ${port} port`);
});
