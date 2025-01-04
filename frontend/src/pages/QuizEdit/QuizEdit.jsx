import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizEditForm from "./quizEditForm";
import { useParams } from "react-router-dom";

const EditQuiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {quizId} = useParams();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/quiz/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setQuizData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch quiz details.");
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  const handleSaveQuiz = async (updatedQuizData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:3000/api/v1/quiz/${quizId}`,
        updatedQuizData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Quiz updated successfully!");
    } catch (err) {
      alert("Failed to update the quiz.");
    }
  };

  if (loading) return <p>Loading quiz details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center">
    <h4>Edit Quiz</h4>
    <button 
      className="btn btn-link" 
      onClick={() => window.history.back()} // This will take the user back to the previous page
    >
      Go Back
    </button>
  </div>
  <QuizEditForm
    initialData={quizData}
    onSubmit={handleSaveQuiz} // Pass a function to handle the updated data
  />
</div>

  );
};

export default EditQuiz;
