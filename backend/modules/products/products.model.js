const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  _id: String,
}, { toJSON: { virtuals: true }, timestamps: true });

ProductsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});


module.exports = mongoose.model('PropertyFields', ProductsSchema);

