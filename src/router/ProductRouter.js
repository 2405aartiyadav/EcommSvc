const express = require("express");
const ProductRouter = express.Router({ strict: true });
const Product = require("../model/Product.js");

ProductRouter.get("/get-all-products", async (req, res) => {
  try {
    let data = await Product.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});
module.exports = { ProductRouter };
