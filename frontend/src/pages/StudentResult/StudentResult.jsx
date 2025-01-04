import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import QuizSummary from "../QuizSummary/QuizSummary";

const ResultsDashboard = () => {
    const [results, setResults] = useState([]);

    const [quizData,setQuizData] = useState({});

    const [summary,setSummary] = useState(false);

    function formatDate(dateString) {
      const date = new Date(dateString);
  
      // Get day, month, year, hours, and minutes
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      // Determine AM/PM
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12; // Convert to 12-hour format
      hours = hours ? String(hours).padStart(2, '0') : '12'; // 0 hour is 12 in 12-hour format
  
      // Format the date
      return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

      useEffect(()=>{
        const accessToken = localStorage.getItem('accessToken');

        console.log(`Bearer ${accessToken}`);
        
        
        const data = async () => {
          try {
            const {data} = await axios.get(`http://localhost:3000/api/v1/result/student`, { headers:{ "Authorization": `Bearer ${accessToken}`}})
        
  setResults(data);
            console.log(data);
            
          } catch (error) {
            console.log(error);
            
          }
        }

        data();
      
      }, [])
      
    const showSummary=(quiz)=>{
      setSummary(true)
        setQuizData(quiz)
      };
  return (
    <>
  {!summary && (  <div className="container mt-4">
      <h1>Test Results</h1>
      {results.length === 0 ? (
        <p>No test results available yet.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Test Title</th>
              <th>Course</th>
              <th>Date of Submission</th>
              <th>Marks</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{result.quiz?.title}</td>
                <td>{result.quiz?.course?.name}</td>
                <td>{formatDate(result.createdAt)}</td>
                <td>{result.score}</td>
                <td><button onClick={()=>showSummary(result)} className="border rounded">Summary</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>)}

    {summary ? (<QuizSummary reportData={quizData}/>) : ''}
    </>
  );
};

export default ResultsDashboard;
