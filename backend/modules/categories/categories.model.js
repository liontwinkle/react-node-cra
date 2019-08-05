const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: String,
  parentId: {
    type: String,
    default: '',
  },
  depth: {
    type: Number,
    default: 0,
  },
  properties: Object,
  sections: [{
    key: String,
    label: String,
    order: Number,
  }],
  propertyFields: [{
    key: String,
    label: String,
    propertyType: String,
    section: String,
    items:[{
      key:String,
      label:String
    }],
    order: Number,
  }],
  rules: Object,
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
