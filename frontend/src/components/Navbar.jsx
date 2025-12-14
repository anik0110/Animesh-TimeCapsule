import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#2a2155] border-b border-white/10 py-6">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => handleNavClick('hero')}
        >
          
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-[#2a2155] font-bold text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Time<span className="text-amber-500">Capsule</span>
          </span>
        </div>

        
        <div className="hidden md:flex gap-10 text-sm font-medium tracking-wide text-slate-300">
          {['Hero', 'About', 'Footer'].map((item) => (
            <button 
              key={item}
              onClick={() => handleNavClick(item.toLowerCase())} 
              className="hover:text-amber-400 transition-colors relative group"
            >
              {item === 'Hero' ? 'HOME' : item === 'Footer' ? 'CONTACT' : item.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
            </button>
          ))}
        </div>

        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:block text-slate-400 text-sm">
                Hi, <span className="text-white font-semibold">{user.username}</span>
              </span>
              <Link 
                to="/dashboard"
                
                className="bg-[#3b3270] hover:bg-[#4c4285] text-amber-500 border border-amber-500/30 font-bold px-5 py-2 rounded-lg transition-all shadow-lg hover:shadow-amber-500/10 text-sm"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('auth-section')}
              
              className="bg-amber-500 hover:bg-amber-400 text-[#2a2155] font-bold px-6 py-2 rounded-lg transition-all shadow-lg hover:shadow-amber-500/50 text-sm"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;