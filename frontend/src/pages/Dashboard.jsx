import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import CapsuleCard from '../components/CapsuleCard';
import CapsuleModal from '../components/CapsuleModal'; 

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  
  const [capsules, setCapsules] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  const [view, setView] = useState('all'); 
  const [activeTab, setActiveTab] = useState('created'); 
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [savedRecipients, setSavedRecipients] = useState([]); 

  
  const [formData, setFormData] = useState({
    title: '', message: '', unlockDate: '', theme: 'general', selectedRecipients: [], file: null
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const features = [
    { title: "New Capsule", icon: "➕", action: () => setView('create'), color: "bg-indigo-100 text-indigo-600" },
    { title: "My Vault", icon: "🔓", action: () => { setView('all'); setActiveTab('created'); }, color: "bg-green-100 text-green-600" },
    { title: "Inbox", icon: "Vk", action: () => { setView('all'); setActiveTab('received'); }, color: "bg-purple-100 text-purple-600" },
    { title: "Themes", icon: "🎨", action: () => navigate('/themes'), color: "bg-pink-100 text-pink-600" }, 
    { title: "Recipients", icon: "👥", action: () => navigate('/recipients'), color: "bg-orange-100 text-orange-600" },
    { title: "Calendar", icon: "📅", action: () => navigate('/events'), color: "bg-blue-100 text-blue-600" },
  ];

  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const config = { headers: { 'x-auth-token': token } };

      try {
        if (view === 'all') {
          let url = `${API_URL}/api/capsules`;
          if (activeTab === 'received') url += '/received';
          const res = await axios.get(url, config);
          setCapsules(res.data);
        }
        
        
        const eventRes = await axios.get(`${API_URL}/api/events`, config);
        setUpcomingEvents(eventRes.data.filter(e => new Date(e.date) >= new Date().setHours(0,0,0,0)).slice(0, 3));
        const recipientRes = await axios.get(`${API_URL}/api/recipients`, config);
        setSavedRecipients(recipientRes.data);

      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [view, activeTab]); 

  const handleDeleteCapsule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this capsule? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/capsules/${id}`, {
        headers: { 'x-auth-token': token }
      });
      
      
      setCapsules(capsules.filter(cap => cap._id !== id));
      alert("Capsule deleted successfully.");
    } catch (err) {
      console.error(err);
      
      const errorMsg = err.response?.data?.msg || "Failed to delete capsule. Check console for details.";
      alert(`Error: ${errorMsg}`);
    }
  };
  
  const toggleRecipient = (recipient) => {
    const isSelected = formData.selectedRecipients.some(r => r.email === recipient.email);
    const updatedList = isSelected 
      ? formData.selectedRecipients.filter(r => r.email !== recipient.email)
      : [...formData.selectedRecipients, { name: recipient.name, email: recipient.email }];
    setFormData({ ...formData, selectedRecipients: updatedList });
  };

  const handleSelectAllRecipients = () => {
    setFormData({ ...formData, selectedRecipients: formData.selectedRecipients.length === savedRecipients.length ? [] : savedRecipients.map(r => ({ name: r.name, email: r.email })) });
  };

  
  const handleAIAssist = async (promptType) => {
    if (!formData.message) return alert("Please write a message first!");
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/capsules/ai-assist`, { promptType, contextText: formData.message }, { headers: { 'x-auth-token': token } });
      if (promptType === 'summary') setFormData(prev => ({ ...prev, title: res.data.result }));
      else if (promptType === 'caption') setFormData(prev => ({ ...prev, message: prev.message + `\n\n(AI Caption: ${res.data.result})` }));
    } catch (e) { alert("AI Service Unavailable"); }
    setAiLoading(false);
  };

  
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedRecipients.length === 0) return alert("Please select at least one recipient.");
    setIsSubmitting(true); 
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'selectedRecipients') data.append('recipients', JSON.stringify(formData[key]));
        else if (key === 'file' && formData[key]) data.append('file', formData[key]);
        else if (key !== 'file') data.append(key, formData[key]);
      });

      await axios.post(`${API_URL}/api/capsules`, data, { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } });
      alert('Capsule Sealed & Emails Sent! 📨');
      setFormData({ title: '', message: '', unlockDate: '', theme: 'general', selectedRecipients: [], file: null });
      setView('all'); setActiveTab('created');
    } catch (err) { alert('Failed to create capsule.'); } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto p-8">
        
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Welcome back, <span className="text-indigo-600">{user?.username}</span></h2>
            <p className="text-slate-500 mt-2">Manage your digital memories and legacy.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/profile')} className="text-sm text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-lg transition">My Profile</button>
            <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">Log Out</button>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {features.map((f, index) => (
            <button key={index} onClick={f.action} className={`${f.color} p-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition shadow-sm border border-transparent hover:border-black/5`}>
              <span className="text-3xl">{f.icon}</span><span className="font-bold whitespace-nowrap text-sm">{f.title}</span>
            </button>
          ))}
        </div>

        
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
            {view === 'create' ? (
              <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">✨ Create New Memory</h3>
                  <button onClick={() => setView('all')} className="text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  
                   <div><label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label><textarea required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" rows="6" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea></div>
                   <div><div className="flex justify-between items-center mb-2"><label className="text-sm font-bold text-slate-700">Title</label><button type="button" disabled={aiLoading} onClick={() => handleAIAssist('summary')} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">{aiLoading ? '✨ Thinking...' : '✨ Auto-Generate'}</button></div><input type="text" required className="w-full p-3 bg-white border border-slate-300 rounded-xl" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
                   <div>
                      <div className="flex justify-between mb-2"><label className="text-sm font-bold text-slate-700">Recipients</label><button type="button" onClick={handleSelectAllRecipients} className="text-xs text-indigo-600 font-bold">{formData.selectedRecipients.length === savedRecipients.length ? 'Deselect All' : 'Select All'}</button></div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                        {savedRecipients.map(r => {
                           const isSelected = formData.selectedRecipients.some(sel => sel.email === r.email);
                           return <div key={r._id} onClick={() => toggleRecipient(r)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition mb-1 ${isSelected ? 'bg-indigo-100 border-indigo-200' : 'hover:bg-gray-100'}`}><div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>{isSelected && <span className="text-white text-[10px]">✓</span>}</div><div><p className="text-sm font-bold text-slate-800">{r.name}</p><p className="text-xs text-slate-500">{r.email}</p></div></div>
                        })}
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                     <div><label className="block text-sm font-bold text-slate-700 mb-2">Unlock Date</label><input type="datetime-local" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.unlockDate} onChange={(e) => setFormData({...formData, unlockDate: e.target.value})} /></div>
                     <div><label className="block text-sm font-bold text-slate-700 mb-2">Theme</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.theme} onChange={(e) => setFormData({...formData, theme: e.target.value})}><option value="general">General</option><option value="birthday">Birthday</option><option value="anniversary">Anniversary</option><option value="love">Love</option></select></div>
                   </div>
                   <input type="file" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                   <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">{isSubmitting ? 'Sending...' : 'Seal Time Capsule 🔒'}</button>
                </form>
              </div>
            ) : (
              
              <>
                <div className="flex gap-6 mb-8 border-b border-gray-100">
                  <button onClick={() => setActiveTab('created')} className={`pb-3 text-sm font-bold transition-all ${activeTab === 'created' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>📤 Sent by Me {activeTab === 'created' ? `(${capsules.length})` : ''}</button>
                  <button onClick={() => setActiveTab('received')} className={`pb-3 text-sm font-bold transition-all ${activeTab === 'received' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-600'}`}>📥 Received {activeTab === 'received' ? `(${capsules.length})` : ''}</button>
                </div>
                {capsules.length === 0 ? (
                  <div className="text-center py-20"><div className="text-4xl mb-4">📭</div><p className="text-slate-400 font-medium">No capsules found.</p>{activeTab === 'created' && <button onClick={() => setView('create')} className="mt-4 text-indigo-600 font-bold hover:underline">Create your first memory</button>}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    {capsules.map(cap => (
                      <CapsuleCard 
                        key={cap._id} 
                        capsule={cap}
                        
                        onDelete={activeTab === 'created' ? () => handleDeleteCapsule(cap._id) : null}
                        onImageClick={() => {
                           if (new Date(cap.unlockDate) > new Date()) alert(`🔒 This capsule is locked until ${new Date(cap.unlockDate).toLocaleDateString()}`);
                           else setSelectedCapsule(cap);
                        }} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-8">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-700 flex items-center gap-2"><span>📅</span> Upcoming</h3><button onClick={() => navigate('/events')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button></div>
            {upcomingEvents.length === 0 ? <div className="text-center py-8 text-slate-400 text-sm">No upcoming events.</div> : (
              <div className="space-y-4">{upcomingEvents.map(evt => (
                  <div key={evt._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"><div className="bg-blue-50 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-blue-600"><span className="text-[10px] font-bold uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span><span className="text-lg font-bold">{new Date(evt.date).getDate()}</span></div><div><h4 className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{evt.title}</h4><p className="text-xs text-slate-400">{Math.ceil((new Date(evt.date) - new Date()) / (1000 * 60 * 60 * 24))} days left</p></div></div>
              ))}</div>
            )}
             <button onClick={() => navigate('/events')} className="w-full mt-6 py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition">Open Calendar</button>
          </div>
        </div>
      </div>
      {selectedCapsule && <CapsuleModal capsule={selectedCapsule} onClose={() => setSelectedCapsule(null)} />}
    </div>
  );
};

export default Dashboard;