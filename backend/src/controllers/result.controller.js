import { Result } from '../models/result.models.js';

// Get all results for a specific student
export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch all results for the student
    const results = await Result.find({ student: studentId }).populate({path:'quiz', populate:{
      path:'course',
      model:'Course'
    }}).sort({ createdAt: -1 });

    return res.json(results);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error fetching results' });
  }
};

// Get results for a specific quiz
export const getQuizResults = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    // Fetch all results for the quiz
    const results = await Result.find({ quiz: quizId }).populate('student quiz').sort({ createdAt: -1 });

    return res.json(results);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error fetching quiz results' });
  }
};

// Get a specific result (for a student and quiz)
export const getSpecificResult = async (req, res) => {
  try {
    const { studentId, quizId } = req.params;

    // Fetch the result for the student and quiz
    const result = await Result.findOne({ student: studentId, quiz: quizId }).populate('quiz student');
    if (!result) {
      return res.status(404).json({ msg: 'Result not found' });
    }

    return res.json(result);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Error fetching specific result' });
  }
};