import React, { useState } from 'react'
import StudentsList from '../../components/ViewData/StudentsList'
import { useEffect } from 'react';
import axios from 'axios';

function StudentsData() {
    const [studentData, setStudentData] = useState([]);

      const [updateStatus,setUpdateStatus] = useState(false);
    
      const studentStatusHandler = (value)=>{
        setUpdateStatus(value)
      }

      useEffect(()=>{
        const accessToken = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');


        console.log(`Bearer ${accessToken}`);
        
        
        const data = async () => {
          try {

            if(role === 'admin'){
            
  const {data} = await axios.post('http://localhost:3000/api/v1/user/users-role', {role: 'student'}, { headers:{ "Authorization": `Bearer ${accessToken}`}
  })
  setStudentData(data);
studentStatusHandler(false)

console.log(data);

}

if(role === 'teacher'){
            
  const {data} = await axios.get('http://localhost:3000/api/v1/course/teacher', { headers:{ "Authorization": `Bearer ${accessToken}`}
  })

  console.log('name');
  

  console.log(data);
  
  setStudentData(data);

}
            
          } catch (error) {
            console.log(error);
            
          }
        }

        data();
      
      }, [updateStatus])
      
      
  return (
    <div>
        <StudentsList students={studentData} studentStatusHandler={studentStatusHandler}/>
    </div>
  )
}

export default StudentsData