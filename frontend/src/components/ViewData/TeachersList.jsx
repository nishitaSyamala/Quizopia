import React, { useState, useEffect } from "react";
import axios from "axios";

const TeachersList = ({ teachers, teacherStatusHandler }) => {
  const accessToken = localStorage.getItem("accessToken");

  const [newPassword, setNewPassword] = useState('');

  const updateTeacherStatus = async (userId, isActive) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/v1/user/users/${userId}/status`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Updated Teacher Status:", data);

      if(data){
        teacherStatusHandler(true)
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

  // const handleUpdatePassword=(id)=>{
  //   //API handling for updating the user password
  //   console.log("updated password", newPassword);
  //   console.log("teacher id for now", id);
  // }
  return (
    <div className="teachers-list-container p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Teachers List</h2>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Full Name</th>
              <th>Courses</th>
              <th>Email</th>
              {/* <th>Quiz Permission</th> */}
              <th>Status</th>
              <th>Change Password</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher, index) => (
                <tr key={index}>
                  <td>{teacher.fullName}</td>
                  <td>{teacher.courses.map((course)=>(course.name)).join(', ')}</td>
                  <td>{teacher.email}</td>
                  {/* <td>{teacher.permissions[0]?.canCreateQuiz ? "Yes" : "No"}</td> */}
                  <td>
                    <button
                      className="btn btn-light border"
                      onClick={() => updateTeacherStatus(teacher._id, teacher.isActive)}
                    >
                      {!teacher.isActive ? "Activate" : "Remove Access"}
                    </button>
                  </td>
                  <td className="d-flex items align-items-center gap-1">
                    {/* <input type="password" onChange={(e)=>setNewPassword(e.target.value)} placeholder="New Password"/>
                    <button className="btn btn-success btn-sm" onClick={()=>handleUpdatePassword(teacher._id,newPassword)}>Update</button> */}
                    <form className="d-flex items align-items-center gap-1" onSubmit={(e) => handleUpdatePassword(teacher._id, newPassword, e)}>
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
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No teachers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachersList;


