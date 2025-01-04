import express from 'express';
import {authMiddleware} from '../middlewares/auth.midddleware.js'; // Authentication middleware
import * as courseController from '../controllers/course.controller.js';

const courseRouter = express.Router();

// Create a new course
courseRouter.post('/create', authMiddleware, courseController.createCourse);

courseRouter.get('/all-courses', authMiddleware, courseController.getAllCourses);


// Get all courses for a teacher
courseRouter.get('/teacher', authMiddleware, courseController.getTeacherCourses);


// Get all courses for a student
courseRouter.get('/student', authMiddleware, courseController.getStudentCourses);

// Add a student to a course (admin/teacher only)
courseRouter.post('/add-student', authMiddleware, courseController.addStudentToCourse);

// Remove a student from a course (admin/teacher only)
courseRouter.post('/remove-student', authMiddleware, courseController.removeStudentFromCourse);

// Add a quiz to a course (admin/teacher only)
courseRouter.post('/add-quiz', authMiddleware, courseController.addQuizToCourse);

// Get a specific course's details
courseRouter.get('/:courseId', authMiddleware, courseController.getCourseDetails);

// Add a teacher to a course (admin only)
courseRouter.post('/add-teacher', authMiddleware, courseController.addTeacherToCourse);

// Remove a teacher from a course (admin only)
courseRouter.post('/remove-teacher', authMiddleware, courseController.removeTeacherFromCourse);

// Remove a quiz from a course (admin/teacher only)
courseRouter.post('/remove-quiz', authMiddleware, courseController.removeQuizFromCourse);

// Delete a course
courseRouter.delete('/delete/:courseId', authMiddleware, courseController.deleteCourse);

// Edit a course
courseRouter.put('/edit-all/:courseId', authMiddleware, courseController.editAllDetailsCourse);

export default courseRouter;