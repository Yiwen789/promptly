const Question = require('../server/models/question');

exports.createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    console.error('Error getting question:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add other methods as needed for handling CRUD operations on the Question model
