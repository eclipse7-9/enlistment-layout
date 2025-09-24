import { useState } from 'react';

export function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const valor = e.target.value;
    setQuery(valor);
    onSearch(valor);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar usuarios..."
        className="search-input"
      />
    </div>
  );
}

export default SearchInput;
