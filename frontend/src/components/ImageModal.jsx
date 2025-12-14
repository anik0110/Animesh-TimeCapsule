import { useEffect } from 'react';

const ImageModal = ({ src, alt, onClose }) => {
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={onClose} 
    >
      <div className="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-none">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 pointer-events-auto transition-colors backdrop-blur-md z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        
        <img 
          src={src} 
          alt={alt || "Enlarged view"} 
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl pointer-events-auto select-none animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
};

export default ImageModal;