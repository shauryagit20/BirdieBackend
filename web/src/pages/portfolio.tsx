import Chatbot from '../components/chatbot';
import { LeftContainer } from '../components/greyleftcontainer';
import { RightContainer } from '../components/greyrightcontainer';
import PortfolioTemplate from '../components/portfolio-template';

function Portfolio() {
  const baseApiUrl = "https://7e9b-66-180-180-14.ngrok-free.app";

  return (
    <div className="flex min-h-screen  bg-[#F2F5FA] from-gray-50 to-gray-100">
      <div className="flex space-x-6 p-8 w-full justify-center items-start">
        <LeftContainer>
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-6 group">
              {/* Logo Box with Enhanced Design */}
              <div className="relative transform transition-transform duration-300 hover:scale-110">
                <div className="bg-[#5EACB3] w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                  {/* Animated Design Lines */}
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-14 h-0.5 bg-white/80 transform rotate-45 transition-all duration-300 group-hover:w-16"></div>
                    <div className="w-14 h-0.5 bg-white/80 transform -rotate-45 transition-all duration-300 group-hover:w-16"></div>
                  </div>
                </div>
                {/* Decorative Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#5EACB3]/20 to-[#4E9BA2]/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Title with Enhanced Typography */}
              <h1 className="text-6xl font-bold text-gray-900 tracking-tight transition-all duration-300 group-hover:text-gray-800">
                Bird
                <span className="text-[#5EACB3]">$</span>
                tock
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-center text-gray-600 mt-4 text-lg font-medium">
              Manage your investments wisely
            </p>
          </div>

          {/* Portfolio Template with Enhanced Wrapper */}
          <div className="transition-all duration-300 hover:shadow-lg rounded-2xl bg-white">
            <PortfolioTemplate apiUrl={baseApiUrl}/>
          </div>
        </LeftContainer>

        {/* Right Container */}
        <RightContainer>
          <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg">
            <Chatbot apiUrl={baseApiUrl} />
          </div>
        </RightContainer>
      </div>
    </div>
  );
}

export default Portfolio;