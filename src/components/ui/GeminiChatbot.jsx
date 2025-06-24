import React, { useState, useRef, useEffect } from "react";
import { geminiService } from "../../gemini/index";
import { Link } from "react-router-dom";

const GeminiChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [displayText, setDisplayText] = useState("");
  const [responseLength, setResponseLength] = useState("short");
  const [showFeedbackRequest, setShowFeedbackRequest] = useState(false);
  const [lastResponseIndex, setLastResponseIndex] = useState(-1);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textToTypeRef = useRef("");
  const charIndexRef = useRef(0);
  const typeIntervalRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayText, showFeedbackRequest, showRegisterPrompt]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target) &&
        !event.target.classList.contains("chatbot-toggle")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isTyping && currentTypingIndex !== -1) {
      const startTypingEffect = () => {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);

        charIndexRef.current = 0;
        setDisplayText("");
        if (currentTypingIndex >= 0 && currentTypingIndex < messages.length) {
          typeIntervalRef.current = setInterval(() => {
            if (charIndexRef.current < textToTypeRef.current.length) {
              setDisplayText(
                (text) => text + textToTypeRef.current[charIndexRef.current]
              );
              charIndexRef.current++;
            } else {
              clearInterval(typeIntervalRef.current);
              setIsTyping(false);

              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                if (
                  updatedMessages[currentTypingIndex] &&
                  !updatedMessages[currentTypingIndex].isUser
                ) {
                  updatedMessages[currentTypingIndex] = {
                    ...updatedMessages[currentTypingIndex],
                    text: textToTypeRef.current,
                    isTyping: false,
                  };
                }
                return updatedMessages;
              });

              setLastResponseIndex(currentTypingIndex);
              setShowFeedbackRequest(true);
            }
          }, 15);
        } else {
          console.log("CurrentTypingIndex khong hop le: ", currentTypingIndex);
          setIsTyping(false);
        }
      };

      startTypingEffect();

      return () => {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      };
    }
  }, [isTyping, currentTypingIndex, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || loading || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setShowFeedbackRequest(false);
    setShowRegisterPrompt(false);
    setLoading(true);
    const timestamp = new Date();
    const userMessageObj = {
      id: Date.now(),
      text: userMessage,
      isUser: true,
      timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, userMessageObj]);

    try {
      const botMessageId = Date.now() + 1;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: botMessageId,
          text: "",
          isUser: false,
          isTyping: true,
          timestamp: new Date(),
        },
      ]);

      const result = await geminiService.generateResponse(
        userMessage,
        chatHistory,
        responseLength
      );

      setChatHistory(result.history);

      setMessages((prevMessages) => {
        const botIndex = prevMessages.findIndex(
          (msg) => msg.id === botMessageId
        );
        if (botIndex !== -1) {
          setCurrentTypingIndex(botIndex);
          textToTypeRef.current = result.message;
          setTimeout(() => {
            setIsTyping(true);
          }, 100);
          return prevMessages;
        }
        return prevMessages;
      });
    } catch (error) {
      console.error("Error in chat:", error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 2,
          text: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.",
          isUser: false,
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (isSatisfied) => {
    setShowFeedbackRequest(false);

    if (isSatisfied) {
      console.log("Messages trước khi thêm phản hồi:", messages);

      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            text: "Cảm ơn bạn đã đánh giá! Bạn có thể tiếp tục đặt câu hỏi.",
            isUser: false,
            isFeedback: true,
            timestamp: new Date(),
          },
        ];
        console.log("Messages sau khi thêm phản hồi:", newMessages);
        return newMessages;
      });
    } else {
      setShowRegisterPrompt(true);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="fixed bottom-25 right-7 z-50">
      <button
        onClick={toggleChat}
        className="chatbot-toggle bg-gradient-to-r from-blue-500 to-blue-900 hover:from-blue-600 hover:to-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          ref={chatContainerRef}
          className="absolute bottom-3 right-17 w-[90vw] sm:w-[350px] md:w-[400px] h-[550px] rounded-2xl shadow-2xl transition-all duration-500 ease-in-out flex flex-col bg-white overflow-hidden border border-gray-200"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Tư vấn giáo dục giới tính</h2>
                <p className="text-xs opacity-80">Hỏi đáp với AI tư vấn</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-6">
                <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-gray-700 text-lg">
                  Chào mừng bạn đến với dịch vụ tư vấn giáo dục giới tính
                </p>
                <p className="mt-2 text-gray-500">
                  Hãy đặt câu hỏi và AI sẽ giúp bạn giải đáp mọi thắc mắc.
                </p>
                <button
                  onClick={() =>
                    setInput("Xin chào, tôi muốn hỏi về giáo dục giới tính")
                  }
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                >
                  Bắt đầu trò chuyện
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className="w-full">
                    <div
                      className={`mb-1 ${
                        message.isUser ? "text-right" : "text-left"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          message.isUser ? "text-blue-900" : "text-blue-600"
                        }`}
                      >
                        {message.isUser ? "Bạn" : "AI Tư Vấn"}
                      </span>
                    </div>

                    <div
                      className={`flex ${
                        message.isUser === true
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!message.isUser && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 mr-2 flex items-center justify-center text-white shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[75%] ${
                          message.isUser
                            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-tr-none shadow-md"
                            : message.isError
                            ? "bg-red-100 text-red-800 rounded-tl-none shadow-sm"
                            : message.isFeedback
                            ? "bg-green-100 text-green-800 rounded-tl-none shadow-sm"
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100"
                        } ${message.isTyping ? "animate-pulse" : ""}`}
                      >
                        {index === currentTypingIndex && isTyping ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatMessage(displayText),
                            }}
                          />
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatMessage(message.text),
                            }}
                          />
                        )}

                        {message.isTyping && index !== currentTypingIndex && (
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {message.isUser && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex-shrink-0 ml-2 flex items-center justify-center text-white shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div
                      className={`mt-1 ${
                        message.isUser ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="text-xs text-gray-400">
                        {message.timestamp
                          ? message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </span>
                    </div>
                  </div>
                ))}

                {showFeedbackRequest && !isTyping && lastResponseIndex >= 0 && (
                  <div className="flex justify-center mt-4">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
                      <p className="text-gray-700 mb-3">
                        Bạn có hài lòng với câu trả lời này không?
                      </p>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleFeedback(true)}
                          className="px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Hài lòng
                        </button>
                        <button
                          onClick={() => handleFeedback(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm hover:bg-gray-600 transition flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Không hài lòng
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showRegisterPrompt && (
                  <div className="flex justify-center mt-4">
                    <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-100 text-center">
                      <p className="text-gray-700 mb-2">
                        Rất tiếc vì chúng tôi chưa đáp ứng được nhu cầu của bạn.
                      </p>
                      <p className="text-gray-600 mb-3 text-sm">
                        Bạn có thể đăng ký tư vấn trực tiếp với các chuyên gia
                        của chúng tôi.
                      </p>
                      <Link
                        to="/appointment"
                        className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm hover:from-pink-600 hover:to-purple-700 transition inline-block"
                      >
                        Đăng ký tư vấn trực tiếp
                      </Link>
                      <button
                        onClick={() => setShowRegisterPrompt(false)}
                        className="block mx-auto mt-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Tiếp tục trò chuyện với AI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3 bg-white">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-100 rounded-full p-1 inline-flex shadow-sm">
                <button
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    responseLength === "short"
                      ? "bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setResponseLength("short")}
                >
                  Ngắn gọn
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full mx-1 transition-all ${
                    responseLength === "medium"
                      ? "bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setResponseLength("medium")}
                >
                  Vừa phải
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    responseLength === "long"
                      ? "bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setResponseLength("long")}
                >
                  Chi tiết
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-2 border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập câu hỏi của bạn..."
                disabled={loading || isTyping}
              />
              <button
                onClick={handleSend}
                disabled={loading || isTyping || !input.trim()}
                className={`ml-2 p-2 rounded-full ${
                  loading || isTyping || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-900"
                } transition-all duration-300`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
            {isTyping && (
              <div className="mt-2 text-xs text-center text-gray-500">
                AI đang trả lời...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatbot;
