import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MultiSelectDropdown from './MultiSelectDropdown';
import { useTranslation } from '../hooks/useTranslation';
import './MaidSearch.css';

function MaidSearch() {
  const { t } = useTranslation();
  const [maids, setMaids] = useState([]);
  const [filteredMaids, setFilteredMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [maidsPerPage] = useState(6);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [showMaidModal, setShowMaidModal] = useState(false);
  const [expandedEmployment, setExpandedEmployment] = useState({});
  const [filters, setFilters] = useState({
    maidNumber: '',
    skills: [],
    languages: [],
    status: '',
    nationality: '',
    gender: '',
    education: [],
    religion: [],
    minExperience: '',
    maxExperience: ''
  });

  // Available options for multi-select dropdowns
  const [availableOptions, setAvailableOptions] = useState({
    skills: [],
    languages: [],
    education: [],
    religion: []
  });

  useEffect(() => {
    fetchMaids();
    fetchCompanyInfo();
  }, []);

  // Auto-apply filters when they change
  useEffect(() => {
    if (maids.length > 0) {
      applyFilters();
    }
  }, [filters, maids]);



  const fetchMaids = async () => {
    try {
      const response = await axios.get('/api/maids');
      // Filter out maids with 'pending' and 'not available' status
      const availableMaids = response.data.filter(maid => maid.status === 'available');
      setMaids(availableMaids);
      setFilteredMaids(availableMaids);

      // Extract unique options for dropdowns
      const skills = [...new Set(availableMaids.flatMap(maid =>
        maid.skills.filter(skill => skill.value).map(skill => skill.skill)
      ))];

      const languages = [...new Set(availableMaids.flatMap(maid =>
        maid.languages.map(lang => lang.language)
      ))];

      const education = [...new Set(availableMaids.map(maid => maid.educationLevel).filter(Boolean))];

      const religion = [...new Set(availableMaids.map(maid => maid.religion).filter(Boolean))];

      setAvailableOptions({
        skills: skills.sort(),
        languages: languages.sort(),
        education: education.sort(),
        religion: religion.sort()
      });
    } catch (error) {
      console.error('Error fetching maids:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get('/api/company');
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, selectedValues) => {
    setFilters(prev => ({ ...prev, [name]: selectedValues }));
  };

  const applyFilters = () => {
    let filtered = [...maids];

    // Filter by maid number
    if (filters.maidNumber) {
      filtered = filtered.filter(maid =>
        maid.maidId.toLowerCase().includes(filters.maidNumber.toLowerCase())
      );
    }

    // Filter by skills (OR logic - maid must have at least one selected skill)
    if (filters.skills.length > 0) {
      filtered = filtered.filter(maid =>
        maid.skills.some(skill =>
          skill.value && filters.skills.includes(skill.skill)
        )
      );
    }

    // Filter by languages (OR logic - maid must speak at least one selected language)
    if (filters.languages.length > 0) {
      filtered = filtered.filter(maid =>
        maid.languages.some(lang =>
          filters.languages.includes(lang.language)
        )
      );
    }

    // Filter by education (OR logic)
    if (filters.education.length > 0) {
      filtered = filtered.filter(maid =>
        filters.education.includes(maid.educationLevel)
      );
    }

    // Filter by religion (OR logic)
    if (filters.religion.length > 0) {
      filtered = filtered.filter(maid =>
        filters.religion.includes(maid.religion)
      );
    }

    // Filter by nationality
    if (filters.nationality) {
      filtered = filtered.filter(maid =>
        maid.nationality.toLowerCase().includes(filters.nationality.toLowerCase())
      );
    }

    // Filter by gender
    if (filters.gender) {
      filtered = filtered.filter(maid => maid.gender === filters.gender);
    }

    // Filter by experience range
    if (filters.minExperience) {
      filtered = filtered.filter(maid => maid.workExperience >= parseInt(filters.minExperience));
    }
    if (filters.maxExperience) {
      filtered = filtered.filter(maid => maid.workExperience <= parseInt(filters.maxExperience));
    }

    setFilteredMaids(filtered);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  const clearFilters = () => {
    setFilters({
      maidNumber: '',
      skills: [],
      languages: [],
      status: '',
      nationality: '',
      gender: '',
      education: [],
      religion: [],
      minExperience: '',
      maxExperience: ''
    });

    setFilteredMaids(maids);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  // Calculate pagination
  const indexOfLastMaid = currentPage * maidsPerPage;
  const indexOfFirstMaid = indexOfLastMaid - maidsPerPage;
  const currentMaids = filteredMaids.slice(indexOfFirstMaid, indexOfLastMaid);
  const totalPages = Math.ceil(filteredMaids.length / maidsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadPDF = async (maidId, maidName) => {
    try {
      const response = await axios.get(`/api/maids/${maidId}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${maidName.replace(/\s+/g, '_')}_profile.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  // Company phone may be nested (local server) or flat (serverless) — read both.
  const getCompanyPhone = () => companyInfo?.contact?.phone || companyInfo?.phone || '';

  const sendWhatsAppMessage = (maidId, maidName) => {
    const phone = getCompanyPhone();
    if (!phone) {
      alert('Company WhatsApp number not available. Please contact the administrator.');
      return;
    }

    // Clean phone number (remove spaces, dashes, and non-numeric characters except +)
    const phoneNumber = phone.replace(/[^\d+]/g, '');

    // Create WhatsApp message
    const message = `Hi! I'm interested in maid ${maidId} - ${maidName}. Could you please provide more information about her availability and services?`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const openMaidModal = (maid) => {
    setSelectedMaid(maid);
    setShowMaidModal(true);
  };

  const closeMaidModal = () => {
    setSelectedMaid(null);
    setShowMaidModal(false);
    setExpandedEmployment({});
  };

  const toggleEmployment = (index) => {
    setExpandedEmployment(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card filter-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">
            <i className="bi bi-sliders2 me-2"></i>Filter Maids
          </h3>
          <button
            className="btn btn-toggle-advanced btn-sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <i className={`bi bi-chevron-${showAdvancedFilters ? 'up' : 'down'} me-1`}></i>
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>
        <div className="card-body">
          {/* Quick Filters Row */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label">Maid Number</label>
              <input
                type="text"
                name="maidNumber"
                className="form-control"
                value={filters.maidNumber}
                onChange={handleFilterChange}
                placeholder="Enter maid ID"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">{t('maid.skills')}</label>
              <MultiSelectDropdown
                options={availableOptions.skills}
                selectedValues={filters.skills}
                onChange={(values) => handleMultiSelectChange('skills', values)}
                placeholder="Select skills..."
                searchable={true}
                maxDisplayCount={2}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">{t('maid.languages')}</label>
              <MultiSelectDropdown
                options={availableOptions.languages}
                selectedValues={filters.languages}
                onChange={(values) => handleMultiSelectChange('languages', values)}
                placeholder="Select languages..."
                searchable={true}
                maxDisplayCount={2}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="row g-3 border-top pt-3">
              <div className="col-md-6 col-lg-4">
                <label className="form-label">Education</label>
                <MultiSelectDropdown
                  options={availableOptions.education}
                  selectedValues={filters.education}
                  onChange={(values) => handleMultiSelectChange('education', values)}
                  placeholder="Select education levels..."
                  searchable={true}
                  maxDisplayCount={2}
                />
              </div>

              <div className="col-md-6 col-lg-4">
                <label className="form-label">Religion</label>
                <MultiSelectDropdown
                  options={availableOptions.religion}
                  selectedValues={filters.religion}
                  onChange={(values) => handleMultiSelectChange('religion', values)}
                  placeholder="Select religions..."
                  searchable={true}
                  maxDisplayCount={2}
                />
              </div>

              <div className="col-md-6 col-lg-4">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  className="form-control"
                  value={filters.nationality}
                  onChange={handleFilterChange}
                  placeholder="e.g., Philippines, Indonesia"
                />
              </div>

              <div className="col-md-6 col-lg-4">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  value={filters.gender}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div className="col-md-6 col-lg-4">
                <label className="form-label">Min Experience (years)</label>
                <input
                  type="number"
                  name="minExperience"
                  className="form-control"
                  value={filters.minExperience}
                  onChange={handleFilterChange}
                  placeholder="0"
                />
              </div>

              <div className="col-md-6 col-lg-4">
                <label className="form-label">Max Experience (years)</label>
                <input
                  type="number"
                  name="maxExperience"
                  className="form-control"
                  value={filters.maxExperience}
                  onChange={handleFilterChange}
                  placeholder="20"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-3">
            <button onClick={applyFilters} className="btn btn-primary">
              <i className="bi bi-funnel me-1"></i>
              Apply Filters
            </button>
            <button onClick={clearFilters} className="btn btn-secondary">
              <i className="bi bi-x-circle me-1"></i>
              Clear All
            </button>
            {(filters.skills.length > 0 || filters.languages.length > 0 || filters.education.length > 0 ||
              filters.religion.length > 0 || filters.maidNumber || filters.nationality || filters.gender ||
              filters.minExperience || filters.maxExperience) && (
                <span className="badge bg-info align-self-center ms-2">
                  {[
                    filters.maidNumber && 'ID',
                    filters.skills.length > 0 && `${filters.skills.length} Skills`,
                    filters.languages.length > 0 && `${filters.languages.length} Languages`,
                    filters.education.length > 0 && `${filters.education.length} Education`,
                    filters.religion.length > 0 && `${filters.religion.length} Religion`,
                    filters.nationality && 'Nationality',
                    filters.gender && 'Gender',
                    (filters.minExperience || filters.maxExperience) && 'Experience'
                  ].filter(Boolean).join(', ')} active
                </span>
              )}
          </div>
        </div>
      </div>

      <div className="card results-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title mb-0">
            <i className="bi bi-people-fill me-2"></i>Available Maids
            <span className="results-count ms-2">{filteredMaids.length}</span>
          </h2>
          {filteredMaids.length > 0 && (
            <small className="text-muted">
              Showing {indexOfFirstMaid + 1}-{Math.min(indexOfLastMaid, filteredMaids.length)} of {filteredMaids.length} maids
            </small>
          )}
        </div>

        <div className="card-body">
          {filteredMaids.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <p className="mt-3 text-muted">No maids found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {currentMaids.map(maid => (
                  <div key={maid._id} className="col-md-6 col-lg-4">
                    <div className="card maid-card h-100">
                      {maid.profilePhoto ? (
                        <img
                          src={maid.profilePhoto}
                          alt={maid.name}
                          className="card-img-top maid-card-img"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="card-img-top maid-card-img maid-card-img--placeholder d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                          <i className="bi bi-person-circle display-4"></i>
                        </div>
                      )}

                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title maid-card-name">{maid.name}</h5>
                        <div className="mb-3 maid-card-meta">
                          <small className="d-block"><strong>{t('maid.id')}:</strong> {maid.maidId}</small>
                          <small className="d-block"><strong>{t('maid.nationality')}:</strong> {maid.nationality}</small>
                          <small className="d-block"><strong>{t('maid.experience')}:</strong> {maid.workExperience} {t('maid.years')}</small>
                        </div>

                        <div className="mb-3">
                          {maid.skills.filter(skill => skill.value).map((skill, index) => (
                            <span key={index} className="badge skill-badge me-1 mb-1">
                              {t(`maid.${skill.skill}`) || skill.skill}
                            </span>
                          ))}
                        </div>

                        <div className="mb-3 small text-muted">
                          <p className="mb-1"><strong>{t('maid.languages')}:</strong> {maid.languages.map(lang => `${lang.language} (${lang.level})`).join(', ')}</p>
                          <p className="mb-1"><strong>{t('maid.education')}:</strong> {maid.educationLevel}</p>
                          <p className="mb-1"><strong>{t('maid.religion')}:</strong> {maid.religion}</p>
                          <p className="mb-0"><strong>{t('maid.previousEmployment')}:</strong> {maid.previousEmployment.length} {maid.previousEmployment.length !== 1 ? t('maid.records') : t('maid.record')}</p>
                        </div>

                        <div className="mt-auto">
                          <div className="d-grid gap-2">
                            <button
                              onClick={() => openMaidModal(maid)}
                              className="btn btn-info"
                            >
                              <i className="bi bi-eye me-1"></i>
                              {t('maid.viewDetails')}
                            </button>
                            <button
                              onClick={() => downloadPDF(maid._id, maid.name)}
                              className="btn btn-primary"
                            >
                              <i className="bi bi-download me-1"></i>
                              {t('maid.downloadPdf')}
                            </button>
                            <button
                              onClick={() => sendWhatsAppMessage(maid.maidId, maid.name)}
                              className="btn btn-success"
                              disabled={!getCompanyPhone()}
                            >
                              <i className="bi bi-whatsapp me-1"></i>
                              {t('maid.contactWhatsApp')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bootstrap Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Maid search pagination" className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Maid Detail Modal */}
      {showMaidModal && selectedMaid && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeMaidModal}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content maid-modal">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  {selectedMaid.name} <span className="modal-maid-id">{selectedMaid.maidId}</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeMaidModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Profile Photo */}
                  <div className="col-md-4 text-center mb-3">
                    {selectedMaid.profilePhoto ? (
                      <img
                        src={selectedMaid.profilePhoto}
                        alt={selectedMaid.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center text-muted rounded" style={{ height: '300px' }}>
                        <i className="bi bi-person-circle display-1"></i>
                      </div>
                    )}

                  </div>

                  {/* Personal Information */}
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-person-fill me-2"></i>
                      {t('maid.basicInfo')}
                    </h6>
                    <div className="row g-2 mb-3">
                      <div className="col-sm-6">
                        <strong>{t('maid.name')}:</strong><br />
                        <span className="text-muted">{selectedMaid.name}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Gender:</strong><br />
                        <span className="text-muted">{selectedMaid.gender}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.nationality')}:</strong><br />
                        <span className="text-muted">{selectedMaid.nationality}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.maritalStatus')}:</strong><br />
                        <span className="text-muted">{selectedMaid.maritalStatus}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.education')}:</strong><br />
                        <span className="text-muted">{selectedMaid.educationLevel}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.religion')}:</strong><br />
                        <span className="text-muted">{selectedMaid.religion}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.height')}:</strong><br />
                        <span className="text-muted">{selectedMaid.height} {t('maid.cm')}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.weight')}:</strong><br />
                        <span className="text-muted">{selectedMaid.weight} {t('maid.kg')}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Chinese Zodiac:</strong><br />
                        <span className="text-muted">{selectedMaid.chineseZodiac}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Horoscope:</strong><br />
                        <span className="text-muted">{selectedMaid.horoscope}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.experience')}:</strong><br />
                        <span className="text-muted">{selectedMaid.workExperience} years</span>
                      </div>
                      {selectedMaid.contactNumber && (
                        <div className="col-sm-6">
                          <strong>{t('maid.contactNumber')}:</strong><br />
                          <span className="text-muted">{selectedMaid.contactNumber}</span>
                        </div>
                      )}
                      {selectedMaid.email && (
                        <div className="col-sm-6">
                          <strong>{t('maid.email')}:</strong><br />
                          <span className="text-muted">{selectedMaid.email}</span>
                        </div>
                      )}
                      <div className="col-sm-6">
                        <strong>Date of Birth:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.dateOfBirth ? new Date(selectedMaid.dateOfBirth).toLocaleDateString() : 'Not specified'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Children:</strong><br />
                        <span className="text-muted">{selectedMaid.numberOfChildren || 'Not specified'}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Brothers:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.numberOfBrothers !== undefined ? selectedMaid.numberOfBrothers : 'Not specified'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Sisters:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.numberOfSisters !== undefined ? selectedMaid.numberOfSisters : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Languages */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-translate me-2"></i>
                      {t('maid.languages')}
                    </h6>
                    {selectedMaid.languages && selectedMaid.languages.length > 0 ? (
                      <div className="row g-2">
                        {selectedMaid.languages.map((lang, index) => (
                          <div key={index} className="col-sm-6 col-md-4">
                            <div className="border rounded p-2 text-center">
                              <strong>{lang.language}</strong><br />
                              <small className="text-muted">Level: {lang.level}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">{t('maid.noLanguages')}</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-tools me-2"></i>
                      {t('maid.skills')}
                    </h6>
                    {selectedMaid.skills && selectedMaid.skills.filter(skill => skill.value).length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {selectedMaid.skills.filter(skill => skill.value).map((skill, index) => (
                          <span key={index} className="badge bg-success fs-6">
                            <i className="bi bi-check-circle me-1"></i>
                            {t(`maid.${skill.skill}`) || skill.skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">{t('maid.noSkills')}</p>
                    )}
                  </div>
                </div>

                {/* Special Skills */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-star-fill me-2"></i>
                      {t('maid.specialSkills')}
                    </h6>
                    {selectedMaid.specialSkills && selectedMaid.specialSkills.length > 0 ? (
                      <div className="row g-2">
                        {selectedMaid.specialSkills.map((skill, index) => (
                          <div key={index} className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body py-2">
                                <div className="row align-items-center">
                                  <div className="col-md-6">
                                    <span className="fw-medium">{t(`maid.${skill.skill}`) || skill.skill}</span>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex gap-3">
                                      {skill.experienced && (
                                        <span className="badge bg-info">
                                          <i className="bi bi-check-circle me-1"></i>
                                          Experienced
                                        </span>
                                      )}
                                      {skill.accepted ? (
                                        <span className="badge bg-success">
                                          <i className="bi bi-hand-thumbs-up me-1"></i>
                                          Accepted
                                        </span>
                                      ) : (
                                        <span className="badge bg-danger">
                                          <i className="bi bi-hand-thumbs-down me-1"></i>
                                          Not Accepted
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No special skills information available</p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-person-lines-fill me-2"></i>
                      {t('maid.personalInformation')}
                    </h6>
                    {selectedMaid.personalInformation && selectedMaid.personalInformation.length > 0 ? (
                      <div className="row g-2">
                        {selectedMaid.personalInformation.map((info, index) => (
                          <div key={index} className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body py-2">
                                <div className="row align-items-center">
                                  <div className="col-md-8">
                                    <span className="fw-medium">{t(`maid.${info.question}`) || info.question}</span>
                                  </div>
                                  <div className="col-md-4 text-end">
                                    <span className={`badge ${info.answer.toLowerCase() === 'yes' ? 'bg-success' : 'bg-secondary'}`}>
                                      {info.answer.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">{t('maid.noPersonalInfo')}</p>
                    )}
                  </div>
                </div>

                {/* Previous Employment */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-briefcase-fill me-2"></i>
                      {t('maid.previousEmploymentHistory')}
                    </h6>
                    {selectedMaid.previousEmployment && selectedMaid.previousEmployment.length > 0 ? (
                      <div className="accordion">
                        {selectedMaid.previousEmployment.map((emp, index) => (
                          <div key={index} className="accordion-item">
                            <h2 className="accordion-header">
                              <button
                                className={`accordion-button ${!expandedEmployment[index] ? 'collapsed' : ''}`}
                                type="button"
                                onClick={() => toggleEmployment(index)}
                              >
                                <strong>Employment #{index + 1}</strong>
                                {emp.employerName && <span className="ms-2 text-muted">- {emp.employerName}</span>}
                              </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${expandedEmployment[index] ? 'show' : ''}`}>
                              <div className="accordion-body">
                                <div className="row g-2">
                                  <div className="col-sm-6">
                                    <strong>Employer:</strong><br />
                                    <span className="text-muted">{emp.employerName || 'Not specified'}</span>
                                  </div>
                                  <div className="col-sm-6">
                                    <strong>Location:</strong><br />
                                    <span className="text-muted">{emp.location || 'Not specified'}</span>
                                  </div>
                                  <div className="col-sm-6">
                                    <strong>Period:</strong><br />
                                    <span className="text-muted">{emp.period || 'Not specified'}</span>
                                  </div>
                                  <div className="col-12">
                                    <strong>Duties & Responsibilities:</strong><br />
                                    <span className="text-muted">{emp.duties || 'Not specified'}</span>
                                  </div>
                                  {emp.reasonForLeave && (
                                    <div className="col-12">
                                      <strong>Reason for Leave:</strong><br />
                                      <span className="text-muted">{emp.reasonForLeave}</span>
                                    </div>
                                  )}
                                  {(emp.noOfAdults || emp.noOfNewBorn || emp.noOfElderly || emp.noOfChildrenWithAge) && (
                                    <div className="col-12">
                                      <strong>Household Composition:</strong><br />
                                      <span className="text-muted">
                                        {[
                                          emp.noOfAdults && `Adults: ${emp.noOfAdults}`,
                                          emp.noOfNewBorn && `Newborns: ${emp.noOfNewBorn}`,
                                          emp.noOfElderly && `Elderly: ${emp.noOfElderly}`,
                                          emp.noOfChildrenWithAge && `Children: ${emp.noOfChildrenWithAge}`
                                        ].filter(Boolean).join(', ')}
                                      </span>
                                    </div>
                                  )}
                                  {emp.skills && emp.skills.filter(skill => skill.value).length > 0 && (
                                    <div className="col-12">
                                      <strong>{t('maid.skillsUsed')}:</strong><br />
                                      <div className="d-flex flex-wrap gap-1 mt-1">
                                        {emp.skills.filter(skill => skill.value).map((skill, skillIndex) => (
                                          <span key={skillIndex} className="badge bg-info">
                                            {t(`maid.${skill.skill}`) || skill.skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">{t('maid.noPreviousEmployment')}</p>
                    )}
                  </div>
                </div>


              </div>
              <div className="modal-footer">
                <button
                  onClick={() => downloadPDF(selectedMaid._id, selectedMaid.name)}
                  className="btn btn-primary"
                >
                  <i className="bi bi-download me-1"></i>
                  Download PDF
                </button>
                <button
                  onClick={() => sendWhatsAppMessage(selectedMaid.maidId, selectedMaid.name)}
                  className="btn btn-success"
                  disabled={!getCompanyPhone()}
                >
                  <i className="bi bi-whatsapp me-1"></i>
                  {t('maid.contactWhatsApp')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeMaidModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaidSearch;