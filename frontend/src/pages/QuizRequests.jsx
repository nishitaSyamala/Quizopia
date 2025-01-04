import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const QuizRequests = () => {
  const accessToken = localStorage.getItem('accessToken');   
  const [publishQuizzes, setPublishQuizzes] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const fetchUnpublishedQuizzes = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/v1/quiz/unpublished`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPublishQuizzes(data);
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching unpublished quizzes:", error);
      setErrors(error.response?.data?.msg || "An error occurred.");
    }
  };

  useEffect(() => {
    fetchUnpublishedQuizzes();
  }, []);

  const publishQuiz = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/quiz/${id}/publish`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Update the state to remove the published quiz
      setPublishQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== id));

      alert('Quiz Published');
    } catch (error) {
      console.error("Error publishing quiz:", error);
      alert(error.response?.data?.msg || "Failed to publish the quiz.");
    }
  };

  const handleView = (quizId) => {
    navigate(`/dashboard/quiz-details/${quizId}`);
  };

  const handleAccept = (id) => {
    publishQuiz(id);
  };

  return (
    <div className="quiz-requests"  style={{height:'90vh'}}>
      <h4 className="text-center mb-4 fs-1">Quiz Requests</h4>
      <Row xs={1} md={2} lg={3} className="g-4" >
        {publishQuizzes.length===0?<h3 style={{textAlign:'center', width:"100%", marginTop:"250px"}}>There are no active requests</h3>:<div>{publishQuizzes.map((quiz, index) => (
          <Col key={index}>
            <Card className="quiz-request-card">
              <Card.Body>
                <Card.Title>{quiz.title}</Card.Title>
                <Card.Text>
                  <strong>Course:</strong> {quiz.course?.name}
                  <br />
                  <strong>Teacher:</strong> {quiz.createdBy?.fullName}
                  <br />
                  <strong>Duration:</strong> {quiz.duration} mins
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    className="flex-grow-1 mx-1 text-black"
                    onClick={() => handleView(quiz._id)}
                    style={{ backgroundColor: '#d2d2d2', borderColor: '#d2d2d2' }}
                  >
                    View
                  </Button>
                  <Button
                    variant="success"
                    className="flex-grow-1 mx-1 text-black"
                    onClick={() => handleAccept(quiz._id)}
                    style={{ backgroundColor: '#89f5b6', borderColor: '#89f5b6' }}
                  >
                    Accept
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}</div>}
        
      </Row>

      
    </div>
  );
};

export default QuizRequests;

