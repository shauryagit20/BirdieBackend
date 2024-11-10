import Stressed from '../components/chatbot-stress';
import { LeftContainer } from '../components/greyleftcontainer';
import { RightContainer } from '../components/greyrightcontainer';
import StressPortfolioTemplate from '../components/stress-portfolio-template';

function Portfolio() {
  const baseApiUrl = "https://7e9b-66-180-180-14.ngrok-free.app";

  return (
    <div className="flex min-h-screen  bg-[#F2F5FA] from-gray-50 to-gray-100">
      <div className="flex space-x-6 p-8 w-full justify-center items-start mt-8">
        <LeftContainer>
          {/* Header Section */}
          <div className="mb-0">
            <div className="flex items-center justify-center space-x-6 group">
              {/* Logo Box with Enhanced Design */}
              <div className="relative transform transition-transform duration-300 hover:scale-110">
                <div className="bg-[#B62121] w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                  {/* Animated Design Lines */}
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-14 h-0.5 bg-white/80 transform rotate-45 transition-all duration-300 group-hover:w-16"></div>
                    <div className="w-14 h-0.5 bg-white/80 transform -rotate-45 transition-all duration-300 group-hover:w-16"></div>
                  </div>
                </div>
                {/* Decorative Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Title with Enhanced Typography */}
              <h1 className="text-6xl font-bold text-gray-900 tracking-tight transition-all duration-300 group-hover:text-gray-800">
                Bird
                <span className="text-[#B62121]">$</span>
                tock
              </h1>
            </div>

            {/* Subtle Subtitle or Description */}
            <p className="text-center text-gray-600 mt-4 text-lg font-medium">
              Monitor your portfolio performance
            </p>
          </div>

          {/* Portfolio Template with Enhanced Wrapper */}
          <div className="transition-all duration-300 hover:shadow-lg rounded-2xl">
            <StressPortfolioTemplate apiUrl={baseApiUrl}/>
          </div>
        </LeftContainer>

        {/* Right Container with Enhanced Spacing */}
        <RightContainer>
          <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg">
            <Stressed apiUrl={baseApiUrl} />
          </div>
        </RightContainer>
      </div>
    </div>
  );
}

export default Portfolio;