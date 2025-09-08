import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

function ContactUs() {
  const { t } = useTranslation();
  return (
    <div className="contact-us-page">
      {/* Banner Section */}
      <section className="bannerSection position-relative">
        <div className="sub-banner">
          <div className="container h-100">
            <div className="banner-sub-word">
              <h1>{t('contact.title')}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="content" tabIndex="-1">
        <section className="section-padding">
          <div className="container">
            <h1 className="text-center text-primary">{t('contact.title')}</h1>
            <div className="row align-items-center pt-4">
              <div className="col-12 col-md-6">
                <div className="map">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.067821730789!2d114.20498807529509!3d22.388800529623023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340407439d1d2603%3A0x27cafbbb1a2e7402!2z5aSi5oOz6Jmf5YOx5YKt5bCI6ZaA5bqXSklNIENJVFkgRU1QTE9ZTUVOVCBBR0VOQ1k!5e0!3m2!1szh-TW!2shk!4v1741162087697!5m2!1szh-TW!2shk" 
                    width="600" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-4">
                  <h3>{t('contact.title')}</h3>
                  <div>{t('contact.email')}</div>
                  <div>{t('contact.address')}</div>
                  <div>{t('contact.phone')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContactUs;