import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CapsuleCard from '../components/CapsuleCard';

const Themes = () => {
  const [capsules, setCapsules] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('All');
  const navigate = useNavigate();

  
  const themes = [
    { name: 'All', color: 'bg-gray-800 text-white', icon: '♾️' },
    { name: 'Childhood', color: 'bg-blue-100 text-blue-600', icon: '🧸' },
    { name: 'Love', color: 'bg-pink-100 text-pink-600', icon: '❤️' },
    { name: 'College Years', color: 'bg-purple-100 text-purple-600', icon: '🎓' },
    { name: 'Family History', color: 'bg-amber-100 text-amber-600', icon: '🌳' },
    { name: 'General', color: 'bg-gray-100 text-gray-600', icon: '📁' },
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/capsules')
      .then(res => setCapsules(res.data))
      .catch(err => console.error(err));
  }, []);

  
  const filteredCapsules = selectedTheme === 'All' 
    ? capsules 
    : capsules.filter(c => c.theme === selectedTheme);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-900">
            &larr; Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Memory Themes</h1>
        </div>

        
        <div className="flex flex-wrap gap-4 mb-10">
          {themes.map(t => (
            <button
              key={t.name}
              onClick={() => setSelectedTheme(t.name)}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                selectedTheme === t.name ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'hover:bg-gray-50'
              } ${t.color}`}
            >
              <span>{t.icon}</span>
              {t.name}
            </button>
          ))}
        </div>

        
        <div className="bg-gray-50 p-8 rounded-3xl min-h-[400px]">
          <h2 className="text-xl font-bold mb-6 text-gray-500">
            {selectedTheme} Collection <span className="text-sm font-normal">({filteredCapsules.length})</span>
          </h2>
          
          {filteredCapsules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCapsules.map(cap => (
                <CapsuleCard key={cap._id} capsule={cap} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <span className="text-4xl block mb-2">📂</span>
              No memories found in this theme.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Themes;