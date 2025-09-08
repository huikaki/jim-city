import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '../hooks/useTranslation';

function Home() {
  const { t } = useTranslation();
  return (
    <div className="home-page">
      {/* Banner Section */}
      <section className="bannerSection position-relative">
        <div className="banner-image">
          <img src="/image/hd1080.jpg" alt="" />
        </div>
      </section>

      {/* Main Content */}
      <main id="content" tabIndex="-1">
        <div className="container">
          {/* Services Section */}
          <section className="section-padding">
            <div className="h2 py-4 text-center text-primary border-line">{t('home.services.title')}</div>
            <div className="row gx-md-5 gy-4 my-7">
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a href="" className="hoverEffect">
                <div className="btn btn-primary rounded-pill BackBtn">{t('home.services.button')}</div>
              </a>
            </div>
          </section>

          {/* Process Section */}
          <section className="section-padding">
            <div className="h2 py-4 text-center text-primary border-line">{t('home.process.title')}</div>
            <div className="row gx-md-5 gy-4 my-7">
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="card-wrapper">
                  <div className="title">Dummy Title</div>
                  <div className="content">
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                    <div>
                      <span><FontAwesomeIcon icon="check" style={{ color: '#3dce09' }} /></span>
                      <span>Dummy Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a href="" className="hoverEffect">
                <div className="btn btn-primary rounded-pill BackBtn">{t('home.process.button')}</div>
              </a>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="section-padding">
            <div className="h2 py-4 text-center text-primary border-line">{t('home.why.title')}</div>
            <div className="row gx-md-5 gy-4 my-7">
              <div className="col-12 col-md-6">
                <div className="full-image">
                  <img src="/image/checking-data-laptop.jpg" alt="" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div>
                  <div className="word-1">{t('common.dummy.content')}</div>
                  <div>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
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
                  <div className="h3">{t('home.contact.title')}</div>
                  <div className="my-4">
                    {t('home.contact.subtitle')}
                  </div>
                  <div>
                    <a href="" className="hoverEffect">
                      <div className="btn btn-secondary rounded-pill BackBtn yellow">{t('home.contact.button')}</div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhonc
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;