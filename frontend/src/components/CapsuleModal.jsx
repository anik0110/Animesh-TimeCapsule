import { useState, useEffect } from 'react';
import axios from 'axios';

const CapsuleModal = ({ capsule, onClose }) => {
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState(capsule.comments || []);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/capsules/${capsule._id}/comment`, 
        { text: comment },
        { headers: { 'x-auth-token': token } }
      );
      setCommentsList(res.data);
      setComment('');
    } catch (err) {
      console.error("Failed to post comment");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
        
        
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{capsule.title}</h2>
            <p className="text-sm text-slate-500">From: {capsule.creator?.username || 'You'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        
        <div className="p-6 space-y-6">
          {capsule.file && (
            <div className="rounded-xl overflow-hidden bg-slate-100">
               {capsule.fileType === 'image' && <img src={capsule.file} className="w-full object-contain max-h-[400px]" />}
               {capsule.fileType === 'video' && <video src={capsule.file} controls className="w-full" />}
            </div>
          )}
          
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <p className="text-slate-700 leading-relaxed font-serif text-lg">{capsule.message}</p>
          </div>

          
          <div className="border-t pt-6">
            <h3 className="font-bold text-slate-800 mb-4">💬 Reactions & Comments</h3>
            
            <div className="space-y-4 mb-6 max-h-40 overflow-y-auto">
              {commentsList.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {c.username[0].toUpperCase()}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-r-xl rounded-bl-xl text-sm">
                    <span className="font-bold block text-slate-900 text-xs">{c.username}</span>
                    {c.text}
                  </div>
                </div>
              ))}
              {commentsList.length === 0 && <p className="text-slate-400 text-sm italic">No comments yet. Be the first!</p>}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a heartwarming message..."
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSendComment}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleModal;