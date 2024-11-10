// MyModules.js
import { useLocation } from 'react-router-dom';

function MyModules() {
  const location = useLocation();
  const selectedTopics = location.state?.selectedTopics || []; // Fallback to an empty array if state is undefined

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">My Modules</h1>
      <p>Your selected topics:</p>
      <ul>
        {selectedTopics.map((topic: string, index: number) => (
          <li key={index} className="text-lg text-gray-700">
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyModules;
