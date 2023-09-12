const mongoose = require('mongoose');

const shareableLinkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document', // Reference to the Document model
    required: true,
  },
  owner: {
    type: String, // Mobile number of the document owner
    required: true,
  },
  linkToken: {
    type: String, // Unique token or identifier for the shareable link
    required: true,
    unique: true,
  },
  accessedUsers: [
    {
      mobileNumber: String, // Mobile number of users who accessed the document
      accessTimestamp: Date, // Timestamp when the user accessed the document
    },
  ],
});

module.exports = mongoose.model('ShareableLink', shareableLinkSchema);
