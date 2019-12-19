const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const validators = require('mongoose-validators');

const { Schema } = mongoose;

const ClientsSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  url: {
    type: String,
    required: true,
    validate: validators.isURL(),
  },
  language: String,
  geography: String,
}, { toJSON: { virtuals: true }, timestamps: true });


module.exports = mongoose.model('Clients', ClientsSchema);
