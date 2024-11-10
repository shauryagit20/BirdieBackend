import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import axios from 'axios';

interface PortfolioTemplateProps {
  apiUrl: string;
}

const PortfolioTemplate: React.FC<PortfolioTemplateProps> = ({ apiUrl }) => {
  const [cardText, setCardText] = useState<string>("Please note that the predictions provided by this model are based on historical data and complex algorithms. While we strive to provide the most accurate forecasts possible, it is important to understand that these predictions are not guaranteed. The nature of financial markets, and similar dynamic systems, is highly volatile and unpredictable. As such, the outcomes suggested by the model should not be considered as definitive or absolute conclusions. They are merely estimates that reflect our current understanding of the scenarios in question. Users are strongly encouraged to exercise caution, perform their own research, and seek professional advice when making any decisions based on this information. Remember, no model is infallible, and there is always inherent risk in any action taken based on predictions or projections. Use this tool at your own discretion, and always be prepared for unexpected changes or outcomes.");

  const [newsLinks, setNewsLinks] = useState([
    { title: 'Stock Market Hits New Highs', url: '#', icon: '📈' },
    { title: 'Tech Stocks Surge Amid Innovation', url: '#', icon: '💻' },
    { title: 'Global Economy Recovers Steadily', url: '#', icon: '🌍' },
    { title: 'New Investment Strategies in 2024', url: '#', icon: '💡' },
    { title: 'How to Maximize Portfolio Growth', url: '#', icon: '📊' },
    { title: 'AI Disruption in Financial Markets', url: '#', icon: '🤖' },
    { title: 'Cryptocurrency Market Volatility', url: '#', icon: '💰' },
    { title: 'Interest Rates and Market Stability', url: '#', icon: '📉' },
    { title: 'The Rise of Green Investments', url: '#', icon: '🌱' },
    { title: 'Predictions for the Next Bull Market', url: '#', icon: '🐂' },
  ]);

  const [simulationData, setSimulationData] = useState<string>('');
  const [runQuery, setQuery] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/fetchScenarioNewsArticle`, {
          scenario: simulationData,
        });
        const data = await response.data;
        console.log(data.response);
      // Assuming data.response is an object where you need to iterate through its entries
      const updatedNewsLinks = Object.entries(data.response).map(([key, newsItem], index) => ({
        title: key,  // Safely access title or provide a default empty string
        url: String(newsItem) || '#',   // Safely access url or provide a default '#'
        icon: newsLinks[index]?.icon || '📈', // Keep the icon from the original state, or fallback to '📈'
      }));
      
      setNewsLinks(updatedNewsLinks); // Update the state with the new news data
        
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (apiUrl) {
      fetchNews();
    }
  }, [runQuery]);

  const handleRunSimulation = async () => {
    try {
      setSimulationData('');
      const response = await axios.post(`${apiUrl}/api/stress_test_chatbot`, {
        sentence: simulationData,
      });
      console.log('Simulation response:', response.data);
      alert('Simulation is running...');
      const simulationResult = response.data.stocks.stocks.map((stock: any) => {
        return `Stock Symbol: ${stock.symbol}\n` +
               `Predicted Market Price: $${stock.predicted_market_price.toFixed(2)}\n` +
               `Predicted Loss or Profit: $${stock.predicted_loss_or_profit.toFixed(2)}\n` +
               `Predicted Value at Risk: $${stock.predicted_value_at_risk.toFixed(2)}\n` +
               `Predicted Risk Score: ${stock.predicted_risk_score.toFixed(2)}\n`;
      }).join('\n');
  
      const assumptions = response.data.stocks.Assumptions;
  
      const formattedDataAssume = `Assumptions: ${assumptions}`
    
      const formattedDataSim = `Simulation Results: ${simulationResult}`;

      const formattedData = `${formattedDataAssume}\n\n${formattedDataSim}`;
    
      // Update the card text state with the formatted data
      setCardText(formattedData);
      setQuery(!runQuery);
  
      console.log(formattedData);
    } catch (error) {
      console.error('Error running simulation:', error);
      alert('Failed to run simulation.');
    }
  };

  return (
    <div className="p-8 w-full h-full">
      <div className="grid grid-cols-2 gap-8 w-full">
        {/* Left card with important information */}
        <Card className="relative p-8 h-[700px] flex flex-col bg-[#B62121] rounded-2xl overflow-hidden shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-16 translate-y-16"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <h1 className="text-3xl font-bold text-white mb-6">Our Predictions</h1>
            <div className="flex-grow overflow-y-auto pr-4 text-white/90 leading-relaxed">
              {cardText}
            </div>
            <p className="text-xl text-white/90 mt-6 font-medium">
              Your portfolio overview and investment insights
            </p>
          </div>
        </Card>

        {/* Right column cards */}
        <div className="space-y-8">
          {/* News card */}
          <Card className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Latest News</h3>
            <ul className="space-y-4 overflow-y-auto max-h-[280px] pr-4">
              {newsLinks.map((news, index) => (
                <li key={index} className="group flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <span className="mr-3 text-2xl group-hover:scale-110 transition-transform duration-200">
                    {news.icon}
                  </span>
                  <a href={news.url} className="text-[#B62121] hover:text-[#B62121] font-medium transition-colors duration-200">
                    {news.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          {/* Simulation card */}
          <Card className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Simulation Console</h3>
            <div className="space-y-6">
              <div className="relative">
                <Input
                  className="min-h-24 border border-gray-200 bg-gray-50 p-4 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#B62121] focus:border-transparent transition-all duration-200"
                  placeholder="Describe your simulation scenario here..."
                  value={simulationData}
                  onChange={(e) => setSimulationData(e.target.value)}
                />
              </div>
              <button
                onClick={handleRunSimulation}
                className="w-full py-4 bg-[#B62121] text-white rounded-xl font-semibold hover:bg-[#B62121] transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Run Simulation
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTemplate;
