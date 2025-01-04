import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Student who took the quiz
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // The quiz being attempted
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions' },
    studentAnswer: { type: String },
    isCorrect: { type: Boolean }
  }],
  score: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export const Result = mongoose.model('Result', resultSchema);