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

// popular products
ProductRouter.get("/get-popular-product", async (req, res) => {
  // let { rating,reviewCount } = req.headers;

  try {
    // let data=await Product.find({rating>4})
    let data = await Product.find({ rating: { $gt: 4 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5);
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});
module.exports = { ProductRouter };
