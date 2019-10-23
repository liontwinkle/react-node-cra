const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductsFieldsSchema = new Schema({
  clientId: String,
  type: String,
  imageKey: String,
  fields: {},
}, { toJSON: { virtuals: true }, strict: false, timestamps: true });

ProductsFieldsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('ProductsFields', ProductsFieldsSchema);
