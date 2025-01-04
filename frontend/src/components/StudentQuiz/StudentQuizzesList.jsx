import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentQuizzesList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [activeTab, setActiveTab] = useState("InProgress");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/v1/quiz/student-quizzes`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log(data);
        

        setQuizzes(data);

        const now = new Date();

        const inProgressQuizzes = data.filter((quiz) => {
          const startTime = new Date(quiz.startTime);
          const endTime = new Date(quiz.endTime);
          return startTime <= now && endTime >= now;
        });

        const completedQuizzes = data.filter((quiz) => {
          const endTime = new Date(quiz.endTime);
          return endTime < now;
        });

        const upcomingQuizzes = data.filter((quiz) => {
          const startTime = new Date(quiz.startTime);
          return startTime > now;
        });

        setInProgress(inProgressQuizzes);
        setCompleted(completedQuizzes);
        setUpcoming(upcomingQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
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

  const hasStudentAttemptedExam=(quiz)=>{
        // Function to check if a student attempted a particular quiz

        console.log('quizzwhjdbwvdww',quiz._id);
        
          const accessToken = localStorage.getItem('accessToken');
      
          console.log(`Bearer ${accessToken}`);
          
          
          const data = async () => {
            try {
              const {data: resultData} = await axios.get(`http://localhost:3000/api/v1/result/student`, { headers:{ "Authorization": `Bearer ${accessToken}`}})
      const attempt = resultData.find(result => result.quiz._id == quiz._id);

      console.log('attempt', attempt);
      

  if(attempt){
    alert("You have already given the quiz");
  }
  else{
    navigate(`/dashboard/student-quiz-attempt/${quiz._id}`);
  }              
            } catch (error) {
              console.log(error);
              
            }
          }
      
          data();
          
  // Find if there are any attempts for this student on the given quizId
  
  }

  const handleStartTest = (quiz) => {
    console.log(quiz);

    hasStudentAttemptedExam(quiz);
    
  };

  const currentQuizzes = tabs.find((tab) => tab.label === activeTab)?.data || [];

  return (
    <div className="previous-quizzes-container p-4">
      {console.log(currentQuizzes)}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Your Quizzes</h2>
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
              <th>Teacher Name</th>
              <th>Duration (mins)</th>
              {activeTab === "Upcoming" && <th>Start Date</th>}
              {activeTab === "Completed" && <th>Date</th>}
              {activeTab === "InProgress" && <th>Started on</th>}
              {activeTab === "InProgress" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentQuizzes.length > 0 ? (
              currentQuizzes.map((quiz, index) => (
                <tr key={index}>
                  <td>{quiz.title}</td>
                  <td>{quiz.course?.name}</td>
                  <td>{quiz.createdBy?.fullName}</td>
                  <td>{quiz.duration}</td>
                  <td>{new Date(quiz.startTime).toLocaleString()}</td>
                  {activeTab === "InProgress" && (
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStartTest(quiz)}
                      >
                        Start Test
                      </button>
                    </td>
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

export default StudentQuizzesList;

