import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom'; 

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/events`, {
          headers: { 'x-auth-token': token }
        });
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/events`, {
        title: newEventTitle,
        date: selectedDate
      }, { headers: { 'x-auth-token': token } });

      setEvents([...events, res.data]);
      setNewEventTitle('');
    } catch (err) {
      alert("Failed to save event");
    }
  };

  
  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/events/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setEvents(events.filter(evt => evt._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const eventsForSelectedDate = events.filter(evt => 
    new Date(evt.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      
      
      <div className="py-12 px-6 max-w-5xl mx-auto">
        
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-8 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Calendar 📅</h1>
          <p className="text-slate-500">Track important dates and future unlock moments.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate}
              className="w-full border-none font-sans rounded-xl p-2"
              tileClassName={({ date }) => {
                if (events.find(x => new Date(x.date).toDateString() === date.toDateString())) {
                  return 'bg-amber-100 text-amber-600 font-bold rounded-lg';
                }
              }}
            />
          </div>

          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <p className="text-sm text-slate-400 mb-6 uppercase tracking-wider font-bold">Selected Date</p>

            
            <div className="space-y-3 mb-8 min-h-[150px] flex-grow">
              {eventsForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                  No events scheduled
                </div>
              ) : (
                eventsForSelectedDate.map(evt => (
                  <div key={evt._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group">
                    <span className="font-medium text-slate-700">{evt.title}</span>
                    <button 
                      onClick={() => handleDeleteEvent(evt._id)}
                      className="text-slate-400 hover:text-red-500 transition px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            
            <form onSubmit={handleAddEvent} className="mt-auto">
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Add New Event</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="e.g., Capsule Unlock Day" 
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  required
                />
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;