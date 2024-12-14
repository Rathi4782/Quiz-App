import React, { useEffect, useState } from 'react';
import './App.css';
import image from '../assets/image.png';
import { RefreshCw } from 'lucide-react';

const quizData = [
  {
    question: 'What is the 6th planet in the solar system?',
    options: ['Jupiter', 'Saturn', 'Earth', 'Neptune'],
    correctAnswer: 1,
    image: 'https://i.natgeofe.com/n/7e5a17ad-4e70-4bf5-a7b7-fdf2f625d5b8/01-solar-system-pia12114_orig_16x9.jpg'
  },
  {
    question: 'What is the capital of India?',
    options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
    correctAnswer: 0,
    image: 'https://i.pinimg.com/736x/7c/99/f1/7c99f1dcda9b6cbca0f6e6f8cc8ad54b.jpg'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctAnswer: 1,
    image: 'https://i.natgeofe.com/n/7e5a17ad-4e70-4bf5-a7b7-fdf2f625d5b8/01-solar-system-pia12114_orig_16x9.jpg'
  },
  {
    question: "Which programming language is used in React?",
    options: ["Python", "JavaScript", "C++", "Ruby"],
    correctAnswer: 1,
     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS4D0JCyqWG4QIPifIzGIWvgKXQG9senferA&s'
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoYVKtQozRh6dJsVu0CBSbo63qN4jsYoAIyA&s'
  },
  {
    question: 'What is the largest planet in the solar system?',
    options: ['Earth', 'Mars', 'Jupiter', 'Neptune'],
    correctAnswer: 2,
    image: 'https://i.natgeofe.com/n/7e5a17ad-4e70-4bf5-a7b7-fdf2f625d5b8/01-solar-system-pia12114_orig_16x9.jpg'
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correctAnswer: 1,
     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5yt9NJ6KPrucMGbXYup9fLlYrketkpuAp9Q&s'
  },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);

  //  Moved state and timer logic to top level
  const [timeRemaining, setTimeRemaining] = useState(10);

  useEffect(() => {
    if (currentScreen === 'quiz') {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (timeRemaining === 0) {
      // Check if it's the last question
      if (currentQuestion === quizData.length - 1) {
        handleSubmit(); // Auto-submit if it's the last question
      } else {
        handleNext(); // Move to next question otherwise
      }
    }
  }, [timeRemaining, currentQuestion])

  const handleAnswerChange = (optionIndex) => {
    if (selectedAnswers[currentQuestion] === undefined) {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(10); // Reset timer when moving to the next question
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeRemaining(10); // Reset timer when moving to the previous question
    }
  };

  const handleSubmit = () => {
    const calculatedScore = quizData.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    setScore(calculatedScore);
    setCurrentScreen('result');
  };

  const renderHome = () => (
    <div className="home">
      <img src={image} className="logo" alt="Logo" />
      <h1 className="title">Quizzles</h1>
      <p className="subtitle-heading">Let's Play!</p>
      <p className="subtitle">Play now and Level up Knowledge</p>
      <button className="play-button" onClick={() => setCurrentScreen('quiz')}>
        Play Now
      </button>
    </div>
  );

  const renderQuiz = () => {
    const question = quizData[currentQuestion];
    return (
      <div className="quiz">
        <div className="question-tracker">{`${currentQuestion + 1} / ${quizData.length}`}
        <p className="timer">{timeRemaining}</p></div>
        <h2 className="question">{question.question}</h2>
        <img className="question-image" src={question.image} alt="question" />
        <div className="options">
          {question.options.map((option, index) => (
            <ul key={index} className="option">
              <li
                className={`${
                  selectedAnswers[currentQuestion] === index
                    ? question.correctAnswer === index
                      ? 'correct'
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswerChange(index)}
              >
                {option}
              </li>
            </ul>
          ))}
        </div>
        <div className="navigation">
          <button
            className="nav-button"
            onClick={handlePrevious}
            hidden={currentQuestion === 0}
          >
            Previous
          </button>
          {currentQuestion === quizData.length - 1 ? (
            <button className="nav-button" onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <button className="nav-button" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => (
    <div className="result">
      <h2 className="result-title">Result</h2>
      <div className="score">{score * 10}</div>
      <p className="result-detail-h">Total correct answers</p>
      <p className="result-detail">{score} out of {quizData.length} Questions</p>
      <button
        className="retry-button"
        onClick={() => {
          setSelectedAnswers({});
          setScore(0);
          setCurrentQuestion(0);
          setTimeRemaining(10);
          setCurrentScreen('home');
        }}
      >
        <RefreshCw className="refresh" size={17} />
        Try Again
      </button>
    </div>
  );

  return (
    <div className="app">
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'quiz' && renderQuiz()}
      {currentScreen === 'result' && renderResult()}
    </div>
  );
}

export default App;
