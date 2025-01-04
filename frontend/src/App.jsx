import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import Dashboard from './pages/Dashboard';
import QuizRequests from './pages/QuizRequests';
import PreviousQuizzes from './pages/PreviousQuizzes';
import TeachersData from './pages/TeachersData/TeachersData';
import StudentsData from './pages/StudentsData/StudentsData';
import Notifications from './pages/Notifications/Notifications';
import QuizCreation from './pages/QuizCreation/QuizCreation';
import QuizAttempt from './pages/QuizAttempt/QuizAttempt';
import ResultsDashboard from './pages/StudentResult/StudentResult';
import AllCourses from './pages/AllCourses/AllCourses';
import QuizSummary from './pages/QuizSummary/QuizSummary';
import StudentEnrolledCourses from './pages/EnrolledCourses/EnrolledCourses';
import TeacherCourses from './pages/TeachersData/TeacherCourses';
import FreshStudentsPage from './pages/EnrollmentPage/EnrollmentPage';
import StudentQuizzesList from './components/StudentQuiz/StudentQuizzesList';
import EditQuiz from './pages/QuizEdit/quizEdit';
import AdminViewQuiz from './pages/AdminViewQuiz/AdminViewQuiz';


function App() {
  const [role,setRole] = useState(localStorage.getItem('role') || '');

  const roleHandler = (value)=>{
    setRole(value)
  }
  

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage roleHandler={roleHandler}/>} />

        {/* Dashboard Route with Nested Routes */}
        <Route
          path="dashboard"
          element={
              <Dashboard role={role}/>
          }
        >
          {/* Nested Routes for admin dashboard*/}
          <Route path="quiz-requests" element={<QuizRequests />} />
          <Route path="previous-quizzes" element={<PreviousQuizzes  
      />} />

      {/* all courses route for admin */}
      <Route path="all-courses" element={<AllCourses/>} />

          {/* All teachers list for admin */}
          <Route path="teachers-list" element={<TeachersData/>} />

          {/* All students list for admin and teacher */}
          <Route path="students-list" element={<StudentsData/>} />

           {/* Notifications (common component for all the users*/}
           <Route path="notifications" element={<Notifications/>} />
           <Route path="quiz-creation" element={<QuizCreation/>} />
           <Route path='quiz-edit/:quizId' element={<EditQuiz/>} /> 
           <Route path="all-courses" element={<QuizCreation/>} />
           
           <Route path="quiz-details/:quizId" element={<AdminViewQuiz />} />

            {/* Nested Routes for Teacher dashboard*/}
            {/* Teacher teaching courses */}
            <Route path="teacher-courses" element={<TeacherCourses/>} />
          
           {/* Nested Routes for student dashboard*/}
           <Route path="student-quiz" element={<StudentQuizzesList/>} /> 
           <Route path="student-quiz-attempt/:quizId" element={<QuizAttempt/>} /> 
           <Route path="student-results" element={<ResultsDashboard/>} />
           <Route path="quiz-summary" element={<QuizSummary/>} />
           <Route path="student-enrolled-courses" element={<StudentEnrolledCourses/>} />
           <Route path='enrollment-page' element={<FreshStudentsPage />} />

        </Route>

        <Route path='/enrollment-page' element={<FreshStudentsPage />} />

        {/* Redirect Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

