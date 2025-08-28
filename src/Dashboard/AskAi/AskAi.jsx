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
  
  // Add CSS to hide scrollbars
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
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
    // Enhanced formatting for AI responses with better styling
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-200 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-blue-200 italic">$1</em>')
      .replace(/```(.*?)```/gs, '<div class="my-3"><pre class="bg-gray-900/80 border border-gray-600/50 p-4 rounded-lg text-sm overflow-x-auto text-green-300 font-mono shadow-inner"><code>$1</code></pre></div>')
      .replace(/`(.*?)`/g, '<code class="bg-purple-900/50 text-purple-200 px-2 py-1 rounded text-sm font-mono border border-purple-700/30">$1</code>')
      .replace(/^• (.*$)/gim, '<div class="flex items-start mb-2"><span class="text-purple-400 mr-2 mt-1">▸</span><span class="flex-1">$1</span></div>')
      .replace(/^(\d+\.) (.*$)/gim, '<div class="flex items-start mb-2"><span class="text-blue-400 mr-2 font-semibold min-w-[24px]">$1</span><span class="flex-1">$2</span></div>')
      .replace(/\n\n/g, '<div class="my-3"></div>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="h-full overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 hide-scrollbar" 
        style={{ 
          height: 'calc(100vh - 270px)'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg overflow-hidden ${
              message.type === 'user' 
                ? 'bg-gradient-to-br from-purple-500 to-violet-600 border-2 border-purple-300/50' 
                : 'bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-purple-400/30'
            }`}>
              {message.type === 'user' ? (
                user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                )
              ) : (
                <HiSparkles className="w-4 h-4 text-purple-400" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[75%] relative ${
              message.type === 'user' ? 'ml-auto' : 'mr-auto'
            }`}>
              {/* Message Content */}
              <div className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-tr-md'
                  : 'bg-gray-800/90 border border-gray-700/50 text-gray-100 rounded-tl-md'
              }`}>
                <div 
                  className={`leading-relaxed ${message.type === 'ai' ? 'text-gray-100' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: message.type === 'ai' ? formatMessage(message.content) : message.content
                  }}
                />
              </div>
              
              {/* Timestamp */}
              <div className={`text-xs mt-1 px-2 ${
                message.type === 'user' 
                  ? 'text-purple-300 text-right' 
                  : 'text-gray-500 text-left'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            {/* AI Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-purple-400/30 flex items-center justify-center shrink-0 shadow-lg">
              <HiSparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            
            {/* Typing Indicator */}
            <div className="bg-gray-800/90 border border-gray-700/50 p-4 rounded-2xl rounded-tl-md shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-400 text-sm font-medium">AI is thinking...</span>
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