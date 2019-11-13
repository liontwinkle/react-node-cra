const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String,
  categoryId: {
    type: Number,
    default: 0,
  },
  parentId: {
    type: String,
    default: 'null',
  },
  properties: Object,
  defaultProperties: [{
    key: String,
    default: String,
    template: String,
  }],
  rules: [{
    basis: String,
    refer: String,
    value: String,
    scope: Number,
    ruleType: String,
  }],
}, { toJSON: { virtuals: true }, timestamps: true });

CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

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
