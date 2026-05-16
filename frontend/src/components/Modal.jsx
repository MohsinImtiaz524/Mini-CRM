import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm p-4">
      <div className="card w-full max-w-[500px] p-6 relative animate-[modalFadeIn_0.3s_ease-out]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-text-main">{title}</h3>
          <button 
            onClick={onClose}
            className="bg-transparent text-xl text-text-subtle p-1 hover:text-text-main transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Modal;
