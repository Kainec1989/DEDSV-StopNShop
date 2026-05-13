import { useState, useEffect, useRef } from "react";
import { getApiUrl } from "../../config/api.js";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setTimeout(() => {
        setMessages([{ 
          text: "Hello! I'm the DEDSV assistant. How can I help you today?", 
          sender: "bot" 
        }]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Animation for chat opening
  useEffect(() => {
    if (chatContainerRef.current) {
      if (isOpen) {
        chatContainerRef.current.style.opacity = "0";
        chatContainerRef.current.style.transform = "translateY(20px)";
        setTimeout(() => {
          chatContainerRef.current.style.opacity = "1";
          chatContainerRef.current.style.transform = "translateY(0)";
        }, 50);
      }
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = input.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: "user" },
    ]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate API delay for demo purposes
      setTimeout(async () => {
        try {
          const response = await fetch(`${getApiUrl()}/chatbot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
          });
          
          const data = await response.json();
          
          // Simulate typing effect
          setIsTyping(false);
          setIsLoading(false);
          
          setTimeout(() => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: data.reply, sender: "bot" },
            ]);
          }, 300);
          
        } catch (error) {
          console.error("Error sending message:", error);
          setIsTyping(false);
          setIsLoading(false);
          
          setTimeout(() => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Sorry, I couldn't process your request. Please try again later.", sender: "bot" },
            ]);
          }, 300);
        }
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="w-full sm:w-80 md:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 ease-in-out"
          style={{ 
            opacity: 0, 
            transform: "translateY(20px)",
            transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
            maxWidth: "calc(100vw - 32px)"
          }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#6C6A61] to-[#45423D] text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold">DEDSV Assistant</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="p-4 h-72 md:h-96 overflow-y-auto bg-gray-50 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-400 space-y-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <p className="text-sm">Start your conversation</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } mb-4 ${index === 0 ? "mt-2" : ""} animate-fade-in`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    animation: "fadeIn 0.3s forwards",
                  }}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-[#6C6A61] flex items-center justify-center mr-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#181A1B] to-[#2c2e30] text-white"
                        : "bg-white text-gray-800 border border-gray-100"
                    } shadow-sm`}
                    style={{
                      borderTopRightRadius: msg.sender === "user" ? "4px" : "",
                      borderTopLeftRadius: msg.sender === "bot" ? "4px" : "",
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ml-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#6C6A61] flex items-center justify-center mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="p-3 rounded-2xl bg-white text-gray-800 border border-gray-100 shadow-sm flex items-center" style={{ borderTopLeftRadius: "4px" }}>
                  <span className="w-2 h-2 bg-[#6C6A61] rounded-full mr-1 animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#6C6A61] rounded-full mr-1 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-[#6C6A61] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 px-3 py-1 focus-within:ring-2 focus-within:ring-[#6C6A61] focus-within:border-transparent transition-all duration-200">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow p-2 bg-transparent border-none focus:outline-none text-gray-700"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || input.trim() === ""}
                className={`p-2 rounded-full focus:outline-none transition-all duration-200 transform ${
                  isLoading || input.trim() === "" 
                    ? "text-gray-300 cursor-not-allowed" 
                    : "text-[#6C6A61] hover:text-[#45423D] hover:scale-110"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="text-xs text-center mt-2 text-gray-400">
              Powered by DEDSV Technology
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`float-right p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#45423D] transition-all duration-300 ease-in-out ${
          isOpen 
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
            : "bg-gradient-to-r from-[#6C6A61] to-[#45423D] text-white hover:shadow-xl"
        }`}
        style={{
          transform: isOpen ? "scale(0.9)" : "scale(1)",
          boxShadow: isOpen ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;