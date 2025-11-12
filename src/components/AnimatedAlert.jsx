import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: -12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: 'circOut' } },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18, ease: 'easeIn' } }
};

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-sky-500',
  warning: 'bg-amber-500'
};

export default function AnimatedAlert({ alerts, onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {alerts.map((a) => (
          <motion.div
            key={a.id}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`max-w-sm w-full text-white rounded-lg shadow-lg overflow-hidden ${colors[a.type] || colors.info}`}
            layout
          >
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="flex-1">
                <div className="font-semibold">{a.title || (a.type === 'success' ? 'Hecho' : a.type === 'error' ? 'Error' : 'Info')}</div>
                <div className="text-sm mt-1">{a.message}</div>
              </div>
              <button onClick={() => onClose(a.id)} className="text-white/90 font-bold">✕</button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
