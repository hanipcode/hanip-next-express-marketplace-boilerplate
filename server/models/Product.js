const mongoose = require('mongoose');

const Product = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductType', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: [{ type: String, required: true }],
  name: { type: String, required: true },
  price: { type: String, required: true },
  price_unit_name: { type: String, required: true },
  stock: { type: String, required: true },
  stock_unit_name: { type: String, required: true },
  description: { type: String, required: true },
  location_coordinate: String,
  location_name: String,
});

module.exports = mongoose.model('Product', Product);
