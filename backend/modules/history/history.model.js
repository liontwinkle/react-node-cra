const mongoose = require('mongoose');

const { Schema } = mongoose;

const HistorySchema = new Schema({
  label: String,
  itemId: String,
  type: String,
}, { toJSON: { virtuals: true }, timestamps: true });

HistorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

let Histories = mongoose.model('History', HistorySchema);

/**
 *
 * @param type
 * @returns {Model}
 * Category collections will be changed or created dynamically
 */
const HistoryModel = (type = 'taxonomy') => {
  Histories = mongoose.model(type, HistorySchema);
  return Histories;
};

module.exports = HistoryModel;
