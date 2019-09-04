const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String,
  parentId: {
    type: String,
    default: '',
  },
  properties: Object,
  rules: Object,
  newRules: [{
    basis: String,
    refer: String,
    value: String,
    scope: Number
  }],
  ruleKeys: [{
    key: String,
    label: String,
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
