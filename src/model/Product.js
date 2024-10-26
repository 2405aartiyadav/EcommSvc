const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  rating: Number,
  discount: Number,
  reviewCount: Number,
  category: String,
  description: String,
  features: [String],
  images: [String],
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
