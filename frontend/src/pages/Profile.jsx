import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/auth/me')
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  if (!user) return <div className="text-center mt-20">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        <button onClick={() => navigate('/dashboard')} className="mb-6 text-indigo-600 hover:underline">
          &larr; Back to Dashboard
        </button>
        
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 h-32"></div>
          <div className="px-8 pb-8">
            
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-md">
                <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.username}</h1>
            <p className="text-gray-500 mb-8">{user.email}</p>

            <div className="border-t pt-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="block text-xs font-bold text-gray-400 uppercase">User ID</span>
                  <span className="font-mono text-sm text-gray-600">{user._id}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Member Since</span>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()} 
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;