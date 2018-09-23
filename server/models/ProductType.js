const mongoose = require('mongoose');

const ProductType = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
});

ProductType.index({ name: 'text' });
module.exports = mongoose.model('ProductType', ProductType);
