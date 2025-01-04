import express from 'express';
import * as resultController from '../controllers/result.controller.js';
import {authMiddleware} from '../middlewares/auth.midddleware.js'; // For user authentication

const resultRouter = express.Router();

// Route to get all results for a specific student
resultRouter.get('/student', authMiddleware, resultController.getStudentResults);


// Route to get all results for a specific quiz
resultRouter.get('/quiz/:quizId', authMiddleware, resultController.getQuizResults);

// Route to get a specific result for a student and quiz
resultRouter.get('/student/:studentId/quiz/:quizId', authMiddleware, resultController.getSpecificResult);

export default resultRouter;