const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ContactSchema = mongoose.Schema({
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  Email: {
    type: String,
  },
  Phone: {
    type: String,
  },
  Address: {
    type: String,
  },
});

ContactSchema.plugin(mongoosePaginate);

const ContactModel = mongoose.model('Users', ContactSchema);
module.exports = ContactModel;
