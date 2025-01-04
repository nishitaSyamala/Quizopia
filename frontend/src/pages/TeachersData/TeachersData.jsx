import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeachersList from '../../components/ViewData/TeachersList';
import axios from 'axios';

function TeachersData() {
  const [teacherData, setTeacherData] = useState([]);
  const [updateStatus,setUpdateTeacherStatus] = useState(false);

  const teacherStatusHandler = (value)=>{
    setUpdateTeacherStatus(value)
  }

  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken');

    console.log(`Bearer ${accessToken}`);
    
    
    const data = async () => {
      try {
        const {data} = await axios.post('http://localhost:3000/api/v1/user/users-role', {role: 'teacher'}, { headers:{ "Authorization": `Bearer ${accessToken}`}})

        setTeacherData(data)
        console.log(data);

        teacherStatusHandler(false)
        
      } catch (error) {
        console.log(error);
        
      }
    }

    data();
  
  }, [updateStatus])


  return (
    <div>
        
<TeachersList teachers={teacherData} teacherStatusHandler={teacherStatusHandler}/>
    </div>
  )
}

export default TeachersData