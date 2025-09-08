import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

function ServiceArea() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="service-area-page">
      {/* Banner Section */}
      <section className="bannerSection position-relative">
        <div className="sub-banner">
          <div className="container h-100">
            <div className="banner-sub-word">
              <h1>{t('nav.services')}</h1>
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
                  {t('services.filipino')}
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
                  Profile
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
                  Contact
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
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
              <div 
                className={`tab-pane fade ${activeTab === 'profile' ? 'show active' : ''}`}
                id="profile" 
                role="tabpanel" 
                aria-labelledby="profile-tab"
              >
                <p>Profile content goes here...</p>
              </div>
              <div 
                className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''}`}
                id="contact" 
                role="tabpanel" 
                aria-labelledby="contact-tab"
              >
                <p>Contact content goes here...</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ServiceArea;