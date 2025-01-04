import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import axios from "axios";

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const QuizEditForm = ({ initialData, onSubmit }) => {
  const [selectedCourse, setSelectedCourse] = useState(initialData?.course || "");
  const [quizTitle, setQuizTitle] = useState(initialData?.title || "");
  const [quizDescription, setQuizDescription] = useState(initialData?.description || "");
  const [questions, setQuestions] = useState(initialData?.questions || [
    { question: "", options: ["", ""], correctAnswer: "" },
  ]);
  const [testDuration, setTestDuration] = useState(initialData?.duration || "");
  const [startTime, setStartTime] = useState(formatDateTime(initialData?.startTime) || "");
  const [endTime, setEndTime] = useState(formatDateTime(initialData?.endTime) || "");
  const [validationErrors, setValidationErrors] = useState({});
  const [courseId, setCourseID] = useState(initialData?.course._id || "");
  const [courses, setCourses] = useState([]);

  

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const data = async () => {
      try {
        const { data } = await axios.get(
          localStorage.getItem("role") === "teacher" 
          ? "http://localhost:3000/api/v1/course/teacher" 
          : "http://localhost:3000/api/v1/course/all-courses",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateQuestions();
    if (Object.keys(errors).length === 0) {
      const formattedQuestions = questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }));
      const updatedQuizData = {
        title: quizTitle,
        description: quizDescription,
        course: selectedCourse,
        questions: formattedQuestions,
        duration: testDuration,
        startTime,
        endTime,
      };
      onSubmit(updatedQuizData); // Pass data to parent component
    } else {
      setValidationErrors(errors);
    }
  };

  // Handle course selection change
  const handleCourseChange = (e) => {
    setCourseID(e.target.value);
  };

  // Handle quiz title change
  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  // Handle quiz description change
  const handleQuizDescriptionChange = (e) => {
    setQuizDescription(e.target.value);
  };

  // Handle question description change
  const handleQuestionChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].question = value;
    setQuestions(updatedQuestions);
  };

  // Handle option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle correct answer change
  const handleAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", ""], correctAnswer: "" },
    ]);
  };

  // Remove a question
  const removeQuestion = (qIndex) => {
    const updatedQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(updatedQuestions);
  };

  // Add an option to a question
  const addOption = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  // Remove an option from a question
  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, index) => index !== optIndex
    );
    setQuestions(updatedQuestions);
  };

  // Validate questions
  const validateQuestions = () => {
    const errors = {};
    questions.forEach((question, qIndex) => {
      if (!question.question) {
        errors[qIndex] = "Question description is required.";
      }
      if (!question.correctAnswer) {
        errors[`${qIndex}_answer`] = "Please select a correct answer.";
      }
      if (question.options.some((option) => option.trim() === "")) {
        errors[`${qIndex}_options`] = "Options cannot be empty.";
      }
    });
    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Course Selection */}
      <div className="mb-4">
        <label htmlFor="courseSelection" className="form-label">
          Select Course
        </label>
        <select
          className="form-select"
          id="courseSelection"
          value={courseId}
          onChange={handleCourseChange}
          required
        >
          <option value="">Select a course</option>
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))
          ) : (
            <option disabled>No courses available</option>
          )}
        </select>
      </div>

      {/* Quiz Title */}
      <div className="mb-4">
        <label htmlFor="quizTitle" className="form-label">
          Quiz Title
        </label>
        <input
          type="text"
          className="form-control"
          id="quizTitle"
          value={quizTitle}
          onChange={handleQuizTitleChange}
          placeholder="Enter overall quiz title"
        />
        {validationErrors.quizTitle && (
          <div className="text-danger">{validationErrors.quizTitle}</div>
        )}
      </div>

      {/* Quiz Description */}
      <div className="mb-4">
        <label htmlFor="quizDescription" className="form-label">
          Quiz Description / Instructions
        </label>
        <textarea
          className="form-control"
          id="quizDescription"
          value={quizDescription}
          onChange={handleQuizDescriptionChange}
          rows="3"
          placeholder="Enter any instructions or details about the quiz"
        ></textarea>
      </div>

      {/* Questions Section */}
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="card mb-4">
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Question {qIndex + 1}</label>
              <ReactQuill
                value={question.question}
                onChange={(value) => handleQuestionChange(qIndex, value)}
                placeholder="Enter question description"
              />
              {validationErrors[qIndex] && (
                <div className="text-danger">{validationErrors[qIndex]}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Options</label>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="d-flex mb-2">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    placeholder={`Option ${optIndex + 1}`}
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeOption(qIndex, optIndex)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {validationErrors[`${qIndex}_options`] && (
                <div className="text-danger">
                  {validationErrors[`${qIndex}_options`]}
                </div>
              )}
              {question.options.length < 5 && (
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={() => addOption(qIndex)}
                >
                  Add Option
                </button>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Correct Answer</label>
              <select
                className="form-select"
                value={question.correctAnswer}
                onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
              >
                <option value="">Select the correct answer</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {validationErrors[`${qIndex}_answer`] && (
                <div className="text-danger">
                  {validationErrors[`${qIndex}_answer`]}
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeQuestion(qIndex)}
            >
              Remove Question
            </button>
          </div>
        </div>
      ))}
      

      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>

      {/* Start Time */}
      <div className="mb-4">
        <label htmlFor="startTime" className="form-label">
          Start Time
        </label>
        <input
          type="datetime-local"
          className="form-control"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {/* End Time */}
      <div className="mb-4">
        <label htmlFor="endTime" className="form-label">
          End Time
        </label>
        <input
          type="datetime-local"
          className="form-control"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          min={startTime}
        />
      </div>

      <button type="submit" className="btn btn-success">
          Save Changes
        </button>
    </form>
  );
};

export default QuizEditForm;
