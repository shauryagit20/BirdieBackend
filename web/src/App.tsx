// In your App.js or App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';  // Assuming Home.js is under the 'pages' folder
import Portfolio from './pages/portfolio';  // Assuming Portfolio.js is under the 'pages' folder
import Learning from './pages/learning';
import StressPortfolio from './pages/stressportfolio';
import MyModules from './pages/my-modules';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/stress" element={<StressPortfolio />} />
        <Route path="/mymodules" element={<MyModules />} />
      </Routes>
    </Router>
  );
}

export default App;
