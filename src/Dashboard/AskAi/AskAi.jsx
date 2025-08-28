import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { 
  HiPaperAirplane, 
  HiRefresh,
  HiSparkles,
  HiLightBulb,
  HiBookOpen,
  HiCalculator,
  HiCode,
  HiTranslate
} from 'react-icons/hi'
import useAuth from '../../Hook/useAuth'
import Swal from 'sweetalert2'

const AskAi = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello ${user?.displayName || 'there'}! 👋 I'm your AI study assistant powered by Gemini. I can help you with:
      
• 📚 Study questions and explanations
• 🧮 Math and science problems
• 💻 Programming concepts
• 📝 Essay writing and proofreading
• 🌍 Language translation
• 🎯 Study planning and tips

What would you like to explore today?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  // Debug: Log API key availability (don't log the actual key)
  useEffect(() => {
    console.log('API Key available:', !!apiKey)
    console.log('Environment check:', {
      hasKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0
    })
  }, [apiKey])

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      if (apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey)
          // Test with a simple prompt
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
          console.log('API key is valid and model is accessible')
        } catch (error) {
          console.error('API test failed:', error)
        }
      } else {
        console.error('No API key found in environment variables')
      }
    }
    testAPI()
  }, [apiKey])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Initialize Gemini AI
  const initializeAI = () => {
    if (!apiKey) {
      Swal.fire({
        title: 'Service Unavailable',
        text: 'AI service is currently unavailable. Please try again later.',
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const model = initializeAI()
    if (!model) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const result = await model.generateContent(inputMessage.trim())
      const response = await result.response
      const text = response.text()

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: text,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error generating AI response:', error)
      
      let errorMessage = '❌ Sorry, I encountered an error while processing your request.'
      
      // Provide specific error messages based on error type
      if (error.message?.includes('404')) {
        errorMessage = '❌ AI model temporarily unavailable. Please try again in a moment.'
      } else if (error.message?.includes('quota')) {
        errorMessage = '❌ API quota exceeded. Please try again later.'
      } else if (error.message?.includes('authentication') || error.message?.includes('API key')) {
        errorMessage = '❌ Authentication error. Please contact support.'
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = '❌ Network error. Please check your connection and try again.'
      }
      
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: errorMessage,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    Swal.fire({
      title: 'Clear Chat?',
      text: 'This will delete all messages in the current conversation.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Clear',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        setMessages([{
          id: 1,
          type: 'ai',
          content: `Hello ${user?.displayName || 'there'}! 👋 I'm your AI study assistant powered by Gemini. How can I help you today?`,
          timestamp: new Date()
        }])
      }
    })
  }

  const quickPrompts = [
    { icon: HiLightBulb, text: "Explain a concept", prompt: "Can you explain" },
    { icon: HiCalculator, text: "Solve math problem", prompt: "Help me solve this math problem:" },
    { icon: HiCode, text: "Programming help", prompt: "I need help with programming:" },
    { icon: HiTranslate, text: "Translate text", prompt: "Please translate this:" },
    { icon: HiBookOpen, text: "Study tips", prompt: "Give me study tips for:" }
  ]

  const formatMessage = (content) => {
    // Simple formatting for AI responses
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)```/gs, '<pre class="bg-gray-800 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
  }

  return (
    <div className="h-full  overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {[...Array(96)].map((_, i) => (
            <div
              key={i}
              className="border border-purple-500/20 animate-pulse"
              style={{
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10" style={{ height: 'calc(100vh - 270px)' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                  : 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-100'
              }`}
            >
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: message.type === 'ai' ? formatMessage(message.content) : message.content
                }}
              />
              <div className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-purple-200' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-400 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-4 border-t border-gray-700/50 relative z-10">
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(prompt.prompt + ' ')}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              <prompt.icon className="w-4 h-4" />
              <span className="text-sm">{prompt.text}</span>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="w-full px-4 py-3 pr-12 bg-gray-800/60 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={!apiKey || isLoading}
            />
          </div>
          <button
            onClick={clearChat}
            className="p-3 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
            title="Clear Chat"
          >
            <HiRefresh className="w-5 h-5" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !apiKey || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <HiPaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AskAi