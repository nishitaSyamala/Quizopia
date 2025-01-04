import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";
import { Quiz } from "../models/quiz.models.js";

// Create a new course
export const createCourse = async (req, res) => {
	try {
		const { name, description, teacherId } = req.body;

		// Check if the teacher exists
		const teacher = await User.findById(teacherId);
		if (!teacher || teacher.role !== "teacher") {
			return res.status(400).json({ msg: "Teacher not found or invalid role" });
		}

		const existingCourse = await Course.findOne({ name });
		if (existingCourse) {
			return res.status(400).json({ msg: "Course already exists with this name" });
		}

		const newCourse = new Course({
			name,
			description,
			teacher: teacherId,
			students: [],
			quizzes: [],
		});

		await newCourse.save();

		// Associate the course with the teacher
		teacher.courses.push(newCourse._id);
		await teacher.save();

		return res.status(201).json(newCourse);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

//Get All Courses

export const getAllCourses = async (req, res) => {
	try {
		const courses = await Course.find().populate(
			"quizzes"
		).populate('teacher', 'fullName');
		return res.json(courses);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Get all courses for a teacher
export const getTeacherCourses = async (req, res) => {
	try {
		const teacher = await User.findById(req.user._id);

		if (!teacher || teacher.role !== "teacher") {
			return res.status(400).json({ msg: "User is not a teacher" });
		}
		const courses = await Course.find({ teacher: req.user._id }).populate(
			"quizzes"
		).populate('students', '-password').populate('teacher', 'fullName');
		return res.json(courses);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Get all courses for a student
export const getStudentCourses = async (req, res) => {
	try {
		const studentId = req.user._id
		const student = await User.findById(studentId);

		if (!student || student.role !== "student") {
			return res.status(400).json({ msg: "User is not a student" });
		}

		const courses = await Course.find({ students: studentId }).populate(
			"quizzes"
		).populate('teacher', 'fullName');
		return res.json(courses);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Add a student to a course
export const addStudentToCourse = async (req, res) => {
	try {
		const {courseId} = req.body;
		let studentId;

		const role = req.user.role;

		if(role == 'student'){
			studentId = req.user._id;
		}

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(400).json({ msg: "Course not found" });
		}

		const student = await User.findById(studentId);
		if (!student || student.role !== "student") {
			return res.status(400).json({ msg: "Student not found or invalid role" });
		}

		if (course.students.includes(studentId)) {
			return res
				.status(400)
				.json({ msg: "Student is already enrolled in this course" });
		}

		course.students.push(studentId);
		student.courses.push(courseId);

		await course.save();
		await student.save();

		return res.json({ msg: "Student added to course", course });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Remove a student from a course
export const removeStudentFromCourse = async (req, res) => {
	try {
		const { courseId, studentId } = req.body;

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(400).json({ msg: "Course not found" });
		}

		const student = await User.findById(studentId);
		if (!student || student.role !== "student") {
			return res.status(400).json({ msg: "Student not found or invalid role" });
		}

		course.students = course.students.filter((id) => !id.equals(studentId));
		student.courses = student.courses.filter((id) => !id.equals(courseId));

		await course.save();
		await student.save();

		return res.json({ msg: "Student removed from course" });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Add a quiz to a course
export const addQuizToCourse = async (req, res) => {
	try {
		const { courseId, quizId } = req.body;

		const course = await Course.findById(courseId);
		const quiz = await Quiz.findById(quizId);

		if (!course || !quiz) {
			return res.status(400).json({ msg: "Course or Quiz not found" });
		}

		if (course.quizzes.includes(quizId)) {
			return res
				.status(400)
				.json({ msg: "Quiz already associated with this course" });
		}

		course.quizzes.push(quizId);
		await course.save();

		return res.json({ msg: "Quiz added to course" });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Get a specific course's details
export const getCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.params;

		console.log(req.params);

		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(404).json({ msg: "Course not found" });
		}

		return res.json(course);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Add a teacher to a course (admin only)
export const addTeacherToCourse = async (req, res) => {
	try {
		const { courseId, teacherId } = req.body;

		console.log(req.body);

		const course = await Course.findById(courseId);
		const teacher = await User.findById(teacherId);

		if (!course) {
			return res.status(400).json({ msg: "Course not found" });
		}

		if (!teacher || teacher.role !== "teacher") {
			return res.status(400).json({ msg: "Teacher not found or invalid role" });
		}

		// Ensure that the course does not already have the teacher
		if (course.teacher?.equals(teacherId)) {
			return res
				.status(400)
				.json({ msg: "Teacher is already assigned to this course" });
		}

		course.teacher = teacherId;
		await course.save();

		// Remove the course from the previous teacher's list if applicable
		if (course.previousTeacher) {
			const previousTeacher = await User.findById(course.previousTeacher);
			if (previousTeacher) {
				previousTeacher.courses = previousTeacher.courses.filter(
					(courseId) => !courseId.equals(course._id)
				);
				await previousTeacher.save();
			}
		}

		// Store the previous teacher
		course.previousTeacher = course.teacher;
		await course.save();

		// Update teacher's courses list
		teacher.courses.push(courseId);
		await teacher.save();

		return res.json({ msg: "Teacher added to course" });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

// Remove a teacher from a course (admin only)
export const removeTeacherFromCourse = async (req, res) => {
	try {
		const { courseId } = req.body;

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(400).json({ msg: "Course not found" });
		}

		const previousTeacher = await User.findById(course.teacher);
		if (!previousTeacher) {
			return res.status(400).json({ msg: "Previous teacher not found" });
		}

		course.teacher = null; // Remove the teacher from the course
		await course.save();

		// Remove the course from the teacher's courses list
		previousTeacher.courses = previousTeacher.courses.filter(
			(id) => !id.equals(course._id)
		);
		await previousTeacher.save();

		return res.json({ msg: "Teacher removed from course" });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

export const removeQuizFromCourse = async (req, res) => {
	try {
		const { courseId, quizId } = req.body;

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(400).json({ msg: "Course not found" });
		}

		// Check if the quiz is part of the course
		if (!course.quizzes.includes(quizId)) {
			return res
				.status(400)
				.json({ msg: "Quiz not associated with this course" });
		}

		// Remove the quiz from the course quizzes array
		course.quizzes = course.quizzes.filter((id) => !id.equals(quizId));
		await course.save();

		return res.json({ msg: "Quiz removed from course" });
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("Server Error");
	}
};

export const deleteCourse = async (req, res) => {
	try {
	  const { courseId } = req.params;
  
	  // Find the course
	  const course = await Course.findById(courseId);
	  if (!course) {
		return res.status(404).json({ msg: "Course not found" });
	  }
  
	  // Remove the course from all students' courses
	  await User.updateMany(
		{ _id: { $in: course.students } },
		{ $pull: { courses: courseId } }
	  );
  
	  // Remove the course from the teacher's courses
	  const teacher = await User.findById(course.teacher);
	  if (teacher) {
		teacher.courses = teacher.courses.filter((id) => !id.equals(courseId));
		await teacher.save();
	  }
  
	  // Remove the related quizzes and delete them
	  await Quiz.deleteMany({ _id: { $in: course.quizzes } });
  
	  // Delete the course
	  await course.deleteOne();
  
	  return res.json({ msg: "Course and related quizzes deleted successfully" });
	} catch (error) {
	  console.error(error.message);
	  return res.status(500).send("Server Error");
	}
  };

export const editAllDetailsCourse = async (req, res) => {
	try {
	  const { courseId } = req.params;
	  const { name, description, teacherId } = req.body;
  
	  // Check if the new teacher exists
	  const teacher = await User.findById(teacherId);
	  if (!teacher || teacher.role !== "teacher") {
		return res.status(400).json({ msg: "Teacher not found or invalid role" });
	  }
  
	  // Check if the course exists
	  const existingCourse = await Course.findById(courseId);
	  if (!existingCourse) {
		return res.status(400).json({ msg: "Course does not exist with this ID" });
	  }
  
	  // Check if the course has an existing teacher
	  const previousTeacher = await User.findById(existingCourse.teacher);
	  if (previousTeacher) {
		// Remove the course from the previous teacher's list
		previousTeacher.courses = previousTeacher.courses.filter(courseId => !courseId.equals(existingCourse._id));
		await previousTeacher.save();
	  }
  
	  // Update the course with new values
	  existingCourse.name = name || existingCourse.name;
	  existingCourse.description = description || existingCourse.description;
	  existingCourse.teacher = teacherId;
  
	  // Save the updated course
	  await existingCourse.save();
  
	  // Add the course to the new teacher's courses list
	  teacher.courses.push(existingCourse._id);
	  await teacher.save();
  
	  return res.status(200).json(existingCourse);
	} catch (error) {
	  console.error(error.message);
	  return res.status(500).send("Server Error");
	}
  };