import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm CourseBot 🤖. What would you like to learn today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot typing...
    setTimeout(() => {
      const reply = generateReply(input);
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateReply = (text) => {
    const query = text.toLowerCase();

    // Keywords mapped to responses
    if (query.includes("ai") || query.includes("artificial intelligence"))
      return "AI is awesome! Check out 'Python for Data Science and AI' on Coursera 🤖";
    if (query.includes("cyber") || query.includes("security"))
      return "Security matters! Try 'Cybersecurity 101' on Udemy 🔐";
    if (query.includes("web") || query.includes("html") || query.includes("css"))
      return "Build the web! 'Web Dev Concepts' on Infosys Springboard is a good start 🌐";
    if (query.includes("ui") || query.includes("ux") || query.includes("design"))
      return "Design lover? 'Intro to UI/UX' on Springboard is perfect for you 🎨";
    if (query.includes("python"))
      return "You can try 'Learn Python in 12 Days' on Udemy 🐍";
    if (query.includes("beginner"))
      return "We recommend 'Learn to Program: The Fundamentals' on Coursera for beginners 👶";
    if (query.includes("platform"))
      return "We pull courses from Coursera, edX, Udemy and Infosys Springboard 📚";
    if (query.includes("difficulty"))
      return "Most of our courses are Beginner-friendly, but we have Intermediate and Advanced too 💪";
    if (query.includes("duration"))
      return "Courses range from 2 hours to 6 weeks. You can filter them on the Home Page 🕒";
    if (query.includes("quiz"))
      return "Oh yes! You can take a 3-level quiz to get personalized course recommendations 🎯";
    if (query.includes("recommendation"))
      return "Just go to the Quiz page and get your tailored recommendations 💡";
    if (query.includes("save") || query.includes("bookmark"))
      return "When you see a course you like, click 'Save for Later' to bookmark it 📌";
    if (query.includes("dashboard"))
      return "Your Dashboard shows your profile, saved courses, and your recommendations 📋";

    // Default fallback
    const fallbacks = [
      "Hmm, I'm not sure I understand. Try asking about AI, Python, Cybersecurity, or UI/UX 😊",
      "Could you rephrase that? I'm still learning too! 🧠",
      "Check the Recommendations page for more help 🔍",
      "That's interesting! Try using keywords like 'AI', 'Web Development', or 'Python' 💡"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            CourseBot 🤖
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot">
                <i>Typing...</i>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Ask me about courses, platforms, or recommendations..."
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}
