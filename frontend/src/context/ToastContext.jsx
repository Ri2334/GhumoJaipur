import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const show = (message, opts = {}) => {
    const id = Date.now().toString(36);
    setToasts(t => [...t, { id, message }]);
    setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), opts.duration || 3500);
  };
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-6 right-6 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="bg-black text-white px-4 py-2 rounded shadow">{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
