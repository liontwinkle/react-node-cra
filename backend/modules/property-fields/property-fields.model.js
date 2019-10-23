const mongoose = require('mongoose');

const { Schema } = mongoose;

const PropertyFieldsSchema = new Schema({
  clientId: String,
  type: String,
  sections: [{
    key: String,
    label: String,
    order: Number,
  }],
  propertyFields: [{
    key: String,
    label: String,
    default: String,
    propertyType: String,
    section: String,
    template: String,
    items: [{
      key: String,
      label: String
    }],
    order: Number,
  }],
}, { toJSON: { virtuals: true }, timestamps: true });

PropertyFieldsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('PropertyFields', PropertyFieldsSchema);
