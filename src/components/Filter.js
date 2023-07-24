import React from 'react';

const SearchFilter = ({ searchQuery, handleSearchChange }) => {
  return (
    <div>
      Search: <input value={searchQuery} onChange={handleSearchChange} />
    </div>
  );
};

export default SearchFilter;
