import React, { useState, useRef, useEffect } from 'react';

function MultiSelectDropdown({ 
  options = [], 
  selectedValues = [], 
  onChange, 
  placeholder = "Select options...", 
  searchable = true,
  maxDisplayCount = 2 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionToggle = (option) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter(val => val !== option)
      : [...selectedValues, option];
    
    onChange(newSelectedValues);
  };

  const handleSelectAll = () => {
    onChange(filteredOptions);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length <= maxDisplayCount) {
      return selectedValues.join(', ');
    }
    
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div 
        className={`form-control d-flex justify-content-between align-items-center ${isOpen ? 'border-primary' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', minHeight: '38px' }}
      >
        <span className={selectedValues.length === 0 ? 'text-muted' : ''}>
          {getDisplayText()}
        </span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>

      {isOpen && (
        <div 
          className="dropdown-menu show w-100 mt-1 p-0" 
          style={{ 
            position: 'absolute', 
            zIndex: 1050,
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ced4da',
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-bottom">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Action buttons */}
          {options.length > 0 && (
            <div className="p-2 border-bottom d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm flex-fill"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
              >
                Select All
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm flex-fill"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeselectAll();
                }}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Options list */}
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-muted">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-item d-flex align-items-center ${selectedValues.includes(option) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionToggle(option);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={selectedValues.includes(option)}
                    onChange={() => {}} // Handled by parent onClick
                  />
                  <span>{option}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;