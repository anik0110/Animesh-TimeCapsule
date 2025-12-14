import { useState } from 'react';

const CapsuleCard = ({ capsule, onImageClick, onDelete }) => {
  const [imgError, setImgError] = useState(false);
  const isLocked = new Date(capsule.unlockDate) > new Date();

  const handleImgError = () => {
    setImgError(true);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition group relative overflow-hidden flex flex-col">
      
      
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(capsule._id);
          }}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-slate-100 backdrop-blur-sm"
          title="Delete Capsule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      )}

      
      <div className="flex justify-between items-start mb-3">
        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          {capsule.theme}
        </span>
        <span className={`text-xs font-bold ${isLocked ? 'text-amber-500' : 'text-green-500'}`}>
          {isLocked ? '🔒 Locked' : '🔓 Ready'}
        </span>
      </div>
      
      
      <h3 className="text-lg font-bold text-slate-900 mb-4 truncate pr-8">{capsule.title}</h3>

      
      <div className="flex-grow flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 relative min-h-[150px]">
        {isLocked ? (
          
          <div className="text-center p-6">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-slate-500 text-sm font-bold">
              Opens in {Math.ceil((new Date(capsule.unlockDate) - new Date()) / (1000 * 60 * 60 * 24))} days
            </p>
            <p className="text-xs text-slate-400 mt-1">{new Date(capsule.unlockDate).toLocaleDateString()}</p>
          </div>
        ) : capsule.fileType === 'image' && capsule.file ? (
          
          <button 
            onClick={() => onImageClick(capsule.file)}
            className="w-full h-full outline-none focus:ring-2 focus:ring-amber-500 rounded-xl cursor-zoom-in"
          >
            <img 
              src={imgError ? "https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found" : capsule.file} 
              alt={capsule.title} 
              onError={handleImgError}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ) : (
          
          <div className="p-6 text-center self-start">
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{capsule.message || "No message provided."}</p>
          </div>
        )}
      </div>

      
      <div className="text-xs text-slate-400 font-medium border-t border-slate-50 pt-3 mt-4 flex justify-between items-center">
        <span>Created: {new Date(capsule.createdAt).toLocaleDateString()}</span>
        {capsule.fileType && !isLocked && (
          <span className="uppercase text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{capsule.fileType}</span>
        )}
      </div>
    </div>
  );
};

export default CapsuleCard;