import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇭🇰' },
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

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

  return (
    <div className="language-switcher position-relative d-inline-block" ref={dropdownRef}>
      <button
        className="btn btn-outline-secondary btn-sm d-flex align-items-center rounded-pill"
        onClick={() => setIsOpen(!isOpen)}

      >
        <span className="me-2">{currentLang?.flag}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu show position-absolute"
          style={{
            top: '100%',
            right: 0,
            zIndex: 1050,
         
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`dropdown-item  ${currentLanguage === lang.code ? 'active' : ''
                }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="me-2">{lang.flag}</span>
              <span className="me-2">{lang.name}</span>

            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;