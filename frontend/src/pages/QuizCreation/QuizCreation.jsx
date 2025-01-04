import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const QuizForm = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([
    { description: "", options: ["", ""], answer: "" },
  ]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [courseId, setCourseID]=useState("");
  const [courses,setCourses] = useState([]);

  const navigate = useNavigate();

 
  // This ensures that endTime cannot be before startTime by validating both date and time
  useEffect(() => {
    // If endTime is before startTime, reset endTime to startTime
    if (endTime && endTime < startTime) {
      setEndTime(startTime);
      alert("End Time cannot be before Start Time.");
    }
  }, [startTime, endTime]);  // Re-run whenever startTime or endTime changes


  const handleCourseChange = (e) => {
    setCourseID(e.target.value)
  };

  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  const handleQuizDescriptionChange = (e) => {
    setQuizDescription(e.target.value);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].description = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[qIndex].options.length < 5) {
      updatedQuestions[qIndex].options.push("");
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[qIndex].options.length > 2) {
      updatedQuestions[qIndex].options.splice(optIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  const addQuestion = () => {
    const errors = validateQuestions();
    if (Object.keys(errors).length === 0) {
      setQuestions([
        ...questions,
        { description: "", options: ["", ""], answer: "" },
      ]);
    } else {
      setValidationErrors(errors);
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const validateQuestions = () => {
    const errors = {};
    questions.forEach((question, qIndex) => {
      if (!question.description.trim()) {
        errors[qIndex] = "Question description is required.";
      } else if (
        questions.filter(
          (q, idx) => idx !== qIndex && q.description.trim() === question.description.trim()
        ).length > 0
      ) {
        errors[qIndex] = "Duplicate questions are not allowed.";
      }

      const uniqueOptions = new Set(question.options.map((opt) => opt.trim()));
      if (uniqueOptions.size !== question.options.length) {
        errors[`${qIndex}_options`] = "Duplicate options are not allowed.";
      }

      if (question.options.some((opt) => !opt.trim())) {
        errors[`${qIndex}_options`] = "All options are required.";
      }

      if (!question.answer.trim()) {
        errors[`${qIndex}_answer`] = "Correct answer must be selected.";
      }
    });

    if (!quizTitle.trim()) {
      errors.quizTitle = "Quiz title is required.";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateQuestions();
    if (Object.keys(errors).length === 0) {
      setValidationErrors({});
      setIsPopupOpen(true);
    } else {
      setValidationErrors(errors);
    }
  };

  const calculateDurationInMinutes = (startTime, endTime) => {
    // Convert startTime and endTime to Date objects
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    // Check if endTime is before startTime
    if (end <= start) {
      console.error("End Time must be after Start Time.");
      return; // Return if the end time is invalid
    }
  
    // Calculate the difference in milliseconds
    const timeDifferenceInMilliseconds = end - start;
  
    // Convert milliseconds to minutes
    const durationInMinutes = Math.floor(timeDifferenceInMilliseconds / 1000 / 60); // 1000 ms in a second, 60 seconds in a minute
  
    return durationInMinutes;
  };


  const handleFinalSubmit = () => {


    // Calculate the time difference in millisecond

    const testDuration = calculateDurationInMinutes(startTime,endTime);

const newquestions = questions.map((question1)=>({question: question1.description, options:question1.options, correctAnswer:question1.answer}));

    const quizData = {
      title: quizTitle,
      description: quizDescription,
      course: courseId,
      questions: newquestions,
      duration: testDuration,
      startTime: startTime,
      endTime: endTime,
    };
    console.log(quizData);

  const accessToken = localStorage.getItem('accessToken');
    
    const data = async () => {
      try {
        const {data} = await axios.post(`http://localhost:3000/api/v1/quiz/create`, quizData, { headers:{ "Authorization": `Bearer ${accessToken}`}})
  
        console.log(data);

    setIsPopupOpen(false);
        alert('Test Submitted')

        navigate('/dashboard/previous-quizzes')

        
      } catch (error) {
        console.log(error);
        
      }
    }

    data();

  };

 

  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken');

    console.log(`Bearer ${accessToken}`);
    
    
    const data = async () => {
      try {
        if(localStorage.getItem('role') == 'teacher'){
        const {data} = await axios.get('http://localhost:3000/api/v1/course/teacher', { headers:{ "Authorization": `Bearer ${accessToken}`}
})
setCourses(data);

}

if(localStorage.getItem('role') == 'admin'){
  const {data} = await axios.get('http://localhost:3000/api/v1/course/all-courses', { headers:{ "Authorization": `Bearer ${accessToken}`}
})
setCourses(data);

}
    
      // setCourseID(data);

        console.log(data);
        
      } catch (error) {
        console.log(error);
        
      }
    }

    data();
  
  }, [])

  return (
    <div className="container mt-4">
      <h4>Create a Quiz</h4>
      <form onSubmit={handleSubmit}>
        {/* Course Selection */}
        <div className="mb-4">
          <label htmlFor="courseSelection" className="form-label">
            Select Course
          </label>
          <select
            className="form-select"
            id="courseSelection"
            onChange={handleCourseChange}
            required
          >
            <option value="">Select a course</option>
           {courses.map((course)=>( <option key={course._id} value={course._id}>{course.name}</option>))}
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
                  value={question.description}
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
                  value={question.answer}
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
          <button type="submit" className="btn btn-success">
            Save Quiz
          </button>
        </div>
      </form>

      {/* Popup Modal */}
      <Modal show={isPopupOpen} onHide={() => setIsPopupOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Test Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Start Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setIsPopupOpen(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleFinalSubmit}>
          Submit Test
        </Button>
      </Modal.Footer>
    </Modal>
      
    </div>
  );
}

export default QuizForm