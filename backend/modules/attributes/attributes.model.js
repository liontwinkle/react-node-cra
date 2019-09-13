const mongoose = require('mongoose');

const { Schema } = mongoose;

const AttributeSchema = new Schema({
  name: String,
  groupId: {
    type: String,
    default: '',
  },
  appear: [],
}, { toJSON: { virtuals: true }, timestamps: true });

AttributeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

let Attributes = mongoose.model('Attributes', AttributeSchema);

/**
 *
 * @param type
 * @returns {Model}
 * Category collections will be changed or created dynamically
 */
const AttributeModel = (type = 'taxonomy') => {
  Attributes = mongoose.model(type, AttributeSchema);
  return Attributes;
};

module.exports = AttributeModel;
