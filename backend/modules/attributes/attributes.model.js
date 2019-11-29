const mongoose = require('mongoose');

const { Schema } = mongoose;

const AttributeSchema = new Schema({
  name: String,
  _id: {
    type: Number,
    default: 0
  },
  group_id: {
    type: Number,
    default: null,
  },
  template: Object,
  properties: Object,
  defaultProperties: Array,
  rules: Array,
}, { timestamps: true });

let Attributes = mongoose.model('Attributes', AttributeSchema);

/**
 * @param type
 * @returns {Model}
 * Attribute collections will be changed or created dynamically
 */
const AttributeModel = (type = 'taxonomy') => {
  Attributes = mongoose.model(type, AttributeSchema);
  return Attributes;
};

module.exports = AttributeModel;
