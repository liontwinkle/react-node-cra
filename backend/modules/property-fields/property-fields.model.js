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
  propertyFields: Array
}, { toJSON: { virtuals: true }, timestamps: true });

PropertyFieldsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('PropertyFields', PropertyFieldsSchema);
