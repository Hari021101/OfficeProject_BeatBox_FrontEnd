import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  label = null,
  id,
  name,
  required = false,
  searchable = false,
  clearable = false,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  error = null,
  'aria-label': ariaLabel,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, width: 200, placement: 'bottom' });

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options array into [{ value, label, disabled, icon }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.id,
        label: opt.label !== undefined ? opt.label : opt.name || String(opt.value),
        disabled: Boolean(opt.disabled),
        icon: opt.icon || null
      };
    }
    return {
      value: opt,
      label: String(opt),
      disabled: false,
      icon: null
    };
  });

  // Filter options if searchable is enabled
  const filteredOptions = searchable && searchTerm.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : normalizedOptions;

  // Currently selected option object
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Calculate position when opening
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedHeight = Math.min(filteredOptions.length * 38 + (searchable ? 50 : 0) + 16, 280);
    
    let top = rect.bottom + 6;
    let placement = 'bottom';

    if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
      top = rect.top - estimatedHeight - 6;
      placement = 'top';
    }

    setMenuCoords({
      top: top + window.scrollY,
      left: rect.left + window.scrollX,
      width: Math.max(rect.width, 160),
      placement
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, searchTerm, filteredOptions.length]);

  // Event listeners for window scroll/resize and outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    
    // Create a synthetic event object so standard onChange(e) works out of the box
    const syntheticEvent = {
      target: {
        name: name || id || '',
        value: optionValue
      }
    };

    if (typeof onChange === 'function') {
      onChange(syntheticEvent);
    }

    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    handleSelect('');
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
        e.preventDefault();
        handleSelect(filteredOptions[focusedIndex].value);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    } else if (e.key === 'Tab') {
      if (isOpen) {
        setIsOpen(false);
      }
    }
  };

  // Size specific utility classes
  const sizeClasses = {
    sm: 'bb-select-trigger-sm',
    md: 'bb-select-trigger-md',
    lg: 'bb-select-trigger-lg'
  }[size] || 'bb-select-trigger-md';

  return (
    <div className={`bb-select-container ${className}`} style={style}>
      {label && (
        <label htmlFor={id} className="bb-select-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`bb-select-trigger ${sizeClasses} ${isOpen ? 'is-open' : ''} ${error ? 'is-error' : ''} ${disabled ? 'is-disabled' : ''}`}
      >
        <span className="bb-select-value text-truncate">
          {selectedOption ? (
            <span className="d-flex align-items-center gap-2">
              {selectedOption.icon && <span className="bb-select-icon">{selectedOption.icon}</span>}
              <span>{selectedOption.label}</span>
            </span>
          ) : (
            <span className="bb-select-placeholder">{placeholder}</span>
          )}
        </span>

        <span className="bb-select-arrows d-flex align-items-center gap-1 ms-2">
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              className="bb-select-clear-btn p-1 rounded-circle"
              onClick={handleClear}
              title="Clear selection"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown size={15} className={`bb-select-chevron ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* Floating Menu Portal */}
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            tabIndex={-1}
            role="listbox"
            aria-label={ariaLabel || label || placeholder}
            className={`bb-select-menu ${menuCoords.placement === 'top' ? 'placement-top' : 'placement-bottom'}`}
            style={{
              position: 'absolute',
              top: `${menuCoords.top}px`,
              left: `${menuCoords.left}px`,
              width: `${menuCoords.width}px`,
              zIndex: 10050
            }}
          >
            {searchable && (
              <div className="bb-select-search-wrap">
                <Search size={14} className="bb-select-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="bb-select-search-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="bb-select-search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}

            <div className="bb-select-options-list">
              {filteredOptions.length === 0 ? (
                <div className="bb-select-no-options">No options found</div>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected = String(opt.value) === String(value);
                  const isFocused = index === focusedIndex;

                  return (
                    <div
                      key={String(opt.value) + index}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      className={`bb-select-option ${isSelected ? 'is-selected' : ''} ${isFocused ? 'is-focused' : ''} ${opt.disabled ? 'is-disabled' : ''}`}
                      onClick={() => !opt.disabled && handleSelect(opt.value)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      <span className="d-flex align-items-center gap-2 flex-grow-1 text-truncate">
                        {opt.icon && <span className="bb-select-option-icon">{opt.icon}</span>}
                        <span className="text-truncate">{opt.label}</span>
                      </span>
                      {isSelected && <Check size={14} className="bb-select-check-icon ms-2" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}

      {error && <div className="bb-select-error-msg">{error}</div>}
    </div>
  );
}
