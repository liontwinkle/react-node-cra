const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertyFieldsSchema = new Schema({
  clientId: {
    type: String,
    default: '',
  },
  objectType: String,
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
}, { toJSON: { virtuals: true }, timestamps: true });

PropertyFieldsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Clients', PropertyFieldsSchema);
