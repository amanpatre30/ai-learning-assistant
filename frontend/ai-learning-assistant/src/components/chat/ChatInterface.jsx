import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
 const { id: documentId } = useParams();
 const { user } = useAuth();

 const [history, setHistory] = useState([]);
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);
 const [initialLoading, setInitialLoading] = useState(true);

 const messageEndRef = useRef(null);

 const scrollToBottom = () => {
  messageEndRef.current?.scrollIntoView({
   behavior: "smooth",
  });
 };

 // Fetch chat history
 useEffect(() => {
  const fetchChatHistory = async () => {
   try {
    setInitialLoading(true);

    const response = await aiService.getChatHistory(documentId);

    setHistory(response.data);
   } catch (error) {
    console.error("Failed to fetch chat history:", error);
   } finally {
    setInitialLoading(false);
   }
  };

  if (documentId) {
   fetchChatHistory();
  }
 }, [documentId]);

 // Scroll when history changes
 useEffect(() => {
  scrollToBottom();
 }, [history, loading]);

 // Send message
 const handleSendMessage = async (e) => {
  e.preventDefault();

  if (!message.trim()) {
   return;
  }

  const userMessage = {
   role: "user",
   content: message,
   timestamp: new Date(),
  };

  setHistory((prev) => [...prev, userMessage]);
  setMessage("");
  setLoading(true);

  try {
   const response = await aiService.chat(
    documentId,
    userMessage.content
   );

   const assistantMessage = {
    role: "assistant",
    content: response.data.answer,
    timestamp: new Date(),
    relevantChunks: response.data.relevantChunks,
   };

   setHistory((prev) => [...prev, assistantMessage]);
  } catch (error) {
   console.error("Chat error:", error);

   const errorMessage = {
    role: "assistant",
    content:
     "Sorry, I encountered an error. Please try again.",
    timestamp: new Date(),
   };

   setHistory((prev) => [...prev, errorMessage]);
  } finally {
   setLoading(false);
  }
 };

 // Render individual message
 const renderMessage = (msg, index) => {
  const isUser = msg.role === "user";

  return (
   <div
    key={index}
    className={`flex items-start gap-3 my-4 ${isUser ? "justify-end" : "justify-start"
     }`}
   >
    {/* AI Avatar */}
    {!isUser && (
     <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center shrink-0">
      <Sparkles
       className="w-4 h-4 text-white"
       strokeWidth={2}
      />
     </div>
    )}

    {/* Message */}
    <div
     className={`max-w-[75%] px-4 py-3 rounded-2xl ${isUser
      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md"
      : "bg-white border border-slate-200/60 text-slate-700 rounded-bl-md shadow-sm"
      }`}
    >
     {isUser ? (
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
       {msg.content}
      </p>
     ) : (
      <MarkdownRenderer content={msg.content} />
     )}

     <div
      className={`text-xs mt-2 ${isUser
       ? "text-white/70"
       : "text-slate-400"
       }`}
     >
      {msg.timestamp
       ? new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
       })
       : ""}
     </div>
    </div>

    {/* User Avatar */}
    {isUser && (
     <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
      <MessageSquare
       className="w-4 h-4 text-slate-600"
       strokeWidth={2}
      />
     </div>
    )}
   </div>
  );
 };

 return (
  <div className="flex flex-col h-full">

   {/* Chat Messages */}
   <div className="flex-1 overflow-y-auto px-4 py-4">

    {/* Initial Loading */}
    {initialLoading ? (
     <div className="flex flex-col items-center justify-center py-10">
      <Spinner />

      <p className="text-sm text-slate-500 mt-3 font-medium">
       Loading chat history...
      </p>
     </div>
    ) : history.length === 0 ? (
     /* Empty State */
     <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
       <Sparkles
        className="w-7 h-7 text-emerald-600"
        strokeWidth={2}
       />
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-2">
       Start a conversation
      </h3>

      <p className="text-sm text-slate-500">
       Ask me anything about the document!
      </p>
     </div>
    ) : (
     /* Messages */
     history.map(renderMessage)
    )}

    {/* Scroll Reference */}
    <div ref={messageEndRef} />

    {/* AI Loading */}
    {loading && (
     <div className="flex items-center gap-3 my-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center shrink-0">
       <Sparkles
        className="w-4 h-4 text-white"
        strokeWidth={2}
       />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200/60">
       <div className="flex gap-1">
        <span
         className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
         style={{ animationDelay: "0ms" }}
        ></span>

        <span
         className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
         style={{ animationDelay: "150ms" }}
        ></span>

        <span
         className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
         style={{ animationDelay: "300ms" }}
        ></span>
       </div>
      </div>
     </div>
    )}
   </div>

   {/* Input Area */}
   <form
    onSubmit={handleSendMessage}
    className="flex items-center gap-3 p-4 border-t border-slate-200/60 bg-white"
   >
    <input
     type="text"
     value={message}
     onChange={(e) => setMessage(e.target.value)}
     placeholder="Ask something about this document..."
     disabled={loading}
     className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 disabled:opacity-50"
    />

    <button
     type="submit"
     disabled={loading || !message.trim()}
     className="shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
    >
     <Send
      className="w-5 h-5"
      strokeWidth={2}
     />
    </button>
   </form>
  </div>
 );
};

export default ChatInterface;