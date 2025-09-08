import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Example component showing how to use Font Awesome icons
function FontAwesomeExamples() {
  return (
    <div className="container py-4">
      <h2>Font Awesome Icons Examples</h2>
      
      <div className="row g-4">
        <div className="col-md-6">
          <h4>Solid Icons</h4>
          <div className="d-flex flex-wrap gap-3">
            <FontAwesomeIcon icon="home" size="2x" className="text-primary" />
            <FontAwesomeIcon icon="search" size="2x" className="text-secondary" />
            <FontAwesomeIcon icon="user-plus" size="2x" className="text-success" />
            <FontAwesomeIcon icon="cog" size="2x" className="text-info" />
            <FontAwesomeIcon icon="phone" size="2x" className="text-warning" />
            <FontAwesomeIcon icon="envelope" size="2x" className="text-danger" />
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Brand Icons</h4>
          <div className="d-flex flex-wrap gap-3">
            <FontAwesomeIcon icon={['fab', 'facebook-f']} size="2x" className="text-primary" />
            <FontAwesomeIcon icon={['fab', 'twitter']} size="2x" className="text-info" />
            <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" className="text-danger" />
            <FontAwesomeIcon icon={['fab', 'linkedin']} size="2x" className="text-primary" />
            <FontAwesomeIcon icon={['fab', 'whatsapp']} size="2x" className="text-success" />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <h4>Icon Sizes</h4>
          <div className="d-flex align-items-center gap-3">
            <FontAwesomeIcon icon="star" size="xs" />
            <FontAwesomeIcon icon="star" size="sm" />
            <FontAwesomeIcon icon="star" size="lg" />
            <FontAwesomeIcon icon="star" size="xl" />
            <FontAwesomeIcon icon="star" size="2x" />
            <FontAwesomeIcon icon="star" size="3x" />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <h4>Spinning Icons</h4>
          <div className="d-flex gap-3">
            <FontAwesomeIcon icon="spinner" spin size="2x" className="text-primary" />
            <FontAwesomeIcon icon="cog" spin size="2x" className="text-secondary" />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <h4>Usage in Buttons</h4>
          <div className="d-flex gap-2">
            <button className="btn btn-primary">
              <FontAwesomeIcon icon="download" className="me-2" />
              Download
            </button>
            <button className="btn btn-success">
              <FontAwesomeIcon icon="check-circle" className="me-2" />
              Success
            </button>
            <button className="btn btn-warning">
              <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
              Warning
            </button>
            <button className="btn btn-danger">
              <FontAwesomeIcon icon="times-circle" className="me-2" />
              Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FontAwesomeExamples;