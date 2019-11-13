const mongoose = require('mongoose');

const { Schema } = mongoose;

const AttributeSchema = new Schema({
  name: String,
  attributeId: {
    type: Number,
    default: 0
  },
  groupId: {
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
    type: String,
  }],
}, { toJSON: { virtuals: true }, timestamps: true });

AttributeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

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
