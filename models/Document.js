const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        validate: /^[a-zA-Z0-9\s]{1,50}$/,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    sharedWith: {
      type: [String],
      default: [],
    }
});

module.exports = mongoose.model('Document', documentSchema);