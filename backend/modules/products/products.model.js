const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductsSchema = new Schema({
  _id: String,
}, { toJSON: { virtuals: true }, strict: false, timestamps: true });

/**
 * @param type
 * @returns {Model}
 * Category collections will be changed or created dynamically
 */
const ProductsModel = (type = 'taxonomy') => mongoose.model(type, ProductsSchema);

module.exports = ProductsModel;
