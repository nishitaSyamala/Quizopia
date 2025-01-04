import React from "react";

const StudentQuizReport = ({ report }) => {
  const { title, totalMarks, marksScored, questions } = report;

  return (
    <div className="container mt-4">
      <h1 className="text-center">{title}</h1>
      <div className="card p-4 mt-3">
        <h4>Total Marks: {totalMarks}</h4>
        <h4>Marks Scored: {marksScored}</h4>
      </div>
      <div className="mt-4">
        <h3>Quiz Details</h3>
        <ul className="list-group">
          {questions.map((question, index) => (
            <li key={index} className="list-group-item">
              <h5>
                Question {index + 1}:{" "}
                <span dangerouslySetInnerHTML={{ __html: question.text }}></span>
              </h5>
              <ul>
                {question.options.map((option, i) => (
                  <li
                    key={i}
                    className={`${
                      option === question.correctAnswer
                        ? "text-success fw-bold"
                        : option === question.selectedAnswer
                        ? "text-danger"
                        : ""
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Your Answer:</strong>{" "}
                {question.selectedAnswer || "Not Attempted"}
              </p>
              <p>
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              {question.isCorrect === false && question.selectedAnswer !== "Not Attempted" && (
                <p className="text-danger">Your answer is incorrect!</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentQuizReport;
