import mongoose from 'mongoose';

// Define the Quiz schema with embedded questions
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Changed "teacher" to "createdBy" to store the ID of the user who created the quiz
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Reference to the course the quiz belongs to
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  // Embedded array of question objects
  questions: [{
    question: { type: String, required: true },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswer: { type: String, required: true },
  }],
  
  // Duration of the quiz in minutes
  duration: { type: Number, required: true },
  
  // Start and End time of the quiz
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  publish: { type: Boolean, default: false },


  // Automatically managed createdAt and updatedAt timestamps
}, { timestamps: true });

// Create and export the model
export const Quiz = mongoose.model('Quiz', QuizSchema);
