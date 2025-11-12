import React from 'react';

export default function Label({ text, required = false, className = '' }) {
  return (
    <label className={`block font-medium text-sm ${className}`}>
      {text}{required && <span className="text-red-500"> *</span>}
    </label>
  );
}
