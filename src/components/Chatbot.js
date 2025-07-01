import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm CourseBot 🤎. What would you like to learn today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(input);
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateReply = (text) => {
    const query = text.toLowerCase();

    if (query.includes("bye") || query.includes("goodbye") || query.includes("see you"))
      return "Goodbye! May your learning be as strong as espresso ☕😊";

    if (query.includes("thank") || query.includes("tq") || query.includes("thanks"))
      return "You're most welcome! Happy to help anytime ☕💛";

    if (query.includes("welcome"))
      return "Thank you! I'm always here to serve fresh learning ☕🤎";

    if (
      query.includes("great job") ||
      query.includes("good job") ||
      query.includes("awesome") ||
      query.includes("nice") ||
      query.includes("cool")
    )
      return "Aww, thanks! You're the cream in my coffee ☕😄";

    if (query.includes("ai") || query.includes("artificial intelligence"))
      return "AI is brewing hot right now! Try 'AI For Everyone' on Coursera ☕🤖";
    if (query.includes("cyber") || query.includes("security"))
      return "For Cybersecurity, I recommend 'Cyber Safe Essentials' on Udemy 🔐";
    if (query.includes("web") || query.includes("html") || query.includes("css"))
      return "Let’s craft the web! Check out 'HTML/CSS Bootcamp' on Springboard 🌐";
    if (query.includes("javascript") || query.includes("js"))
      return "JavaScript is a must-have! Try 'Modern JS from Scratch' ☕📜";
    if (query.includes("react"))
      return "'React for Beginners' on Coursera will jumpstart your journey 🚀";
    if (query.includes("ui") || query.includes("ux") || query.includes("design"))
      return "Design dreams start with 'Intro to UI/UX' on Infosys Springboard 🎨";
    if (query.includes("python"))
      return "Python is smooth like a latte! Try 'Learn Python in 12 Days' 🐍";
    if (query.includes("java"))
      return "Grab a hot Java course! Try 'Java Programming Masterclass' ☕👨‍💻";
    if (query.includes("beginner"))
      return "'Programming Fundamentals' on Coursera is perfect for beginners 👶";
    if (query.includes("advanced"))
      return "'Advanced Programming Concepts' on edX is great for leveling up 💪";
    if (query.includes("platform"))
      return "We pull courses from Coursera, edX, Udemy, and Infosys Springboard 📚";
    if (query.includes("duration"))
      return "Courses can be short like an espresso shot (2 hrs) or a full brew (6 weeks) ⏳";
    if (query.includes("difficulty"))
      return "Courses range from Beginner ☕ to Advanced ☕☕☕—you choose the roast!";
    if (query.includes("quiz"))
      return "Take our 3-level quiz to get freshly brewed course picks just for you 🎯";
    if (query.includes("recommendation"))
      return "Try our quiz or explore trending topics for curated course recos 💡";
    if (query.includes("save") || query.includes("bookmark"))
      return "Click the ❤ icon or 'Save for Later' to bookmark your favorites 📌";
    if (query.includes("dashboard"))
      return "Your Dashboard is like your coffee tray—everything you need in one place ☕📋";
    if (query.includes("help") || query.includes("how to"))
      return "Need help? Ask me about platforms, quizzes, topics, or how to start! 🧠";
    if (query.includes("course") && query.includes("free"))
      return "Many courses are free! Try Infosys Springboard and some Udemy options 🆓";
    if (query.includes("data science"))
      return "Data Science? 'IBM Data Science Professional Cert' on Coursera is awesome 📊";
    if (query.includes("machine learning"))
      return "'Intro to Machine Learning' by Andrew Ng is a fan favorite 🤖📈";
    if (query.includes("cloud"))
      return "For cloud skills, try 'AWS Fundamentals' on edX ☁🧠";

    const fallbacks = [
      "Hmm, I'm not sure I understood that. Try asking about Python, AI, or Web Dev 😊",
      "Could you rephrase that? I'm learning new things every day too! 📚",
      "Try the Quiz section to discover your perfect course match 🎯",
      "That's interesting! Use keywords like 'AI', 'Java', or 'Design' to get started 🔍",
      "You might be looking for something on Coursera, edX, or Springboard ☕",
      "Brew another question! I’m here to help ☕💬",
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
            CourseBot 🤎
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
                <i>Typing a fresh reply... ☕</i>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Ask me anything about courses, skills, or tech..."
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
