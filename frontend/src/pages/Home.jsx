import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Navbar from '../components/Navbar';

const FEATURES = [
  { icon: "🛡️", title: "Bank-Grade Security", desc: "AES-256 encryption ensures your memories are locked tight until the exact moment of delivery." },
  { icon: "🎥", title: "Multimedia Support", desc: "Don't just write. Upload 4K videos, voice notes, and high-res photos to capture the feeling." },
  { icon: "☁️", title: "Forever Storage", desc: "Redundant cloud backups mean your memories survive even if you lose your phone or laptop." },
  { icon: "🚀", title: "Future Delivery", desc: "Schedule messages for next week or 50 years from now. We ensure they arrive on time." },
  { icon: "📍", title: "Location Tagging", desc: "Pin your memories to specific places. Remember exactly where the magic happened." },
  { icon: "👨‍👩‍👧", title: "Legacy Mode", desc: "Assign a trusted contact to inherit your vault, ensuring your story lives on forever." }
];

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  
  const { login, register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const slideTimer = setInterval(() => {
      if (scrollContainer) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollContainer.scrollLeft >= maxScrollLeft - 10) { 
           scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           scrollContainer.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 3000); 

    return () => clearInterval(slideTimer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Authentication failed. Please check your credentials.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Login Error", err);
      alert('Google Login Failed.');
    }
  };

  return (
    
    <div className="font-sans text-[#2a2155] bg-slate-50 selection:bg-amber-200">
      
      <Navbar />

      
      <section id="hero" className="relative min-h-screen flex items-center bg-[#2a2155] overflow-hidden pt-32 pb-12">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 relative z-10 items-center">
          <div className="text-white space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b3270] border border-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Secure Digital Vault
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Send a Message <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                To The Future.
              </span>
            </h1>
            <p className="text-slate-200 text-lg md:text-xl max-w-lg leading-relaxed">
              Store your most precious memories, letters, and videos in a secure time capsule. Set a date, choose a recipient, and let time do the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-4">
                
                <div className="w-12 h-12 rounded-xl bg-[#3b3270] flex items-center justify-center text-2xl border border-white/10 text-amber-500">🔒</div>
                <div>
                  <h3 className="font-bold text-slate-100">Encrypted</h3>
                  <p className="text-sm text-slate-300">AES-256 Security</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3b3270] flex items-center justify-center text-2xl border border-white/10 text-amber-500">📅</div>
                <div>
                  <h3 className="font-bold text-slate-100">Scheduled</h3>
                  <p className="text-sm text-slate-300"> precise unlock dates</p>
                </div>
              </div>
            </div>
          </div>

          
          <div id="auth-section" className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-purple-600"></div>
              <div className="mb-8 text-center">
                
                <h2 className="text-2xl font-bold text-[#2a2155]">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  {isLogin ? 'Access your time capsules.' : 'Start preserving memories today.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Username</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" onChange={e => setFormData({...formData, username: e.target.value})} required />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Password</label>
                  <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                
                
                <button className="w-full bg-[#2a2155] hover:bg-[#3b3270] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4">
                  {isLogin ? 'Login Securely' : 'Create Free Account'}
                </button>
              </form>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-3 bg-white text-slate-400">Or</span></div>
              </div>
              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Login Failed')} useOneTap theme="outline" shape="pill" width="100%" />
              </div>
              <div className="mt-6 text-center text-sm">
                <p className="text-slate-500">
                  {isLogin ? "No account yet?" : "Already a member?"}
                  <button onClick={() => setIsLogin(!isLogin)} className="text-amber-600 font-bold hover:underline ml-2">{isLogin ? 'Sign Up' : 'Log In'}</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#2a2155] mb-4">Why choose TimeCapsule?</h2>
            <div className="w-20 h-1 bg-amber-500 rounded-full mx-auto mb-6"></div>
            <p className="text-slate-500 text-lg">
              Explore the powerful features that keep your digital legacy safe, secure, and ready for the future.
            </p>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
          >
            {FEATURES.map((feature, index) => (
              <div key={index} className="min-w-[85%] md:min-w-[40%] lg:min-w-[30%] snap-center">
                <div className="h-full bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm mb-6 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-[#2a2155]">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-[#2a2155] text-slate-400 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-white text-2xl font-bold mb-4">TimeCapsule</h3>
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">
              Preserving your digital legacy for the next generation. Secure, simple, and timeless.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>support@timecapsule.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;