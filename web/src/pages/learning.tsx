import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { RightContainer } from '../components/greyrightcontainer';
import Chatbot from '../components/chatbot';
import { useNavigate } from 'react-router-dom';

function Learning() {
  const baseApiUrl: string = "https://cb0f-66-180-180-14.ngrok-free.app";
  const topics: string[] = [
    "Stocks", "Bonds", "Mutual Funds", "ETFs", "Real Estate", 
    "Commodities", "Cryptocurrency", "Options", "Futures",
    "Forex", "Retirement Accounts", "Hedge Funds", "Dividend Investing",
    "Value Investing", "Growth Investing", "Index Funds", 
    "Risk Management", "Financial Analysis", "Portfolio Management", "Tax Planning"
  ];

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleTileClick = (topic: string) => {
    setSelectedTopics((prevSelectedTopics) => {
      if (prevSelectedTopics.includes(topic)) {
        return prevSelectedTopics.filter((t) => t !== topic);
      } else {
        if (prevSelectedTopics.length < 5) {
          return [...prevSelectedTopics, topic];
        }
        return prevSelectedTopics;
      }
    });
  };

  const handleCreateModules = () => {
    // Navigate to /mymodules and pass selectedTopics as state
    navigate('/mymodules', { state: { selectedTopics } });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 max-w-5xl mx-auto px-8 py-16">
        <div className="space-y-10">
          {/* Centered Header Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
              Birdwatcher's Guide to Investment
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please choose up to 5 topics to create your personalized learning path.
            </p>
          </div>

          {/* Topics Grid Container */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 backdrop-blur-sm backdrop-filter">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {topics.map((topic) => (
                <Card
                  key={topic}
                  onClick={() => handleTileClick(topic)}
                  className={`
                    group relative px-6 py-8 rounded-2xl cursor-pointer
                    transition-all duration-300 ease-in-out transform
                    ${selectedTopics.includes(topic)
                      ? 'bg-[#5EACB3] text-white scale-105 shadow-xl'
                      : 'hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200'
                    }
                  `}
                >
                  <div className="text-center">
                    <span className={`
                      text-sm font-semibold
                      ${selectedTopics.includes(topic) ? 'text-white' : 'text-gray-700'}
                    `}>
                      {topic}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleCreateModules}
              className={`
                px-12 py-6 rounded-2xl text-white text-lg font-semibold
                transition-all duration-300 transform
                ${selectedTopics.length > 0
                  ? 'bg-[#5EACB3] hover:bg-[#4E9BA2] hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
              disabled={selectedTopics.length === 0}
            >
              Create Learning Modules
            </Button>
          </div>
        </div>
      </div>

      {/* Right Container */}
      <RightContainer>
        <Chatbot apiUrl={baseApiUrl} />
      </RightContainer>
    </div>
  );
}

export default Learning;