// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const StudentEnrolledCourses = () => {

//   const accessToken = localStorage.getItem('accessToken');

//   const [courses,setCourses] = useState([]);

//   function formatDate(dateString) {
//     const date = new Date(dateString);
    
//     const day = String(date.getDate()).padStart(2, '0'); // Get day and pad if necessary
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad if necessary
//     const year = date.getFullYear(); // Get the full year
  
//     return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
//   }

//     // const courses = [
//     //     {
//     //       name: "Mathematics",
//     //       teacher: "Yaseen Ali",
//     //       quizzes: 12,
//     //       createdAt: Date(),
//     //     },
//     //     {
//     //         name: "Physics",
//     //         teacher: "Lokesh",
//     //         quizzes: 12,
//     //         createdAt: Date(),
//     //     },
//     //     {
//     //         name: "Drawing",
//     //         teacher: "Arun",
//     //         quizzes: 12,
//     //         createdAt: Date(),
//     //     },
//     //   ];

//     useEffect(()=>{

//       console.log(`Bearer ${accessToken}`);
      
      
//       const data = async () => {
//         try {
//           const {data} = await axios.get('http://localhost:3000/api/v1/course/student', { headers:{ "Authorization": `Bearer ${accessToken}`}
//   })
      
//   setCourses(data);
//           console.log(data);
          
//         } catch (error) {
//           console.log(error);
          
//         }
//       }
  
//       data();
    
//     }, [])


//   return (
//     <div className="container mt-4">
//       <h1>Your Enrolled Courses</h1>
//       {courses.length === 0 ? (
//         <p>No enrolled courses.</p>
//       ) : (
//         <table className="table table-bordered mt-3">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Course Name</th>
//               <th>Teacher</th>
//               <th>Number Of Quizzes</th>
//               <th>Started On</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map((course, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{course.name}</td>
//                 <td>{course.teacher.fullName}</td>
//                 <td>{course.quizzes.length}</td>
//                 <td>{formatDate(course.createdAt)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default StudentEnrolledCourses;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const StudentEnrolledCourses = () => {

  const accessToken = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  const [courses,setCourses] = useState([]);
  const [enrollPage, setEnrollPage] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad if necessary
    const year = date.getFullYear(); // Get the full year
  
    return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
  }

    // const courses = [
    //     {
    //       name: "Mathematics",
    //       teacher: "Yaseen Ali",
    //       quizzes: 12,
    //       createdAt: Date(),
    //     },
    //     {
    //         name: "Physics",
    //         teacher: "Lokesh",
    //         quizzes: 12,
    //         createdAt: Date(),
    //     },
    //     {
    //         name: "Drawing",
    //         teacher: "Arun",
    //         quizzes: 12,
    //         createdAt: Date(),
    //     },
    //   ];

    const handleEnrollSection=()=>{

      navigate("/dashboard/enrollment-page");
    }

    useEffect(()=>{

      console.log(`Bearer ${accessToken}`);
      
      
      const data = async () => {
        try {
          const {data} = await axios.get('http://localhost:3000/api/v1/course/student', { headers:{ "Authorization": `Bearer ${accessToken}`}
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
      <div className="d-flex justify-content-between">
          <h4>Your Enrolled Courses</h4>
          <button
            className="btn btn-primary"
            onClick={()=>handleEnrollSection()}
          >
            Enroll in a course
          </button>
      </div>
      
      {courses.length === 0 ? (
        <p>No enrolled courses.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Number Of Quizzes</th>
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

export default StudentEnrolledCourses;

