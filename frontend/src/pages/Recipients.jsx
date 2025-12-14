import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Recipients = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', relation: 'Friend' });
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipients');
      setContacts(res.data);
    } catch (err) { console.error(err); }
  };

  
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;
    await axios.post('http://localhost:5000/api/recipients', newContact);
    setNewContact({ name: '', email: '', relation: 'Friend' });
    fetchContacts();
  };

  
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/recipients/${id}`);
    fetchContacts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-900">
            &larr; Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Recipients & Loved Ones</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                  <input 
                    className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newContact.name}
                    onChange={e => setNewContact({...newContact, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input 
                    type="email"
                    className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newContact.email}
                    onChange={e => setNewContact({...newContact, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Relation</label>
                  <select 
                    className="w-full p-3 bg-gray-50 rounded-lg border"
                    value={newContact.relation}
                    onChange={e => setNewContact({...newContact, relation: e.target.value})}
                  >
                    <option>Friend</option>
                    <option>Family</option>
                    <option>Spouse</option>
                    <option>Child</option>
                  </select>
                </div>
                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">
                  Save Contact
                </button>
              </form>
            </div>
          </div>

          
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Address Book</h2>
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact._id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border hover:border-indigo-300 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      contact.relation === 'Family' ? 'bg-amber-500' : 
                      contact.relation === 'Spouse' ? 'bg-pink-500' : 'bg-indigo-500'
                    }`}>
                      {contact.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.email} • <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{contact.relation}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(contact._id)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-400">No contacts yet. Add someone!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Recipients;