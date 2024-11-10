import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card'; // Importing Card from ShadCN
import * as d3 from 'd3';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface PortfolioTemplateProps {
  apiUrl: string;
}

const PortfolioTemplate: React.FC<PortfolioTemplateProps> = ({ apiUrl }) => {
  const [stockOptions, setStockOptions] = useState<string[]>([]);
  const [buyingPrice, setBuyingPrice] = useState<string>("0");
  const [currPrice, setCurrPrice] = useState<string>("0");
  const [outcome, setOutcome] = useState<string>('0');
  const [quantity, setQuantity] = useState<string>("0");
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [chartData, setChartData] = useState<{ x: string; y: number }[]>([]);

  useEffect(() => {
    const fetchStockOptions = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/fetchPortfolioSymbols`);
        const data = await response.json();
        setStockOptions(data);
        if (data.length > 0) {
          setSelectedStock(data[0]);
        }
      } catch (error) {
        console.error("Error fetching stock options:", error);
      }
    };

    fetchStockOptions();
  }, []);

  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/fetchPortfolioResults`, {
          symbol: selectedStock
        });
        const data = await response.data;
        setBuyingPrice(data.buying_price);
        setCurrPrice(data.current_price);
        setOutcome(data.profit_loss);
        setQuantity(data.quantity);
      } catch (error) {
        console.error("Error fetching stock info:", error);
      }
    };

    if (selectedStock) {
      fetchStockInfo();
    }
  }, [selectedStock]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/generateHistoricalGraph`, {
          symbol: selectedStock,
        });
        const data = await response.data;
        console.log(data.forecast_data);
        setChartData(data.forecast_data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (selectedStock) {
      fetchChartData();
    }
  }, [selectedStock]);

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/fetchNews`, {
          symbol: selectedStock,
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

    if (selectedStock) {
      fetchNews();
    }
  }, [selectedStock, apiUrl]);


    return (
      <div className="p-12 w-full bg-[#F2F5FA]">
        <div className="grid grid-cols-2 gap-6 w-full max-h-[400px]">
          <Card className="relative p-12 h-5/6 flex flex-col justify-between bg-[#5EACB3] rounded-lg overflow-hidden">
            <Select onValueChange={setSelectedStock} value={selectedStock}>
              <SelectTrigger className="flex items-center space-x-2 text-5xl font-semibold text-center text-white p-2 z-20 relative border-0 focus:ring-0 focus:outline-none">
                <SelectValue>{selectedStock}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white text-black z-20 relative border-0 shadow-lg">
                {stockOptions.map((stock) => (
                  <SelectItem key={stock} value={stock}>
                    {stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
  
            <div className="mt-4 text-white">
              <p>
                <strong>Buying Price: </strong>${buyingPrice}
              </p>
              <p>
                <strong>Current Price: </strong>${currPrice}
              </p>
              <p>
                <strong>Outcome: </strong>
                {outcome}
              </p>
              <p>
                <strong>Quantity: </strong>
                {quantity}
              </p>
            </div>
  
            <p className="text-xl text-white">
              An overview of your portfolio and investments.
            </p>
  
            <div className="absolute inset-0 flex justify-start items-start">
              <div className="w-24 h-24 rounded-full bg-white opacity-20 relative z-10" />
              <div className="w-32 h-32 rounded-full bg-white opacity-10 absolute top-8 left-8 z-0" />
            </div>
          </Card>
  
          <Card className="relative p-8 flex flex-col justify-between h-5/6 bg-white text-black rounded-lg overflow-y-auto max-h-400">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Latest News</h3>
            <ul className="space-y-4 overflow-y-auto max-h-[280px] pr-4">
              {newsLinks.map((news, index) => (
                <li key={index} className="group flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <span className="mr-3 text-2xl group-hover:scale-110 transition-transform duration-200">
                    {news.icon}
                  </span>
                  <a href={news.url} className="text-[#5EACB3] hover:text-[#5EACB3] font-medium transition-colors duration-200">
                    {news.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
  
        <Card className="relative p-8 flex flex-col justify-between h-1/2 rounded-lg overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
          <D3LineChart data={chartData} />
        </Card>
      </div>
  );
};

const D3LineChart: React.FC<{ data: { x: string; y: number }[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = svg.node()?.clientWidth || 0;
      const height = svg.node()?.clientHeight || 0;

      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      svg.selectAll("*").remove();

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .domain(data.map(d => d.x))
        .range([0, innerWidth])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.y) || 0, d3.max(data, d => d.y) || 0])
        .nice() // Automatically adjust the domain to "nice" values
        .range([innerHeight, 0]);

      const line = d3
        .line<{ x: string; y: number }>()
        .x(d => x(d.x) || 0)
        .y(d => y(d.y));

      g.append('path')
        .data([data])
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

      g.append('g').call(d3.axisLeft(y));
    }
  }, [data]);

  return <svg ref={svgRef} width="100%" height="300px"></svg>;
};

export default PortfolioTemplate;
