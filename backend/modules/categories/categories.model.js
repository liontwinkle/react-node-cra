const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String,
  _id: {
    type: Number,
    default: 0,
  },
  parent_id: {
    type: Number,
    default: null,
  },
  linkedId: [{
    value: String,
    label: String,
  }],
  template: Object,
  properties: Object,
  defaultProperties: [{
    key: String,
    default: String,
    template: String,
  }],
  rules: Array,
}, { timestamps: true });

let Categories = mongoose.model('Categories', CategorySchema);

/**
 *
 * @param type
 * @returns {Model}
 * Category collections will be changed or created dynamically
 */
const CategoryModel = (type = 'taxonomy') => {
  Categories = mongoose.model(type, CategorySchema);
  return Categories;
};

module.exports = CategoryModel;
