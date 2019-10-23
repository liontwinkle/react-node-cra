const mongoose = require('mongoose');

const { Schema } = mongoose;

const AppearSchema = new Schema({
  attributeId: Number,
  categoryId: Number
}, { toJSON: { virtuals: true }, strict: true, timeStamp: true });

AppearSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

let Appears = mongoose.model('Appears', AppearSchema);

const AppearModel = (type = 'taxonomy') => {
  Appears = mongoose.model(type, AppearSchema);
  return Appears;
};

module.exports = AppearModel;
