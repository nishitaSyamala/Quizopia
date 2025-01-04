import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Accordion, Card, Button } from "react-bootstrap";

const AdminViewQuiz = () => {
  const { quizId } = useParams();
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function stripHtmlTags(htmlString) {
    return htmlString.replace(/<[^>]*>/g, '');
  }

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const { data } = await axios.get(`http://localhost:3000/api/v1/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuizDetails(data);
        console.log(data);
        
      } catch (err) {
        setError("Failed to fetch quiz details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-3">
      <h3 className="text-center mb-4">{quizDetails.title}</h3>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Quiz Details</h5>
          <p className="card-text">{quizDetails.description}</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Course:</strong> {quizDetails.course?.name}
            </li>
            <li className="list-group-item">
              <strong>Duration:</strong> {quizDetails.duration} minutes
            </li>
            <li className="list-group-item">
              <strong>Start Time:</strong>{" "}
              {new Date(quizDetails.startTime).toLocaleString()}
            </li>
            <li className="list-group-item">
              <strong>End Time:</strong>{" "}
              {new Date(quizDetails.endTime).toLocaleString()}
            </li>
            <li className="list-group-item">
              <strong>Total Questions:</strong> {quizDetails.questions.length}
            </li>
          </ul>
        </div>
      </div>

      {/* React-Bootstrap Accordion for Questions */}
      <h2 className="mt-5">Questions</h2>
      <Accordion className="mt-3 mb-5">
        {quizDetails.questions.map((question, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header className="d-flex align-items-center">
              Question {index + 1}: {stripHtmlTags(question.question)}
            </Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>Options</Card.Title>
                  <ul>
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                  <Card.Text>
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default AdminViewQuiz;
