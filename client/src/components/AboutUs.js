import React from 'react';
import './AboutUs.css';
import { useTranslation } from '../hooks/useTranslation';

function AboutUs() {
  const { t } = useTranslation();
  return (
    <div className="about-us-page">
      {/* Banner Section */}
      <section className="bannerSection position-relative">
        <div className="sub-banner">
          <div className="container h-100">
            <div className="banner-sub-word">
              <h1>{t('about.title')}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="content" tabIndex="-1">
        <div className="container">
          {/* Introduction Section */}
          <section className="section-padding">
            <div className="py-4 text-center text-primary border-line">
              <h2>Dummy Title</h2>
              <p className="py-2">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
                Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, 
                imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. 
                Cras dapibus. Vivamus elementum semper nisi.
              </p>
            </div>
          </section>

          {/* Our Services Section */}
          <section>
            <div className="h2 py-4 text-center text-primary border-line">{t('about.services.title')}</div>
            <div className="text-center py-5">
              專業代辦海外印傭、菲傭，以及本地外傭聘請服務。此外，我們提供亦代辦外傭相關之申請手續、僱傭保險以及外傭體檢等一站式服務。
            </div>
            <div className="text-center">
              <a href="" className="hoverEffect">
                <div className="btn btn-primary rounded-pill BackBtn">服務範圍</div>
              </a>
            </div>
          </section>

          {/* Our Vision Section */}
          <section className="section-padding">
            <div className="h2 py-4 text-center text-primary border-line">我們的願景</div>
            <div className="row gx-md-5 gy-4 my-7">
              <div className="col-12 col-md-6">
                <div className="full-image">
                  <img src="/image/checking-data-laptop.jpg" alt="" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div>
                  <div className="word-1">Dummy Content</div>
                  <div>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                    Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                    Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
                    Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, 
                    imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. 
                    Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, 
                    porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, 
                    feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. 
                    Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. 
                    Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem 
                    neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec 
                    odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. 
                    Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. 
                    Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="section-padding bg-secondary-light">
            <div className="row justify-content-center px-5 align-items-center">
              <div className="col-12 col-md-6">
                <div className="text-center">
                  <div className="h3">立即聯絡我們</div>
                  <div className="my-4">
                    讓我們了解你的需要，更快、更精準 ，助你選出合適傭工
                  </div>
                  <div>
                    <a href="" className="hoverEffect">
                      <div className="btn btn-secondary rounded-pill BackBtn yellow">更多僱主需知</div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                  Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                  Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
                  Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, 
                  imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. 
                  Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, 
                  porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, 
                  feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. 
                  Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhonc
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AboutUs;