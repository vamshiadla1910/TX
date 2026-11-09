import React, { useState } from "react";
import { MessageSquare, Send, UserCheck } from "lucide-react";

export default function AIAssistantTab({ userName = "Learner" }) {
  const [messages, setMessages] = useState([
    {
      sender: "instructor",
      text: `Hello ${userName}! I'm your Pathwing Course Instructor. Feel free to ask me anything about your course concepts, code debugging, or architectural patterns.`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText, time: "Just now" }]);
    setInput("");

    setTimeout(() => {
      let reply = "I'm analyzing your question. Remember to review the syllabus notes and test your code in the sandbox.";
      const query = userText.toLowerCase();
      if (query.includes("react")) {
        reply = "React is a component-driven UI library. Focus on state management, hooks (useState, useEffect, useMemo), and clean separation of concerns.";
      } else if (query.includes("python")) {
        reply = "Python's strength is readability and a robust ecosystem. For web apps, Django and FastAPI offer stellar developer experience and security.";
      } else if (query.includes("docker") || query.includes("cloud")) {
        reply = "Docker packages code and dependencies into portable containers. For cloud production, focus on multi-stage builds and automated CI/CD pipelines.";
      }
      setMessages((prev) => [...prev, { sender: "instructor", text: reply, time: "Just now" }]);
    }, 600);
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-header-card">
        <div className="ai-assistant-header-top">
          <MessageSquare size={24} color="#2563eb" />
          <h2 className="ai-assistant-header-title">Chat Instructor</h2>
        </div>
        <p className="ai-assistant-header-desc">
          Direct guidance, code debugging help, and curriculum clarifications from your course instructor.
        </p>
      </div>

      <div className="ai-chat-card">
        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`ai-msg-bubble ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="ai-chat-form">
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Ask your instructor a question about your lessons..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="ai-chat-submit">
            <Send size={15} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
