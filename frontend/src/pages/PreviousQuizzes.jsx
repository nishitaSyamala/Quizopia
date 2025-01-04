import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PreviousQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [activeTab, setActiveTab] = useState("InProgress");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    const fetchData = async () => {
      try {
        let quizData = [];

        if (role === "admin") {
          const { data } = await axios.get(
            `http://localhost:3000/api/v1/quiz/all`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          quizData = data;
        } else if (role === "teacher") {
          const { data: teacherCourses } = await axios.get(
            `http://localhost:3000/api/v1/course/teacher`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setCourses(teacherCourses);

          const { data: teacherQuizzes } = await axios.get(
            `http://localhost:3000/api/v1/quiz/teacher-quizzes`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          quizData = teacherQuizzes;
        }

        if (quizData.length > 0) {
          setQuizzes(quizData);

          const now = new Date();

          setInProgress(
            quizData.filter((quiz) => {
              const startTime = new Date(quiz.startTime);
              const endTime = new Date(quiz.endTime);
              return startTime <= now && endTime >= now;
            })
          );

          setCompleted(
            quizData.filter((quiz) => {
              const endTime = new Date(quiz.endTime);
              return endTime < now;
            })
          );

          setUpcoming(
            quizData.filter((quiz) => {
              const startTime = new Date(quiz.startTime);
              return startTime > now;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error.response?.data || error);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { label: "InProgress", data: inProgress },
    { label: "Completed", data: completed },
    { label: "Upcoming", data: upcoming },
  ];

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleCreateQuiz = () => {
    const role = localStorage.getItem("role");
    if (courses.length === 0 && role !== "admin") {
      MySwal.fire({
        title: "No Courses Enrolled",
        text: "Please enroll in a course and contact the admin to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      navigate("/dashboard/quiz-creation");
    }
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/dashboard/quiz-edit/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const confirmDelete = await MySwal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this quiz?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmDelete.isConfirmed) {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`http://localhost:3000/api/v1/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUpcoming((prev) => prev.filter((quiz) => quiz._id !== quizId));
        MySwal.fire("Deleted!", "Quiz has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error.response?.data || error);
      MySwal.fire("Error", "Failed to delete the quiz. Please try again.", "error");
    }
  };

  const currentQuizzes =
    tabs.find((tab) => tab.label === activeTab)?.data || [];

  return (
    <div className="previous-quizzes-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">All Quizzes</h2>
        <button className="btn btn-light border" onClick={handleCreateQuiz}>
          Create Quiz
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        {tabs.map((tab) => (
          <li key={tab.label} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.label ? "active" : ""}`}
              onClick={() => handleTabClick(tab.label)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Quiz Title</th>
              <th>Course Name</th>
              <th>Created By</th>
              <th>Duration (mins)</th>
              {activeTab === "InProgress" && <th>Start Date</th>}
              {activeTab === "Upcoming" && <th>Start Date</th>}
              {activeTab === "Completed" && <th>Date</th>}
              {activeTab === "Upcoming" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentQuizzes.length > 0 ? (
              currentQuizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.course?.name || "N/A"}</td>
                  <td>{quiz.createdBy?.fullName || "N/A"}</td>
                  <td>{quiz.duration}</td>
                  <td>{new Date(quiz.startTime).toLocaleString()}</td>
                  {activeTab === "Upcoming" && (
                    <>
                      
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditQuiz(quiz._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No quizzes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviousQuizzes;
