import express from 'express';
import * as quizController from '../controllers/quizzes.controller.js';
import {authMiddleware} from '../middlewares/auth.midddleware.js';

const quizRouter = express.Router();

// Route to create a new quiz
quizRouter.post('/create', authMiddleware, quizController.createQuiz);

quizRouter.get('/all', authMiddleware, quizController.getAllQuizzes);
quizRouter.get('/teacher-quizzes', authMiddleware, quizController.getAllTeacherQuizzes);
quizRouter.get('/student-quizzes', authMiddleware, quizController.getAllStudentQuizzes);



// Route to get unpublished quizzes and their results
quizRouter.get('/unpublished', authMiddleware, quizController.getUnpublishedQuizzesResults);

// Route to publish an individual quiz
quizRouter.put('/:quizId/publish', authMiddleware, quizController.publishQuiz);

// Route to get a quiz by ID
quizRouter.get('/:quizId', authMiddleware, quizController.getQuizById);

// Route to get all quizzes by course ID
quizRouter.get('/course/:courseId', authMiddleware, quizController.getQuizzesByCourse);

// Route to update a quiz
quizRouter.put('/:quizId', authMiddleware, quizController.updateQuiz);

// Route to delete a quiz
quizRouter.delete('/:quizId', authMiddleware, quizController.deleteQuiz);

// Route to submit quiz answers (for students)
quizRouter.post('/:quizId/submit', authMiddleware, quizController.submitQuizAnswers);

export default quizRouter;