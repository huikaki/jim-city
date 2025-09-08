import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

function Acknowledge() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="acknowledge-page">
      {/* Banner Section */}
      <section className="bannerSection position-relative">
        <div className="sub-banner">
          <div className="container h-100">
            <div className="banner-sub-word">
              <h1>{t('nav.employer')}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="content" tabIndex="-1">
        <div className="container">
          <section className="section-padding">
            <ul className="nav nav-pills tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  id="home-tab" 
                  type="button" 
                  role="tab" 
                  aria-controls="home" 
                  aria-selected={activeTab === 'home'}
                  onClick={() => handleTabClick('home')}
                >
                  {t('employer.process')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  id="profile-tab" 
                  type="button" 
                  role="tab" 
                  aria-controls="profile" 
                  aria-selected={activeTab === 'profile'}
                  onClick={() => handleTabClick('profile')}
                >
                  {t('employer.contract')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  id="contact-tab" 
                  type="button" 
                  role="tab" 
                  aria-controls="contact" 
                  aria-selected={activeTab === 'contact'}
                  onClick={() => handleTabClick('contact')}
                >
                  {t('employer.insurance')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'legal' ? 'active' : ''}`}
                  id="legal-tab" 
                  type="button" 
                  role="tab" 
                  aria-controls="legal" 
                  aria-selected={activeTab === 'legal'}
                  onClick={() => handleTabClick('legal')}
                >
                  {t('employer.legal')}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'salary' ? 'active' : ''}`}
                  id="salary-tab" 
                  type="button" 
                  role="tab" 
                  aria-controls="salary" 
                  aria-selected={activeTab === 'salary'}
                  onClick={() => handleTabClick('salary')}
                >
                  {t('employer.salary')}
                </button>
              </li>
            </ul>
            
            <div className="tab-content" id="myTabContent">
              <div 
                className={`tab-pane fade ${activeTab === 'home' ? 'show active' : ''}`}
                id="home" 
                role="tabpanel" 
                aria-labelledby="home-tab"
              >
                <p>{t('employer.process.content')}</p>
              </div>
              <div 
                className={`tab-pane fade ${activeTab === 'profile' ? 'show active' : ''}`}
                id="profile" 
                role="tabpanel" 
                aria-labelledby="profile-tab"
              >
                <p>{t('employer.contract.content')}</p>
              </div>
              <div 
                className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''}`}
                id="contact" 
                role="tabpanel" 
                aria-labelledby="contact-tab"
              >
                <p>{t('employer.insurance.content')}</p>
              </div>
              <div 
                className={`tab-pane fade ${activeTab === 'legal' ? 'show active' : ''}`}
                id="legal" 
                role="tabpanel" 
                aria-labelledby="legal-tab"
              >
                <p>{t('employer.legal.content')}</p>
              </div>
              <div 
                className={`tab-pane fade ${activeTab === 'salary' ? 'show active' : ''}`}
                id="salary" 
                role="tabpanel" 
                aria-labelledby="salary-tab"
              >
                <p>{t('employer.salary.content')}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Acknowledge;