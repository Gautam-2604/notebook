'use client'
import { useApp } from "@/contexts/Appcontext";
import { useState } from "react";

export function ChatInterface() {
  const { state, addMessage } = useApp();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: state.messages.length + 1,
      text: inputText,
      sender: 'user' as const
    };

    addMessage(userMessage);
    setInputText('');

    setTimeout(() => {
      const response = {
        id: state.messages.length + 2,
        text: `I received your message: "${inputText}". This is a UI-only demo, so I can't actually process queries yet!`,
        sender: 'system' as const
      };
      addMessage(response);
    }, 1000);
  };

  if (!state.schema) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">SQL Chat</h2>
        <div className="text-gray-600 text-center py-8">
          <div className="text-3xl sm:text-4xl mb-4">🔌</div>
          <p className="text-sm sm:text-base">Please connect to a database and load schema first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border h-full flex flex-col">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">SQL Chat</h2>
      
      <div className="flex-1 bg-gray-50 rounded-md p-3 sm:p-4 mb-4 min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[500px] overflow-y-auto">
        <div className="space-y-3">
          {state.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about your data..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base flex-shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
}