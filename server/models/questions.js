const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  request: {
    type: String,
    required: true
  },
  questionList: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);
