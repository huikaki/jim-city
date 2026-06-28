import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LanguageProvider } from './contexts/LanguageContext';
import { useTranslation } from './hooks/useTranslation';
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './components/Home';
import MaidSearch from './components/MaidSearch';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import MaidApplication from './components/MaidApplication';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import ServiceArea from './components/ServiceArea';
import Acknowledge from './components/Acknowledge';
import Tips from './components/Tips';

// Set up axios defaults
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:3001';

function Header({ isAuthenticated, onLogout }) {
  const location = useLocation();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState({
    services: false,
    employer: false,
    tips: false
  });

  // Function to close mobile navbar when navigation links are clicked
  const closeMobileNavbar = () => {
    const navbarCollapse = document.getElementById('navbarToggler');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      // Try to use Bootstrap's collapse method first
      if (window.bootstrap && window.bootstrap.Collapse) {
        const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
          toggle: false
        });
        bsCollapse.hide();
      } else {
        // Fallback: manually remove the 'show' class
        navbarCollapse.classList.remove('show');
        // Also update the toggler button aria-expanded attribute
        const togglerButton = document.querySelector('[data-bs-target="#navbarToggler"]');
        if (togglerButton) {
          togglerButton.setAttribute('aria-expanded', 'false');
          togglerButton.classList.add('collapsed');
        }
      }
    }
  };

  // Add click outside to close navbar functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbarCollapse = document.getElementById('navbarToggler');
      const togglerButton = document.querySelector('[data-bs-target="#navbarToggler"]');
      
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        // Check if click is outside the navbar and not on the toggler button
        if (!navbarCollapse.contains(event.target) && !togglerButton.contains(event.target)) {
          closeMobileNavbar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (dropdownName) => {
    setDropdownOpen(prev => ({
      ...prev,
      [dropdownName]: true
    }));
  };

  const handleMouseLeave = (dropdownName) => {
    setDropdownOpen(prev => ({
      ...prev,
      [dropdownName]: false
    }));
  };

  return (
    <>
      <a href="#content" className="skipToContent">跳至內容</a>
      <header id="mainHeader" className="main-header">
        <nav className="navbar navbar-expand-xl" id="mainNavbar">
          <div className="container-fluid px-md-5 px-2 align-items-center justify-content-between">
            <div className="mobileheaderdiv d-flex flex-nowrap flex-row justify-content-between">
              <div className="brandlogo">
                <Link className="" to="/">
                  <img src="image/logo.jpg" alt="brand Logo" />
                </Link>
              </div>
              <div className="d-flex flex-row flex-nowrap align-items-center">
                <div className="d-xl-none d-xxl-none px-2 mx-2">
                  <LanguageSwitcher />
                </div>
                <button
                  className="btn navbar-toggler js-menu-toggle collapsed p-0 d-xl-none d-xxl-none"
                  style={{ border: 0, margin: 'auto', fontSize: '1.2rem', width: '30px', height: '30px' }}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarToggler"
                  aria-controls="mainNavbar2"
                  aria-expanded="false"
                  aria-label="選單"
                >
                  <FontAwesomeIcon id="header-navbar-on" icon="bars" />
                </button>
              </div>
            </div>

            <div className="w-100 collapse navbar-collapse justify-content-end" id="navbarToggler">
              <div className="d-flex flex-column my-2 gap-2 align-items-start align-items-xl-end">
                <div className="d-flex flex-row align-items-center justify-content-end d-none d-xl-block d-xxl-block">
          
                 
              
                  {!isAuthenticated && (
                    <>
                      <Link to="/search" className="btn btn-outline-secondary rounded-pill mr-3">{t('nav.search')}</Link>
                      <Link to="/apply" className="btn btn-outline-primary rounded-pill mr-3">{t('nav.apply')}</Link>
                    </>
                  )}
                  {isAuthenticated && (
                    <Link to="/admin" className="btn btn-outline-primary rounded-pill mr-3">{t('nav.admin')}</Link>
                  )}
                  <a href="#" className="btn btn-primary mr-3 text-white">
                    <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                  </a>
                  <LanguageSwitcher />
                </div>

                <ul id="main-header-ul" className="px-3 navbar-nav gap-3 main-meun ms-xl-auto flex-wrap justify-content-end">
                  <div className="py-2 d-flex flex-row align-items-center justify-content-start d-block d-xl-none d-xxl-none">
                    {!isAuthenticated && (
                      <>
                        <Link to="/search" className="btn btn-outline-secondary rounded-pill" onClick={closeMobileNavbar}>{t('nav.search')}</Link>
                        <Link to="/apply" className="btn btn-outline-primary rounded-pill mx-3" onClick={closeMobileNavbar}>{t('nav.apply')}</Link>
                      </>
                    )}
                    {isAuthenticated && (
                      <Link to="/admin" className="btn btn-outline-primary rounded-pill" onClick={closeMobileNavbar}>{t('nav.admin')}</Link>
                    )}
                    <a href="#" className="btn btn-primary mx-3 text-white">
                      <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                    </a>
                  </div>

                  {!isAuthenticated && (
                    <>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${location.pathname === '/aboutUs' ? 'active' : ''}`}
                          to="/aboutUs"
                          onClick={closeMobileNavbar}
                        >
                          {t('nav.about')}
                        </Link>
                      </li>
                      <li 
                        className={`nav-item dropdown ${dropdownOpen.services ? 'show' : ''}`}
                        onMouseEnter={() => handleMouseEnter('services')}
                        onMouseLeave={() => handleMouseLeave('services')}
                      >
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          role="button"
                          aria-expanded={dropdownOpen.services}
                          onClick={(e) => e.preventDefault()}
                        >
                          {t('nav.services')}
                        </a>
                        <div className={`dropdown-menu ${dropdownOpen.services ? 'show' : ''}`}>
                          <Link className="dropdown-item" to="/service-area" onClick={closeMobileNavbar}>{t('services.filipino')}</Link>
                          <Link className="dropdown-item" to="/service-area" onClick={closeMobileNavbar}>{t('services.indonesian')}</Link>
                          <Link className="dropdown-item" to="/service-area" onClick={closeMobileNavbar}>{t('services.thai')}</Link>
                          <Link className="dropdown-item" to="/service-area" onClick={closeMobileNavbar}>{t('services.myanmar')}</Link>
                          <Link className="dropdown-item" to="/service-area" onClick={closeMobileNavbar}>{t('services.srilanka')}</Link>
                        </div>
                      </li>
                      <li 
                        className={`nav-item dropdown ${dropdownOpen.employer ? 'show' : ''}`}
                        onMouseEnter={() => handleMouseEnter('employer')}
                        onMouseLeave={() => handleMouseLeave('employer')}
                      >
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          role="button"
                          aria-expanded={dropdownOpen.employer}
                          onClick={(e) => e.preventDefault()}
                        >
                          {t('nav.employer')}
                        </a>
                        <div className={`dropdown-menu ${dropdownOpen.employer ? 'show' : ''}`}>
                          <Link className="dropdown-item" to="/acknowledge" onClick={closeMobileNavbar}>{t('employer.process')}</Link>
                          <Link className="dropdown-item" to="/acknowledge" onClick={closeMobileNavbar}>{t('employer.contract')}</Link>
                          <Link className="dropdown-item" to="/acknowledge" onClick={closeMobileNavbar}>{t('employer.insurance')}</Link>
                          <Link className="dropdown-item" to="/acknowledge" onClick={closeMobileNavbar}>{t('employer.legal')}</Link>
                          <Link className="dropdown-item" to="/acknowledge" onClick={closeMobileNavbar}>{t('employer.salary')}</Link>
                        </div>
                      </li>
                      <li 
                        className={`nav-item dropdown ${dropdownOpen.tips ? 'show' : ''}`}
                        onMouseEnter={() => handleMouseEnter('tips')}
                        onMouseLeave={() => handleMouseLeave('tips')}
                      >
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          role="button"
                          aria-expanded={dropdownOpen.tips}
                          onClick={(e) => e.preventDefault()}
                        >
                          {t('nav.tips')}
                        </a>
                        <div className={`dropdown-menu ${dropdownOpen.tips ? 'show' : ''}`}>
                          <Link className="dropdown-item" to="/tips" onClick={closeMobileNavbar}>{t('tips.interview')}</Link>
                          <Link className="dropdown-item" to="/tips" onClick={closeMobileNavbar}>{t('tips.training')}</Link>
                          <Link className="dropdown-item" to="/tips" onClick={closeMobileNavbar}>{t('tips.communication')}</Link>
                          <Link className="dropdown-item" to="/tips" onClick={closeMobileNavbar}>{t('tips.culture')}</Link>
                          <Link className="dropdown-item" to="/tips" onClick={closeMobileNavbar}>{t('tips.faq')}</Link>
                        </div>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                          to="/contact"
                          onClick={closeMobileNavbar}
                        >
                          {t('nav.contact')}
                        </Link>
                      </li>
                    </>
                  )}

                  {isAuthenticated && (
                    <>
                      <li className="nav-item">
                        <Link
                          to="/admin"
                          className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                          onClick={closeMobileNavbar}
                        >
                          <i className="bi bi-gear me-1"></i>
                          {t('nav.admin')}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <button
                          onClick={() => {
                            closeMobileNavbar();
                            onLogout();
                          }}
                          className="nav-link btn btn-link text-dark"
                          style={{ border: 'none' }}
                        >
                          <i className="bi bi-box-arrow-right me-1"></i>
                          {t('nav.logout')}
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating Action Button */}
      <div className="bottom-btn">
        <a href="https://wa.me/15555555555" className="no-text-underline hoverEffect2" target="_blank" rel="noopener noreferrer">
          <div className="circle-btn wts">
            <span><FontAwesomeIcon icon={['fab', 'whatsapp']} /></span>
          </div>
        </a>
      </div>
    </>
  );
}

function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer>
      <div className="container">
        <div className="row gx-md-2 w-100 m-auto align-items-center">
          <div className="col-12 col-md-6">
            <div>
              <div className="footer-img">
                <img src="image/logo.jpg" alt="" />
              </div>
              <div className="footer-contact pt-4">
                <a href="">
                  <div>
                    <span><i className="fa-solid fa-envelope"></i></span>
                    <span>{t('footer.email')}</span>
                  </div>
                </a>
                <a href="">
                  <div>
                    <span><i className="fa-solid fa-location-dot"></i></span>
                    <span>{t('footer.address')}</span>
                  </div>
                </a>
                <a href="">
                  <div>
                    <span><i className="fa-solid fa-phone"></i></span>
                    <span>{t('footer.phone')}</span>
                  </div>
                </a>
                <a href="">
                  <div>
                    <span><i className="fa-brands fa-whatsapp"></i></span>
                    <span>{t('footer.whatsapp')}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="row justify-content-center">
              <div className="col-6">
                <div className="text-primary">
                  <h3>{t('footer.sitemap')}</h3>
                  <ul className="no-list-style">
                    <li><Link to="/aboutUs">{t('nav.about')}</Link></li>
                    <li><Link to="/service-area">{t('nav.services')}</Link></li>
                    <li><Link to="/acknowledge">{t('nav.employer')}</Link></li>
                    <li><Link to="/tips">{t('nav.tips')}</Link></li>
                    <li><Link to="/contact">{t('nav.contact')}</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-6">
                <div className="text-primary">
                  <h3>{t('footer.services')}</h3>
                  <ul className="no-list-style">
                    <li><Link to="/service-area">{t('services.filipino')}</Link></li>
                    <li><Link to="/service-area">{t('services.indonesian')}</Link></li>
                    <li><Link to="/service-area">{t('footer.selfBring')}</Link></li>
                    <li><Link to="/service-area">{t('footer.renewal')}</Link></li>
                    <li><Link to="/service-area">{t('footer.otherServices')}</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post('/api/auth/verify');
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/admin" /> : <Home />}
              />
              <Route path="/search" element={<MaidSearch />} />
              <Route path="/apply" element={<MaidApplication />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/service-area" element={<ServiceArea />} />
              <Route path="/acknowledge" element={<Acknowledge />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>

          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;