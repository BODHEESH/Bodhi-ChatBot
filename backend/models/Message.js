const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'code', 'voice'],
    default: 'text'
  },
  metadata: {
    fileInfo: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number
    },
    codeInfo: {
      language: String,
      executable: Boolean
    },
    voiceInfo: {
      duration: Number,
      transcript: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
