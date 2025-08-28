import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { 
  HiQuestionMarkCircle, 
  HiLightBulb, 
  HiRefresh, 
  HiCheckCircle,
  HiXCircle,
  HiPlay,
  HiPause,
  HiClock,
  HiSparkles,
  HiPaperAirplane,
  HiChatAlt2,
  HiCog,
  HiArrowRight
} from 'react-icons/hi'
import Swal from 'sweetalert2'

const ExamQnA = () => {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionType, setQuestionType] = useState('mcq')
  const [numberOfQuestions, setNumberOfQuestions] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [allQuestions, setAllQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [allAnswers, setAllAnswers] = useState([])
  const [allResults, setAllResults] = useState([])
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [quizStarted, setQuizStarted] = useState(false)

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  // Initialize Gemini AI
  const initializeAI = () => {
    if (!apiKey) {
      Swal.fire({
        title: 'Service Unavailable',
        text: 'AI service is currently unavailable. Please check your API configuration.',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
      return null
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      })
      return model
    } catch (error) {
      console.error('Error initializing Gemini AI:', error)
      Swal.fire({
        title: 'Service Error',
        text: 'AI service encountered an error. Please try again later.',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
      return null
    }
  }

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice Questions (MCQ)' },
    { value: 'short-answer', label: 'Short Answer Questions' },
    { value: 'true-false', label: 'True/False Questions' },
    { value: 'fill-blanks', label: 'Fill in the Blanks' }
  ]

  const generateAIQuestion = async () => {
    if (!selectedSubject.trim()) return

    const model = initializeAI()
    if (!model) return

    setIsGenerating(true)
    setCurrentQuestion(null)
    setAllQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setSelectedOption('')
    setResult(null)

    try {
      const topic = selectedSubject.trim()
      const questions = []
      
      // Generate multiple questions
      for (let i = 0; i < numberOfQuestions; i++) {
        let prompt = ''
        
        switch (questionType) {
          case 'mcq':
            prompt = `Generate a ${difficulty} level multiple choice question about ${topic}. Make sure it's unique and different from previous questions.
            
            Format as JSON:
            {
              "question": "Your question here",
              "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
              "correct_answer": "A) Correct option text",
              "explanation": "Why this answer is correct"
            }`
            break
            
          case 'true-false':
            prompt = `Generate a ${difficulty} level true/false question about ${topic}. Make sure it's unique and different from previous questions.
            
            Format as JSON:
            {
              "question": "Your true/false statement here",
              "options": ["True", "False"],
              "correct_answer": "True or False",
              "explanation": "Why this answer is correct"
            }`
            break
            
          case 'short-answer':
            prompt = `Generate a ${difficulty} level short answer question about ${topic}. Make sure it's unique and different from previous questions.
            
            Format as JSON:
            {
              "question": "Your question here",
              "correct_answer": "Expected answer",
              "explanation": "Detailed explanation of the answer"
            }`
            break
            
          case 'fill-blanks':
            prompt = `Generate a ${difficulty} level fill-in-the-blanks question about ${topic}. Make sure it's unique and different from previous questions.
            
            Format as JSON:
            {
              "question": "Statement with _____ to fill",
              "correct_answer": "Word or phrase to fill the blank",
              "explanation": "Why this is the correct answer"
            }`
            break
        }

        try {
          const result = await model.generateContent(prompt)
          const response = await result.response
          const text = response.text()

          const cleanText = text.replace(/```json|```/g, '').trim()
          const questionData = JSON.parse(cleanText)
          
          const questionObj = {
            id: Date.now() + i,
            type: questionType,
            question: questionData.question,
            options: questionData.options || null,
            correct_answer: questionData.correct_answer,
            explanation: questionData.explanation,
            difficulty: difficulty,
            topic: topic,
            questionNumber: i + 1,
            totalQuestions: numberOfQuestions
          }
          
          questions.push(questionObj)
          
          // Add a small delay between API calls to avoid rate limiting
          if (i < numberOfQuestions - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }

        } catch (parseError) {
          console.error(`Error generating question ${i + 1}:`, parseError)
          // Continue with other questions even if one fails
        }
      }

      if (questions.length > 0) {
        setAllQuestions(questions)
        setCurrentQuestion(questions[0])
        setCurrentQuestionIndex(0)
        setQuizStarted(true)
      } else {
        throw new Error('Failed to generate any questions')
      }

    } catch (error) {
      console.error('Error generating AI question:', error)
      Swal.fire({
        title: 'Generation Failed',
        text: 'Failed to generate question. Please try again.',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const checkAnswer = async () => {
    if (!currentQuestion) return

    setIsChecking(true)

    try {
      const userResponse = currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false' 
        ? selectedOption 
        : userAnswer

      // Store the answer for later evaluation
      const answerData = {
        questionIndex: currentQuestionIndex,
        question: currentQuestion,
        userAnswer: userResponse,
        timestamp: new Date().toISOString()
      }

      setAllAnswers(prev => [...prev, answerData])

      // Move to next question or show results
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < allQuestions.length) {
        setCurrentQuestionIndex(nextIndex)
        setCurrentQuestion(allQuestions[nextIndex])
        setUserAnswer('')
        setSelectedOption('')
        setResult(null)
      } else {
        // All questions completed, now evaluate all answers
        await evaluateAllAnswers([...allAnswers, answerData])
      }

    } catch (error) {
      console.error('Error processing answer:', error)
      Swal.fire({
        title: 'Processing Failed',
        text: 'Failed to process your answer. Please try again.',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setIsChecking(false)
    }
  }

  const evaluateAllAnswers = async (answers) => {
    const model = initializeAI()
    if (!model) return

    setIsChecking(true)

    try {
      const results = []
      let correctCount = 0

      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i]
        
        const prompt = `Evaluate this answer:
        
        Question: ${answer.question.question}
        Correct Answer: ${answer.question.correct_answer}
        User Answer: ${answer.userAnswer}
        Question Type: ${answer.question.type}
        
        Please evaluate and respond with JSON:
        {
          "is_correct": true/false,
          "score": number from 0-100,
          "feedback": "Detailed feedback explaining why the answer is correct/incorrect",
          "suggestions": "Suggestions for improvement if answer is wrong"
        }`

        try {
          const result = await model.generateContent(prompt)
          const response = await result.response
          const text = response.text()

          const cleanText = text.replace(/```json|```/g, '').trim()
          const evaluation = JSON.parse(cleanText)
          
          const resultData = {
            questionIndex: answer.questionIndex,
            question: answer.question,
            userAnswer: answer.userAnswer,
            is_correct: evaluation.is_correct,
            score: evaluation.score,
            feedback: evaluation.feedback,
            suggestions: evaluation.suggestions || '',
            correct_answer: answer.question.correct_answer
          }

          results.push(resultData)
          if (evaluation.is_correct) correctCount++

          // Add delay between API calls
          if (i < answers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }

        } catch (parseError) {
          console.error(`Error evaluating answer ${i + 1}:`, parseError)
          // Fallback evaluation
          const isCorrect = answer.userAnswer.toLowerCase().includes(answer.question.correct_answer.toLowerCase())
          const resultData = {
            questionIndex: answer.questionIndex,
            question: answer.question,
            userAnswer: answer.userAnswer,
            is_correct: isCorrect,
            score: isCorrect ? 100 : 0,
            feedback: isCorrect ? 'Correct answer!' : 'Incorrect answer.',
            suggestions: isCorrect ? '' : 'Please review the topic and try again.',
            correct_answer: answer.question.correct_answer
          }
          results.push(resultData)
          if (isCorrect) correctCount++
        }
      }

      setAllResults(results)
      setScore({ correct: correctCount, total: answers.length })
      setShowFinalResults(true)

    } catch (error) {
      console.error('Error evaluating answers:', error)
      Swal.fire({
        title: 'Evaluation Failed',
        text: 'Failed to evaluate your answers. Please try again.',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setIsChecking(false)
    }
  }

  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 })
    setCurrentQuestion(null)
    setAllQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswer('')
    setSelectedOption('')
    setResult(null)
    setAllAnswers([])
    setAllResults([])
    setShowFinalResults(false)
    setQuizStarted(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
        <HiQuestionMarkCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">AI-Powered Exam Q&A Generator</h1>
      </div>

      {showFinalResults ? (
        /* Final Results Section */
        <div className="space-y-4 sm:space-y-6">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Completed!</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-400">{score.correct}</div>
                <div className="text-sm sm:text-base text-gray-300">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-400">{score.total - score.correct}</div>
                <div className="text-sm sm:text-base text-gray-300">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-400">{Math.round((score.correct / score.total) * 100)}%</div>
                <div className="text-sm sm:text-base text-gray-300">Score</div>
              </div>
            </div>
            <button
              onClick={resetQuiz}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium"
            >
              Start New Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div className="space-y-3 sm:space-y-4">
            {allResults.map((result, index) => (
              <div key={index} className={`bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                result.is_correct ? 'border-green-500/20' : 'border-red-500/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Question {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    {result.is_correct ? (
                      <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    ) : (
                      <HiXCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                    )}
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      result.is_correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {result.score}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm sm:text-base text-gray-300 font-medium mb-2">Question:</h4>
                    <p className="text-sm sm:text-base text-gray-200 bg-gray-700/30 p-3 rounded-lg">{result.question.question}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-sm sm:text-base text-gray-300 font-medium mb-2">Your Answer:</h4>
                      <p className={`text-sm sm:text-base p-3 rounded-lg ${
                        result.is_correct ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
                      }`}>
                        {result.userAnswer}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base text-gray-300 font-medium mb-2">Correct Answer:</h4>
                      <p className="text-sm sm:text-base text-green-300 bg-green-500/10 p-3 rounded-lg">{result.correct_answer}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base text-gray-300 font-medium mb-2">AI Feedback:</h4>
                    <p className="text-sm sm:text-base text-gray-200 bg-blue-500/10 p-3 rounded-lg">{result.feedback}</p>
                  </div>

                  {result.suggestions && (
                    <div>
                      <h4 className="text-sm sm:text-base text-gray-300 font-medium mb-2">Suggestions for Improvement:</h4>
                      <p className="text-sm sm:text-base text-yellow-300 bg-yellow-500/10 p-3 rounded-lg">{result.suggestions}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !quizStarted ? (
        <>
          {/* Configuration Panel */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <HiCog className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-400" />
              Quiz Configuration
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Subject Input */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-gray-300 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mr-1.5 sm:mr-2"></span>
                  Subject/Topic
                </label>
                <input
                  type="text"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  placeholder="Enter subject or topic (e.g., Mathematics, Physics, History)"
                  className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/40 rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm shadow-lg"
                />
              </div>

              {/* Question Type */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-gray-300 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-1.5 sm:mr-2"></span>
                  Question Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/40 rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm shadow-lg appearance-none cursor-pointer"
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="text-gray-300 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mr-1.5 sm:mr-2"></span>
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/40 rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 backdrop-blur-sm shadow-lg appearance-none cursor-pointer"
                >
                  <option value="easy" className="bg-gray-800 text-white">🟢 Easy</option>
                  <option value="medium" className="bg-gray-800 text-white">🟡 Medium</option>
                  <option value="hard" className="bg-gray-800 text-white">🔴 Hard</option>
                </select>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <label className="text-gray-300 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2"></span>
                  Number of Questions
                </label>
                <select
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                  className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/40 rounded-lg sm:rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 backdrop-blur-sm shadow-lg appearance-none cursor-pointer"
                >
                  <option value={1} className="bg-gray-800 text-white">1️⃣ 1 Question</option>
                  <option value={3} className="bg-gray-800 text-white">3️⃣ 3 Questions</option>
                  <option value={5} className="bg-gray-800 text-white">5️⃣ 5 Questions</option>
                  <option value={10} className="bg-gray-800 text-white">🔟 10 Questions</option>
                  <option value={15} className="bg-gray-800 text-white">1️⃣5️⃣ 15 Questions</option>
                  <option value={20} className="bg-gray-800 text-white">2️⃣0️⃣ 20 Questions</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={generateAIQuestion}
                disabled={!selectedSubject.trim() || isGenerating}
                className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white px-12 py-4 rounded-2xl hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 transition-all duration-300 flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-2xl shadow-purple-500/25 border border-purple-500/20 backdrop-blur-sm group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-4">
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Generating {numberOfQuestions} Question{numberOfQuestions > 1 ? 's' : ''}...</span>
                    </>
                  ) : (
                    <>
                      <HiSparkles className="w-6 h-6 animate-pulse" />
                      <span>Generate {numberOfQuestions} AI Question{numberOfQuestions > 1 ? 's' : ''}</span>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
              <HiLightBulb className="w-5 h-5 mr-2" />
              How to Use AI Quiz Generator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <p className="text-gray-300">Type any subject or topic you want to study</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <p className="text-gray-300">Select question type and difficulty level</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <p className="text-gray-300">Click "Generate" to create AI-powered questions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <p className="text-gray-300">Answer questions and get AI feedback</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Score Panel */}
          {score.total > 0 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HiCheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white font-medium">Quiz Progress</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-white">
                    <span className="text-green-400 font-bold">{score.correct}</span>
                    <span className="text-gray-400"> / </span>
                    <span className="font-bold">{score.total}</span>
                    <span className="text-gray-400 ml-2">
                      ({Math.round((score.correct / score.total) * 100)}%)
                    </span>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm"
                  >
                    Reset Quiz
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question Panel */}
          {currentQuestion ? (
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Question {currentQuestionIndex + 1} of {allQuestions.length}
                  </h3>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    {questionType.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                  <div className="w-32 sm:w-40 bg-gray-700/50 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">Progress: {Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%</span>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">{currentQuestion.question}</p>
              </div>

              {/* Answer Options for MCQ and True/False */}
              {(currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false') && currentQuestion.options && (
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOption(option)}
                      disabled={result !== null}
                      className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200 text-sm sm:text-base ${
                        selectedOption === option
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : result !== null
                            ? 'bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-default'
                            : 'bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50 hover:border-gray-500/50 cursor-pointer'
                      }`}
                    >
                      <span className="font-medium mr-2 sm:mr-3">{option.substring(0, 2)}</span>
                      {option.substring(3)}
                    </button>
                  ))}
                </div>
              )}

              {/* Text Input for Short Answer and Fill Blanks */}
              {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'fill-blanks') && (
                <div className="mb-4 sm:mb-6">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={result !== null}
                    placeholder="Type your answer here..."
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    rows="4"
                  />
                </div>
              )}

              {/* Submit Answer Button */}
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={
                    isChecking || 
                    ((currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false') && !selectedOption) ||
                    ((currentQuestion.type === 'short-answer' || currentQuestion.type === 'fill-blanks') && !userAnswer.trim())
                  }
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center sm:justify-start space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                >
                  {isChecking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {currentQuestionIndex + 1 >= allQuestions.length 
                          ? 'Evaluating All Answers...' 
                          : 'Moving to Next Question...'
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {currentQuestionIndex + 1 >= allQuestions.length 
                          ? 'Submit & Finish Quiz' 
                          : 'Submit & Next Question'
                        }
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-12 border border-gray-700/50 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Generating AI Question...</h3>
              <p className="text-gray-500">Please wait while AI creates your personalized question</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExamQnA