// import React from 'react';
// import axios from 'axios';

// const StudentsList = ({ students }) => {

//     const accessToken = localStorage.getItem('accessToken');
    
//     const data = async (userId, isActive) => {
//       try {
//         const {data} = await axios.patch(`http://localhost:3000/api/v1/user/users/${userId}/status`, {isActive: !isActive}, { headers:{ "Authorization": `Bearer ${accessToken}`}})
  
//         console.log(data);
        
//       } catch (error) {
//         console.log(error);
        
//       }
//     }

//   return (
//     <div className="students-list-container p-4">
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2 className="m-0">Students List</h2>
//       </div>

//       {/* Table Section */}
//       <div className="table-responsive">
//         <table className="table table-bordered table-hover">
//           <thead className="table-light">
//             <tr>
//               <th>Full Name</th>
//               <th>Email</th>
//               <th>Courses</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length > 0 ? (
//               students.map((student, index) => (
//                 <tr key={index}>
//                   <td>{student.fullName}</td>
//                   <td>{student.email}</td>
//                   <td>{student.courses.join(', ')}</td>
//                   <td>
                  
//                       <button
//                         className="btn btn-light border"
//                         onClick={() => data(student._id, student.isActive)

//                         }
//                       >
//                        {!student.isActive ? 'Activate' : ` Remove Access`}
//                       </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center">
//                   No students available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StudentsList;

import React, { useState } from "react";
import axios from "axios";

const StudentsList = ({ students, studentStatusHandler }) => {
  const accessToken = localStorage.getItem("accessToken");

  const data = async (userId, isActive) => {
          try {
            const {data} = await axios.patch(`http://localhost:3000/api/v1/user/users/${userId}/status`, {isActive: !isActive}, { headers:{ "Authorization": `Bearer ${accessToken}`}})
      
            console.log(data);
            
          } catch (error) {
            console.log(error);
            
          }
        }

  // State for Add Student Modal
  const [showModal, setShowModal] = useState(false);
 const [newPassword, setNewPassword] = useState('');

  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    enrolledCourses: [],
  });
  const [addError, setAddError] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);

  const toggleModal = () => setShowModal(!showModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelection = (course) => {
    setNewStudent((prev) => {
      const updatedCourses = prev.enrolledCourses.includes(course)
        ? prev.enrolledCourses.filter((c) => c !== course)
        : [...prev.enrolledCourses, course];
      return { ...prev, enrolledCourses: updatedCourses };
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const { fullName, email, enrolledCourses } = newStudent;

    if (!fullName || !email || enrolledCourses.length === 0) {
      setAddError("All fields are required.");
      return;
    }

    try {
      // API call to register a new student
      console.log("New Student Registered:", { fullName, email, enrolledCourses });
      alert("Student registered successfully!");
      setShowModal(false);
      setNewStudent({ fullName: "", email: "", enrolledCourses: [] });
      setAddError("");
    } catch (error) {
      console.error(error);
      setAddError("Failed to register student. Please try again.");
    }
  };

  const updateStudentStatus = async (userId, isActive) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/v1/user/users/${userId}/status`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Updated Student Status:", data);

      if(data){
        studentStatusHandler(true)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePassword = async (userId, updatedPassword, e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/user/admin/change-password`,
        { userId: userId, newPassword: updatedPassword  },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Updated Password:", data);
      alert("Password updated for the user");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="students-list-container p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Students List</h2>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Full Name</th>
              <th>Enrolled Courses</th>
              <th>Email</th>
              {localStorage.getItem('role') == 'admin' && <th>Status</th>}
              {localStorage.getItem('role') == 'admin' && <th>Change Password</th>}

            </tr>
          </thead>
<tbody>
  {students?.length > 0 ? (
    <>
      {/* Admin Role */}
      {localStorage.getItem('role') === 'admin' &&
        students?.map((student, index) => (
          <tr key={index}>
            <td>{student.fullName}</td>
            <td>{student.courses?.map((course) => course.name).join(', ')}</td>
            <td>{student.email}</td>
            <td>
              <button
                className="btn btn-light border"
                onClick={() => updateStudentStatus(student._id, student.isActive)}
              >
                {!student.isActive ? "Activate" : "Remove Access"}
              </button>
            </td>
            <td className="d-flex items align-items-center gap-1">
                    {/* <input type="password" onChange={(e)=>setNewPassword(e.target.value)} placeholder="New Password"/>
                    <button className="btn btn-success btn-sm" onClick={()=>handleUpdatePassword(teacher._id,newPassword)}>Update</button> */}
                    <form className="d-flex items align-items-center gap-1" onSubmit={(e) => handleUpdatePassword(student._id, newPassword, e)}>
    <input
      type="password"
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="New Password"
      required
      autoComplete="new-password"
    />
    <button
      className="btn btn-success btn-sm"
      type="submit" // Change to submit to use form behavior
    >
      Update
    </button>
  </form>
                  </td>
          </tr>
        ))
      }

      {/* Teacher Role */}
      {localStorage.getItem('role') === 'teacher' &&
        students?.map((student, index) => (
          student.students?.map((student1, student1Index) => (
            <tr key={`${index}-${student1Index}`}>
              <td>{student1.fullName}</td>
              <td>{student.name}</td>
              <td>{student1.email}</td>
            </tr>
          ))
        ))
      }
    </>
  ) : (
    <tr>
      <td colSpan="4" className="text-center">
        No students available.
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsList;

