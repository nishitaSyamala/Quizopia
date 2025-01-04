import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const TeacherCourses = () => {

  const accessToken = localStorage.getItem('accessToken');

  const [courses,setCourses] = useState([]);
  
    function formatDate(dateString) {
      const date = new Date(dateString);
      
      // Get day, month, and year
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      
      // Return formatted date as DD-MM-YYYY
      return `${day}-${month}-${year}`;
  }

    useEffect(()=>{

      console.log(`Bearer ${accessToken}`);
      
      
      const data = async () => {
        try {
          const {data} = await axios.get('http://localhost:3000/api/v1/course/teacher', { headers:{ "Authorization": `Bearer ${accessToken}`}
  })
      
  setCourses(data);
          console.log(data);
          
        } catch (error) {
          console.log(error);
          
        }
      }
  
      data();
    
    }, [])


  return (
    <div className="container mt-4">
      <h4>Your Courses</h4>
      {courses.length === 0 ? (
        <p>No courses.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Number quizzes</th>
              <th>Started On</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{course.name}</td>
                <td>{course.teacher.fullName}</td>
                <td>{course.quizzes.length}</td>
                <td>{formatDate(course.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherCourses;
