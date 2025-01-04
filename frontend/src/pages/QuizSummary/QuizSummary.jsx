import React from "react";
import StudentQuizReport from "../../components/StudentQuiz/StudentQuizReport";

const QuizSummary = ({reportData}) => {
  // Extract relevant details from reportData for easier access in the StudentQuizReport component
  const report = {
    title: reportData.quiz.title,
    totalMarks: reportData.quiz.questions.length,
    marksScored: reportData.score,
    questions: reportData.quiz.questions.map((question, index) => {
      // Find the student's answer and correctness for each question
      const answer = reportData.answers.find(ans => ans.questionId === question._id);
      return {
        text: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer ? answer.studentAnswer : "Not Attempted", // Use studentAnswer if exists
        isCorrect: answer ? answer.isCorrect : null
      };
    })
  };

  return <StudentQuizReport report={report} />;
};

export default QuizSummary;