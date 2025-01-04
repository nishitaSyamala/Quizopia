import {Quiz} from '../models/quiz.models.js';
import {Result} from '../models/result.models.js';
import {User} from '../models/user.models.js';
import { Course } from '../models/course.models.js';

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, duration, startTime, endTime, course } = req.body;

    // Ensure required fields are present
    if (!title || !description || !questions || !duration || !startTime || !endTime || !course) {
      return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    const quiz = new Quiz({
      title,
      description,
      createdBy: req.user.id, // Assuming req.user.id contains the ID of the logged-in user (teacher/admin)
      course,
      questions,
      duration,
      startTime,
      endTime,
      publish: req.user.role == 'admin' ? true : false
    });

    await quiz.save();

     // Find the course and update its quizzes array
     const courseToUpdate = await Course.findById(course);
     if (!courseToUpdate) {
       return res.status(404).json({ msg: 'Course not found.' });
     }
 
     // Add the quiz to the course's quizzes array
     courseToUpdate.quizzes.push(quiz._id);
     
     // Save the updated course
     await courseToUpdate.save();

    return res.status(201).json({ msg: 'Quiz created successfully', quiz });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get quiz details by ID
export const getQuizById = async (req, res) => {
  try {

    console.log(req.params.quizId);
    
    const quiz = await Quiz.findById(req.params.quizId).populate('createdBy', 'name email').populate('course');
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    return res.json(quiz);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get all quizzes for a course
export const getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, publish:true });
    if (quizzes.length === 0) {
      return res.status(404).json({ msg: 'No quizzes found for this course' });
    }
    return res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({publish:true}).populate('createdBy', 'fullName').populate('course', 'name');
    if (quizzes.length === 0) {
      return res.status(404).json({ msg: 'No quizzes found for this course' });
    }
    return res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};


export const getAllTeacherQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({publish:true, createdBy: req.user._id}).populate('createdBy', 'fullName').populate('course', 'name');
    if (quizzes.length === 0) {
      return res.status(404).json({ msg: 'No quizzes found for this course' });
    }
    return res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const { title, description, questions, duration, startTime, endTime, isPublished } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Only allow the creator of the quiz to update it
    // if (quiz.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({ msg: 'You are not authorized to update this quiz' });
    // }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;
    quiz.duration = duration || quiz.duration;
    quiz.startTime = startTime || quiz.startTime;
    quiz.endTime = endTime || quiz.endTime;
    // quiz.isPublished = isPublished !== undefined ? isPublished : quiz.isPublished;

    await quiz.save();
    return res.json({ msg: 'Quiz updated successfully', quiz });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Only allow the creator of the quiz to delete it
    if (quiz.createdBy.toString() !== req.user.id || !req.user.role == 'admin') {
      return res.status(403).json({ msg: 'You are not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    return res.json({ msg: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Submit answers for a quiz (student)
export const submitQuizAnswers = async (req, res) => {
  try {
    const {  answers } = req.body;

const {quizId} = req.params;    

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ msg: 'Quiz not found' });
    }

    const student = await User.findById(req.user.id);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ msg: 'Only students can submit answers' });
    }

     // Calculate the score
        let score = 0;
        answers.forEach(answer => {
          const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
          if (question && question.correctAnswer === answer.studentAnswer) {
            answer.isCorrect = true;
            score += 1; // Increment score if the answer is correct
          } else {
            answer.isCorrect = false;
          }
        });
    
        // Create the result document
        const result = new Result({
          student,
          quiz,
          answers,
          score,
        });
    
        // Save the result to the database
        await result.save();

    return res.json({ msg: 'Quiz submitted successfully', result });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};


// Get unpublished quizzes and their results
export const getUnpublishedQuizzesResults = async (req, res) => {
  try {
    // Fetch all quizzes that are unpublished
    const unpublishedQuizzes = await Quiz.find({ publish: false }).populate('createdBy', 'fullName').populate('course', 'name');

    if (unpublishedQuizzes.length === 0) {
      return res.status(404).json({ msg: 'No unpublished quizzes found' });
    }

    // Fetch results for each quiz

    return res.json(unpublishedQuizzes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// Publish an individual quiz
export const publishQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    console.log(quizId);
    
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Update the quiz to be published
    quiz.publish = true;
    await quiz.save();

    return res.json({ msg: 'Quiz published successfully', quiz });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// Get all quizzes for a student across all courses they are enrolled in
export const getAllStudentQuizzes = async (req, res) => {
  try {
    // Find the student by their ID
    const student = await User.findById(req.user.id).populate('courses'); // Assuming 'courses' is an array of course IDs

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    

    // Get all the course IDs the student is enrolled in
    const courseIds = student.courses.map(course => course._id);

    // Fetch all quizzes for the courses the student is enrolled in, only published quizzes
    const quizzes = await Quiz.find({ course: { $in: courseIds }, publish: true }).populate('course', 'name').populate('createdBy', 'fullName');

    if (quizzes.length === 0) {
      return res.status(404).json({ msg: 'No quizzes found for the student in their courses' });
    }

    return res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};