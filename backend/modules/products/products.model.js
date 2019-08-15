const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  _id: String,
}, { toJSON: { virtuals: true }, timestamps: true });



/**
 *
 * @param type
 * @returns {Model}
 * Category collections will be changed or created dynamically
 */
const ProductsModel = (type = 'taxonomy') => {
  Products = mongoose.model(type, ProductsSchema);
  return Products;
};

module.exports = ProductsModel;
