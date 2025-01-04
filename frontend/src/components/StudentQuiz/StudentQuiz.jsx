import axios from "axios";
import React, { useEffect, useState } from "react";

const StudentQuiz = ({ quiz = {
  "title": "Sample Quiz",
  "questions": [
    {
      "_id": "5f8d0d55b54764421b7156a3",  // Unique ID for the question
      "question": "What is the capital of France?",  // Updated field "question"
      "options": ["Paris", "London", "Berlin", "Madrid"]
    },
    {
      "_id": "5f8d0d55b54764421b7156a4",  // Unique ID for the question
      "question": "What is 2 + 2?",  // Updated field "question"
      "options": ["3", "4", "5", "6"]
    },
    {
      "_id": "5f8d0d55b54764421b7156a5",  // Unique ID for the question
      "question": "What is 2 + 3?",  // Updated field "question"
      "options": ["3", "4", "5", "6"]
    }
  ]
} }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(
    quiz.questions.map(() => ({ selected: "", status: "unattempted" }))
  );

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const [submitMsg, setSubmitMsg] = useState(false);

  const handleOptionSelect = (index, option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { selected: option, status: "answered" };
    setAnswers(updatedAnswers);
  };

  const skipQuestion = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { selected: "", status: "skipped" };
    setAnswers(updatedAnswers);
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quiz.questions.length - 1));
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quiz.questions.length - 1));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  const handleSubmit = () => {
    // Construct the final submission data
    const submissionData = quiz.questions.map((question, index) => ({
      questionId: question._id,  // Assuming each question has a unique "id"
      studentAnswer: answers[index].selected || "",
    }));

    console.log(submissionData);
    

    const data = async () => {
const accessToken = localStorage.getItem('accessToken')

      try {
        const {data} = await axios.post(`http://localhost:3000/api/v1/quiz/${quiz._id}/submit`, {answers:submissionData}, { headers:{ "Authorization": `Bearer ${accessToken}`}
  
  })
        console.log(data);
        
      } catch (error) {
        console.log(error);
        
      }
    }
  
    data();
    
    setSubmitMsg(true);
  };

  useEffect(() => {
    // Convert endTime to a Date object
    const endDate = new Date(quiz.endTime);

    // Function to calculate the remaining time
    const calculateTimeRemaining = () => {
      const currentTime = new Date();
      const timeDifference = endDate - currentTime;
      if (timeDifference <= 0) {
        clearInterval(timerInterval);
        setTimeRemaining(0); // Timer has finished
        handleSubmit()
      } else {
        setTimeRemaining(timeDifference);
      }
    };

    // Set an interval to update the remaining time every second
    const timerInterval = setInterval(calculateTimeRemaining, 1000);

    // Cleanup the interval when the component unmounts or `endTime` changes
    return () => {
      clearInterval(timerInterval);
    };
  }, [quiz]); // Re-run effect if endTime changes

  // Convert the remaining time in milliseconds to minutes and seconds
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);


  return (
    <div>

     
    {!submitMsg? <div className="container mt-4">
     <div className="d-flex justify-content-between align-items-center">
      <h1>{quiz.title}</h1><div className="fs-3 fw-bold">
       <span className="fs-5">Time Ends In:</span> {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      </div>
      {!showSummary ? (
        <div className="card p-4">
          <h4>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </h4>
          <div className="mt-3" dangerouslySetInnerHTML={{ __html: quiz.questions[currentQuestionIndex].question }}></div>
          <div className="mt-3">
            {quiz.questions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${currentQuestionIndex}`}
                  id={`option-${index}`}
                  checked={answers[currentQuestionIndex].selected === option}
                  onChange={() => handleOptionSelect(currentQuestionIndex, option)}
                />
                <label className="form-check-label" htmlFor={`option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => skipQuestion(currentQuestionIndex)}
            >
              Skip Question
            </button>
            <button
              className="btn btn-primary me-2"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next
            </button>
          </div>
          <div className="mt-3">
            <button
              className="btn btn-success"
              onClick={handleViewSummary}
              disabled={!answers.some((ans) => ans.status !== "unattempted")}
            >
              View Summary
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h4>Summary</h4>
          <ul className="list-group">
            {quiz.questions.map((question, index) => (
              <li
                key={index}
                className={`list-group-item ${
                  answers[index].status === "answered"
                    ? "list-group-item-success"
                    : answers[index].status === "skipped"
                    ? "list-group-item-warning"
                    : "list-group-item-secondary"
                }`}
              >
                <strong>Question {index + 1}:</strong>{" "}
                {answers[index].status === "answered"
                  ? `Answered (${answers[index].selected})`
                  : answers[index].status === "skipped"
                  ? "Skipped"
                  : "Unattempted"}
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button className="btn btn-danger me-2" onClick={() => setShowSummary(false)}>
              Back to Questions
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Test
            </button>
          </div>
        </div>
      )}
    </div>:<div className="text-center mt-5">
    <h1>Test Submitted</h1>
    <button
      className="btn btn-primary mt-3"
      onClick={() => (window.location.href = "/dashboard/student-quiz")}
    >
      Back to All Quizzes
    </button>
  </div>}

  </div>

   
  );
};

export default StudentQuiz;