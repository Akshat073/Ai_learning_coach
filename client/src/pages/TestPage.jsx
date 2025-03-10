import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import SummeryApi from '../common/SummeryApi';
import Axios from '../utils/Axios';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [streak, setStreak] = useState(0);
  const topic = searchParams.get('topic');
  const userId = searchParams.get('id');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowResults(false);
        setSelectedAnswers({});

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use a valid model

        // Create prompt for generating questions
        const prompt = `Create 10 multiple choice questions about "${topic}". Return ONLY a JSON array with no additional text or formatting. Each object in the array should have exactly these properties:
        {
          "question": "the question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": 0
        }
        Make sure the response is valid JSON that can be parsed directly.`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response text
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
        
        try {
          const parsedQuestions = JSON.parse(cleanText);
          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
            setQuestions(parsedQuestions);
          } else {
            throw new Error('Invalid question format received');
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.log('Received text:', cleanText);
          throw new Error('Failed to parse AI response');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to generate questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (topic && userId) {
      fetchQuestions();
    }
  }, [topic, userId]);

  useEffect(() => {
    if (showResults && score >= 70) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const colors = ['#FF69B4', '#4B0082', '#9370DB', '#00CED1'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [showResults, score]);

  useEffect(() => {
    if (!showResults && questions.length > 0) {
      setTimeLeft(60); // 60 seconds per question
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, showResults, questions.length]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (timeLeft === 0) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));

    if (questionIndex === currentQuestionIndex && currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    }

    // Update streak
    if (questions[questionIndex].correctAnswer === optionIndex) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleSubmit = async () => {
    const totalQuestions = questions.length;
    const correctAnswer = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const wrongAnswer = totalQuestions - correctAnswer;
    setScore((correctAnswer / totalQuestions) * 100);
    setShowResults(true);

    try {
      await Axios({
        method: SummeryApi.updateAnswer.method,
        url: SummeryApi.updateAnswer.url,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: {
          userId,
          topic,
          correctAnswer,
          wrongAnswer
        }
      });

      // Fetch updated user details
      const userResponse = await Axios({
        method: SummeryApi.getUserDetails.method,
        url: SummeryApi.getUserDetails.url,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (userResponse.data.success) {
        dispatch(setUserDetails(userResponse.data.data));
      }
    } catch (error) {
      console.error('Error updating answers:', error);
    }
  };

  const getOptionStyle = (questionIndex, optionIndex) => {
    if (!showResults) {
      return selectedAnswers[questionIndex] === optionIndex
        ? 'bg-blue-100 border-blue-500'
        : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50';
    }

    if (questions[questionIndex].correctAnswer === optionIndex) {
      return 'bg-green-100 border-green-500';
    }
    if (selectedAnswers[questionIndex] === optionIndex) {
      return 'bg-red-100 border-red-500';
    }
    return 'bg-white border-gray-200';
  };

  if (!topic || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Parameters</h2>
          <p className="mt-2 text-gray-600">Missing topic or user information.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-bounce">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-medium text-indigo-600 mt-4 animate-pulse">
            Preparing your {topic} quiz...
          </p>
          <p className="text-gray-500 mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-red-500">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl lg:p-8 p-4 transition-all duration-300 hover:shadow-indigo-200">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-indigo-100 rounded-lg px-4 py-2">
                <span className="text-indigo-600 font-medium">Question {currentQuestionIndex + 1}/{questions.length}</span>
              </div>
              {!showResults && (
                <div className="bg-indigo-100 rounded-lg px-4 py-2">
                  <span className={`font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-indigo-600'}`}>
                    Time: {timeLeft}s
                  </span>
                </div>
              )}
              <div className="bg-indigo-100 rounded-lg px-4 py-2">
                <span className="text-indigo-600 font-medium">Streak: {streak} 🔥</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              {topic}
            </h1>
            
            {showResults && (
              <div className="mt-6 transform transition-all duration-500 animate-slide-up">
                <div className={`text-3xl font-bold mb-2 ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  Score: {score.toFixed(1)}%
                </div>
                <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      score >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-indigo-600">{Object.keys(selectedAnswers).length}</div>
                    <div className="text-sm text-indigo-600">Questions Answered</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.entries(selectedAnswers).filter(([index, answer]) => 
                        questions[parseInt(index)].correctAnswer === answer
                      ).length}
                    </div>
                    <div className="text-sm text-green-600">Correct Answers</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{streak}</div>
                    <div className="text-sm text-purple-600">Max Streak</div>
                  </div>
                </div>
                <p className={`text-lg font-medium ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {score >= 70 ? 'Excellent work! 🎉 Keep it up!' : 'Don\'t give up! 💪 You can do better!'}
                </p>
              </div>
            )}
          </div>

          {
            !showResults && (<div className="space-y-6">
              {questions.map((q, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl p-4 shadow-lg transition-all duration-500 transform ${
                    index === currentQuestionIndex ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'
                  } hover:shadow-xl border border-gray-100`}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 mr-3 font-bold">
                      {index + 1}
                    </span>
                    {q.question}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => !showResults && handleAnswerSelect(index, optIndex)}
                        disabled={showResults || timeLeft === 0}
                        className={`group w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                          timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          getOptionStyle(index, optIndex)
                        } ${
                          !showResults && selectedAnswers[index] === optIndex
                            ? 'ring-2 ring-indigo-500 ring-offset-2'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedAnswers[index] === optIndex
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300 group-hover:border-indigo-400'
                          }`}>
                            {selectedAnswers[index] === optIndex && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-lg">{option}</span>
                          {showResults && q.correctAnswer === optIndex && (
                            <span className="ml-auto text-green-500">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {showResults && selectedAnswers[index] !== q.correctAnswer && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>)
          }
          

          {!showResults && Object.keys(selectedAnswers).length === questions.length && (
            <div className="mt-10 transform transition-all duration-300">
              <button
                onClick={handleSubmit}
                className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit Answers
              </button>
            </div>
          )}

          {showResults && (
            <div className="mt-10 transform transition-all duration-300 flex flex-col items-center">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 px-6 mb-2 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Take Another Test
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 px-6 mb-2 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
              >
              Go Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
