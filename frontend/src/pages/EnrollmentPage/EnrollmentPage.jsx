import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FreshStudentsPage = () => {
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleCourseIdChange = (e) => {
    setCourseId(e.target.value);
  };

  const handleEnrollCourse = async (e) => {
    e.preventDefault();

    if (!courseId) {
      setMessage("Please enter a valid course ID.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/course/add-student",
        { courseId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if(data.course.name){
        navigate('/dashboard/student-enrolled-courses')
      }
      setCourseId("");

      console.log(data);
      
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.msg || "Failed to enroll in the course. Please try again."
      );
    }
  };

  return (
    <div className="fresh-students-container text-center mt-5">
      <h2>Welcome!</h2>
      <p>
        You have not enrolled in any course yet. Please enter the course ID in the field
        below OR contact the admin for assistance.
      </p>
      <form onSubmit={handleEnrollCourse} className="mt-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-50 mx-auto"
            placeholder="Enter Course ID"
            value={courseId}
            onChange={handleCourseIdChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enroll in Course
        </button>
      </form>
      {message && <div className="mt-3 text-danger">{message}</div>}
    </div>
  );
};

export default FreshStudentsPage;
