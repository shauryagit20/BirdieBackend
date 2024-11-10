import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Birdie from './Images/Birdie.png';
import { Card } from './ui/card';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  apiUrl: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, isUser: true }]);

    try {
      const response = await fetch(`${apiUrl}/api/conversation_chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: input }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const botResponse = typeof data.response === 'object' ? JSON.stringify(data.response) : String(data.response);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, isUser: false },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error: Unable to fetch response from bot', isUser: false },
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const goToHome = () => {
    navigate('/stress');
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center justify-center text-2xl font-semibold">
          Hello, I'm Birdie!
        </div>
        <div className="flex justify-center">
          <button className="clean-image-button" onClick={() => goToHome()}>
            <img src={Birdie} alt="Logo" className="w-35 h-35" />
          </button>
        </div>
      </div>

      <Card className="flex flex-col h-full bg-[#F2F5FA] shadow-lg p-6 rounded-lg" style={{ height: '700px' }}>
        <div className="messages-container flex-1 overflow-y-auto flex flex-col gap-4 mb-4" style={{ maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`bubble ${msg.isUser ? 'bg-[#5EACB3] text-white ml-auto rounded-lg p-2' : 'bg-gray-300 text-black mr-auto rounded-lg p-2'}`}>
              {msg.isUser ? (
                msg.text
              ) : (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              )}
            </div>
          ))}
        </div>

        <div className="input-container flex text-white items-center bg-[#A1E7ED] p-3 rounded-2xl shadow-md mb-6 gap-2" style={{ height: '70px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-3 bg-[#5EACB3] text-white rounded-xl outline-none"
          />
          <button onClick={handleSend} className="p-3 bg-[#5EACB3] text-white rounded-xl hover:bg-[#5EACB3]">
            Enter
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;