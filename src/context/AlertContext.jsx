import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AnimatedAlert from '../components/AnimatedAlert';

const AlertContext = createContext(null);

let idCounter = 1;

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback(({ type = 'info', message = '', title = '', timeout = 4500 }) => {
    const id = idCounter++;
    setAlerts((s) => [...s, { id, type, message, title }]);
    if (timeout > 0) {
      setTimeout(() => {
        setAlerts((s) => s.filter(a => a.id !== id));
      }, timeout);
    }
    return id;
  }, []);

  const closeAlert = useCallback((id) => setAlerts((s) => s.filter(a => a.id !== id)), []);

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <AnimatedAlert alerts={alerts} onClose={closeAlert} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}
