import React, { useEffect, useState } from 'react'
import StudentQuiz from '../../components/StudentQuiz/StudentQuiz'
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizAttempt() {
  
const [quiz,setQuiz] = useState();
const {quizId} = useParams();

useEffect(()=>{

  const accessToken = localStorage.getItem('accessToken');
  
  
  const data = async () => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/quiz/${quizId}`, { headers:{ "Authorization": `Bearer ${accessToken}`}

})
  
      setQuiz(data);
      console.log(data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  data();

}, [quizId])


  return (
    <div>
        <StudentQuiz quiz={quiz}/>
    </div>
  )
}

export default QuizAttempt