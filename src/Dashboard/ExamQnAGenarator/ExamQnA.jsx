import React, { useState } from 'react'
import { 
  HiQuestionMarkCircle, 
  HiLightBulb, 
  HiRefresh, 
  HiCheckCircle,
  HiXCircle,
  HiPlay,
  HiPause,
  HiClock
} from 'react-icons/hi'

const ExamQnA = () => {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isQuizMode, setIsQuizMode] = useState(false)

  // Sample questions database
  const questionsBank = {
    mathematics: [
      {
        id: 1,
        question: "What is the derivative of x²?",
        options: ["2x", "x", "2", "x²"],
        answer: "2x",
        explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "What is the integral of 2x dx?",
        options: ["x²", "x² + C", "2x²", "2x² + C"],
        answer: "x² + C",
        explanation: "∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C",
        difficulty: "medium"
      },
      {
        id: 3,
        question: "Solve: lim(x→0) (sin x)/x",
        options: ["0", "1", "∞", "undefined"],
        answer: "1",
        explanation: "This is a standard limit that equals 1, fundamental in calculus.",
        difficulty: "hard"
      }
    ],
    physics: [
      {
        id: 1,
        question: "What is Newton's second law of motion?",
        options: ["F = ma", "E = mc²", "v = u + at", "PV = nRT"],
        answer: "F = ma",
        explanation: "Newton's second law states that Force equals mass times acceleration.",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "What is the unit of electric current?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        answer: "Ampere",
        explanation: "Electric current is measured in Amperes (A), named after André-Marie Ampère.",
        difficulty: "medium"
      }
    ],
    computerscience: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
        answer: "Hyper Text Markup Language",
        explanation: "HTML stands for Hyper Text Markup Language, used for creating web pages.",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: "O(log n)",
        explanation: "Binary search has O(log n) time complexity as it divides the search space in half each iteration.",
        difficulty: "medium"
      }
    ]
  }

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'computerscience', label: 'Computer Science' }
  ]

  const generateQuestion = () => {
    if (!selectedSubject) return

    const subjectQuestions = questionsBank[selectedSubject] || []
    const filteredQuestions = subjectQuestions.filter(q => q.difficulty === difficulty)
    
    if (filteredQuestions.length === 0) {
      setCurrentQuestion(null)
      return
    }

    const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
    setCurrentQuestion(randomQuestion)
    setShowAnswer(false)
  }

  const handleAnswer = (selectedAnswer) => {
    if (!currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.answer
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    setShowAnswer(true)
  }

  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 })
    setCurrentQuestion(null)
    setShowAnswer(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <HiQuestionMarkCircle className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Exam Q&A Generator</h1>
      </div>

      {/* Configuration Panel */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>{subject.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={generateQuestion}
              disabled={!selectedSubject}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiRefresh className="w-4 h-4" />
              <span>Generate</span>
            </button>
            <button
              onClick={resetQuiz}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Score Panel */}
      {score.total > 0 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HiCheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-white font-medium">Quiz Progress</span>
            </div>
            <div className="text-white">
              <span className="text-green-400 font-bold">{score.correct}</span>
              <span className="text-gray-400"> / </span>
              <span className="font-bold">{score.total}</span>
              <span className="text-gray-400 ml-2">
                ({Math.round((score.correct / score.total) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Question Panel */}
      {currentQuestion ? (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Question</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-200 leading-relaxed">{currentQuestion.question}</p>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  showAnswer
                    ? option === currentQuestion.answer
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : 'bg-gray-700/30 border-gray-600/30 text-gray-400'
                    : 'bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50 hover:border-gray-500/50'
                } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {showAnswer && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <HiLightBulb className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Explanation</span>
              </div>
              <p className="text-gray-200">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-12 border border-gray-700/50 text-center">
          <HiQuestionMarkCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Question Generated</h3>
          <p className="text-gray-500">
            {selectedSubject 
              ? "Click 'Generate' to get a random question" 
              : "Please select a subject first"
            }
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">How to Use</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Select a subject and difficulty level</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Click "Generate" to get a random question</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Choose your answer from the multiple choice options</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>View the explanation and track your score</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ExamQnA