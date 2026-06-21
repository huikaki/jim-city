import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useTranslation } from '../hooks/useTranslation';

function AdminPanel() {
  const { t } = useTranslation();
  const [maids, setMaids] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [showMaidForm, setShowMaidForm] = useState(false);
  const [editingMaid, setEditingMaid] = useState(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [allSkills, setAllSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [filteredMaids, setFilteredMaids] = useState([]);
  const [filters, setFilters] = useState({
    maidNumber: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [showMaidModal, setShowMaidModal] = useState(false);
  const [expandedEmployment, setExpandedEmployment] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [maidsPerPage] = useState(6);

  const [maidForm, setMaidForm] = useState({
    name: '',
    gender: 'Female',
    dateOfBirth: '',
    numberOfChildren: '',
    numberOfBrothers: '',
    numberOfSisters: '',
    address: '',
    educationLevel: '',
    nationality: '',
    maritalStatus: 'Single',
    height: '',
    weight: '',
    chineseZodiac: '',
    religion: '',
    horoscope: '',
    workExperience: '',
    contactNumber: '',
    email: '',
    languages: [],
    skills: [],
    previousEmployment: [],
    specialSkills: [],
    personalInformation: [],
    status: 'available',
    profilePhoto: null
  });

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to access the admin panel. Please login first.');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [maidsResponse, companyResponse] = await Promise.all([
        axios.get('/api/maids'),
        axios.get('/api/company')
      ]);
      setMaids(maidsResponse.data);
      setFilteredMaids(maidsResponse.data);
      setCompanyInfo(companyResponse.data);

      // Extract all unique skills from all maids
      const skillsSet = new Set();
      maidsResponse.data.forEach(maid => {
        if (maid.skills && Array.isArray(maid.skills)) {
          maid.skills.forEach(skill => {
            if (skill.skill) {
              skillsSet.add(skill.skill);
            }
          });
        }
      });
      setAllSkills(Array.from(skillsSet).sort());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaidFormChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setMaidForm(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === 'previousEmployment') {
      try {
        const employmentArray = JSON.parse(value);
        setMaidForm(prev => ({ ...prev, [name]: employmentArray }));
      } catch {
        // If not valid JSON, treat as simple string for now
        setMaidForm(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setMaidForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMaidSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to perform this action. Please refresh the page and login again.');
      return;
    }

    const formData = new FormData();
    Object.keys(maidForm).forEach(key => {
      if (key === 'skills' || key === 'languages' || key === 'previousEmployment' || key === 'specialSkills' || key === 'personalInformation') {
        formData.append(key, JSON.stringify(maidForm[key]));
      } else if (key === 'profilePhoto' && maidForm[key]) {
        formData.append(key, maidForm[key]);
      } else if (key !== 'profilePhoto') {
        formData.append(key, maidForm[key]);
      }
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (editingMaid) {
        await axios.put(`/api/maids/${editingMaid._id}`, formData, config);
      } else {
        await axios.post('/api/maids', formData, config);
      }

      fetchData();
      resetMaidForm();
      alert(editingMaid ? 'Maid updated successfully!' : 'Maid created successfully!');
    } catch (error) {
      console.error('Error saving maid:', error);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please refresh the page and login again.');
      } else {
        const errorMsg = error.response?.data?.details || error.response?.data?.message || error.message;
        alert(`Error saving maid: ${errorMsg}`);
      }
    }
  };

  const handleEditMaid = (maid) => {
    setEditingMaid(maid);

    // Create a complete skills array with all available skills
    const completeSkills = allSkills.map(skillName => {
      const existingSkill = maid.skills.find(s => s.skill === skillName);
      return existingSkill || { skill: skillName, value: false };
    });

    setMaidForm({
      name: maid.name,
      gender: maid.gender,
      dateOfBirth: maid.dateOfBirth ? new Date(maid.dateOfBirth).toISOString().split('T')[0] : '',
      numberOfChildren: maid.numberOfChildren || '',
      numberOfBrothers: maid.numberOfBrothers || '',
      numberOfSisters: maid.numberOfSisters || '',
      address: maid.address || '',
      educationLevel: maid.educationLevel,
      nationality: maid.nationality,
      maritalStatus: maid.maritalStatus,
      height: maid.height.toString(),
      weight: maid.weight.toString(),
      chineseZodiac: maid.chineseZodiac,
      religion: maid.religion,
      horoscope: maid.horoscope,
      workExperience: maid.workExperience.toString(),
      contactNumber: maid.contactNumber || '',
      email: maid.email || '',
      languages: maid.languages || [],
      skills: completeSkills,
      previousEmployment: maid.previousEmployment || [],
      specialSkills: maid.specialSkills || [],
      personalInformation: maid.personalInformation || [],
      status: maid.status,
      profilePhoto: null
    });
    setShowMaidForm(true);
  };

  const handleDeleteMaid = async (id) => {
    if (window.confirm('Are you sure you want to delete this maid?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/maids/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting maid:', error);
        alert('Error deleting maid. Please try again.');
      }
    }
  };

  const resetMaidForm = () => {
    // Initialize skills with all available skills set to false
    const initialSkills = allSkills.map(skillName => ({
      skill: skillName,
      value: false
    }));

    setMaidForm({
      name: '',
      gender: 'Female',
      dateOfBirth: '',
      numberOfChildren: '',
      numberOfBrothers: '',
      numberOfSisters: '',
      address: '',
      educationLevel: '',
      nationality: '',
      maritalStatus: 'Single',
      height: '',
      weight: '',
      chineseZodiac: '',
      religion: '',
      horoscope: '',
      workExperience: '',
      contactNumber: '',
      email: '',
      languages: [],
      skills: initialSkills,
      previousEmployment: [],
      specialSkills: [],
      personalInformation: [],
      status: 'available',
      profilePhoto: null
    });
    setEditingMaid(null);
    setShowMaidForm(false);
    setNewSkill('');
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/company', companyInfo, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setShowCompanyForm(false);
      alert('Company information updated successfully!');
    } catch (error) {
      console.error('Error updating company info:', error);
      alert('Error updating company information. Please try again.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload files. Please refresh the page and login again.');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size); // Debug log

    setUploadLoading(true);
    setUploadProgress(0);

    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      console.log('File extension:', fileExtension); // Debug log

      if (fileExtension === 'csv') {
        console.log('Parsing CSV file...'); // Debug log
        // Parse CSV file
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('CSV parsing complete:', results); // Debug log
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            processMaidData(results.data);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            alert(`Error parsing CSV file: ${error.message || 'Please check the format.'}`);
            setUploadLoading(false);
          }
        });
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        console.log('Parsing Excel file...'); // Debug log
        // Parse Excel file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            console.log('Excel file loaded, parsing...'); // Debug log
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            console.log('Sheet name:', sheetName); // Debug log
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            console.log('Excel parsing complete:', data); // Debug log
            processMaidData(data);
          } catch (error) {
            console.error('Excel parsing error:', error);
            alert(`Error parsing Excel file: ${error.message}`);
            setUploadLoading(false);
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          alert('Error reading Excel file. Please try again.');
          setUploadLoading(false);
        };
        reader.readAsBinaryString(file);
      } else {
        alert('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
        setUploadLoading(false);
        return;
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert(`Error processing file: ${error.message}`);
      setUploadLoading(false);
    }

    // Reset file input
    event.target.value = '';
  };

  const processMaidData = async (data) => {
    console.log('Processing maid data:', data); // Debug log

    if (!data || data.length === 0) {
      alert('No data found in the file.');
      setUploadLoading(false);
      return;
    }

    try {
      let successCount = 0;
      let errorCount = 0;
      const total = data.length;
      const errors = []; // Track specific errors

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        console.log(`Processing row ${i + 1}:`, row); // Debug log
        setUploadProgress(Math.round(((i + 1) / total) * 100));

        try {
          // Skip empty rows
          if (!row.name && !row.Name && Object.keys(row).length <= 1) {
            console.log(`Skipping empty row ${i + 1}`);
            continue;
          }

          // Map CSV/Excel columns to maid object (maidId will be auto-generated)
          const maidData = {
            name: (row.name || row.Name || '').toString().trim(),
            gender: (row.gender || row.Gender || 'Female').toString().trim(),
            educationLevel: (row.educationLevel || row['Education Level'] || row.education || '').toString().trim(),
            nationality: (row.nationality || row.Nationality || '').toString().trim(),
            maritalStatus: (row.maritalStatus || row['Marital Status'] || row.marital || 'Single').toString().trim(),
            height: Math.max(0, parseInt(row.height || row.Height || 0) || 0),
            weight: Math.max(0, parseInt(row.weight || row.Weight || 0) || 0),
            chineseZodiac: (row.chineseZodiac || row['Chinese Zodiac'] || row.zodiac || '').toString().trim(),
            religion: (row.religion || row.Religion || '').toString().trim(),
            horoscope: (row.horoscope || row.Horoscope || '').toString().trim(),
            workExperience: Math.max(0, parseInt(row.workExperience || row['Work Experience'] || row.experience || 0) || 0),
            contactNumber: (row.contactNumber || row['Contact Number'] || row.contact || row.phone || '').toString().trim(),
            email: (row.email || row.Email || row['Email Address'] || '').toString().trim(),
            status: (row.status || row.Status || 'available').toString().trim(),
            languages: parseArrayField(row.languages || row.Languages || '', 'languages'),
            skills: parseArrayField(row.skills || row.Skills || '', 'skills'),
            previousEmployment: parseArrayField(row.previousEmployment || row['Previous Employment'] || '', 'employment')
          };

          // Validate enum values
          if (!['Male', 'Female'].includes(maidData.gender)) {
            maidData.gender = 'Female';
          }
          if (!['Single', 'Married', 'Divorced', 'Widowed'].includes(maidData.maritalStatus)) {
            maidData.maritalStatus = 'Single';
          }
          if (!['available', 'pending', 'not available'].includes(maidData.status)) {
            maidData.status = 'available';
          }

          console.log(`Mapped maid data for row ${i + 1}:`, maidData); // Debug log

          // Validate required fields
          if (!maidData.name || !maidData.nationality) {
            const error = `Row ${i + 1}: Missing required fields (name: "${maidData.name}", nationality: "${maidData.nationality}")`;
            console.warn(error);
            errors.push(error);
            errorCount++;
            continue;
          }

          console.log(`Sending maid data to API for row ${i + 1}`); // Debug log

          // Get auth token from localStorage
          const token = localStorage.getItem('token');

          // Create FormData to match server expectations
          const formData = new FormData();
          Object.keys(maidData).forEach(key => {
            if (key === 'skills' || key === 'languages' || key === 'previousEmployment') {
              formData.append(key, JSON.stringify(maidData[key]));
            } else {
              formData.append(key, maidData[key]);
            }
          });

          const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          };

          const response = await axios.post('/api/maids', formData, config);
          console.log(`Successfully created maid for row ${i + 1}:`, response.data); // Debug log
          successCount++;
        } catch (error) {
          let errorMsg = `Row ${i + 1}: ${error.response?.data?.message || error.message}`;

          // Handle specific error cases
          if (error.response?.status === 401) {
            errorMsg = `Row ${i + 1}: Authentication failed. Please log in again.`;
            // Stop processing if authentication fails
            alert('Authentication failed. Please log in again and retry the upload.');
            setUploadLoading(false);
            return;
          } else if (error.response?.status === 400) {
            errorMsg = `Row ${i + 1}: Invalid data - ${error.response.data.details || error.response.data.message}`;
          }

          console.error(errorMsg, error);
          errors.push(errorMsg);
          errorCount++;
        }
      }

      // Show detailed results
      let message = `Upload completed!\nSuccessfully added: ${successCount} maids\nErrors: ${errorCount} rows`;
      if (errors.length > 0 && errors.length <= 5) {
        message += '\n\nFirst few errors:\n' + errors.slice(0, 5).join('\n');
      }

      alert(message);
      fetchData(); // Refresh the maid list
    } catch (error) {
      console.error('Error processing maid data:', error);
      alert(`Error processing maid data: ${error.message}`);
    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
    }
  };

  const parseArrayField = (field, fieldType = 'skills') => {
    // Handle empty or null values
    if (!field || field === '' || field === '[]' || field === '{}') return [];

    try {
      // If it's already an array, return it
      if (Array.isArray(field)) return field;

      // If it's a JSON string, parse it
      if (typeof field === 'string' && (field.trim().startsWith('[') || field.trim().startsWith('{'))) {
        const parsed = JSON.parse(field.trim());
        return Array.isArray(parsed) ? parsed : [parsed];
      }

      // If it's a comma-separated string, convert to appropriate array format
      if (typeof field === 'string' && field.includes(',')) {
        const items = field.split(',').map(item => item.trim()).filter(item => item);

        if (fieldType === 'skills') {
          return items.map(item => ({
            skill: item,
            value: true
          }));
        } else if (fieldType === 'languages') {
          return items.map(item => {
            const parts = item.split(':');
            return {
              language: parts[0] ? parts[0].trim() : item,
              level: parts[1] ? parts[1].trim() : 'Good'
            };
          });
        } else if (fieldType === 'employment') {
          // For employment, try to parse as structured data or fallback to description
          return items.map(item => {
            const parts = item.split('|');
            if (parts.length >= 4) {
              return {
                employerName: parts[0].trim(),
                location: parts[1].trim(),
                period: parts[2].trim(),
                duties: parts[3].trim()
              };
            } else {
              return {
                employerName: item.trim(),
                location: '',
                period: '',
                duties: ''
              };
            }
          });
        }
      }

      // Single item case
      if (typeof field === 'string' && field.trim()) {
        if (fieldType === 'skills') {
          return [{ skill: field.trim(), value: true }];
        } else if (fieldType === 'languages') {
          return [{ language: field.trim(), level: 'Good' }];
        } else if (fieldType === 'employment') {
          return [{
            employerName: field.trim(),
            location: '',
            period: '',
            duties: ''
          }];
        }
      }

      // Default case
      return [];
    } catch (error) {
      console.warn('Error parsing array field:', field, fieldType, error);
      return [];
    }
  };

  // Filter functions
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...maids];

    // Filter by maid number
    if (filters.maidNumber) {
      filtered = filtered.filter(maid =>
        maid.maidId && maid.maidId.toLowerCase().includes(filters.maidNumber.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(maid => maid.status === filters.status);
    }

    // Apply sorting
    filtered = applySorting(filtered);

    setFilteredMaids(filtered);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  const applySorting = (maidsToSort) => {
    return [...maidsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt || 0);
          bValue = new Date(b.updatedAt || 0);
          break;
        case 'maidId':
          aValue = a.maidId || '';
          bValue = b.maidId || '';
          break;
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
      }

      if (sortBy === 'maidId') {
        // For maidId, do string comparison
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        // For dates, do date comparison
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      maidNumber: '',
      status: ''
    });
    setSortBy('createdAt');
    setSortOrder('desc');
    const sortedMaids = applySorting(maids);
    setFilteredMaids(sortedMaids);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // If clicking the same sort field, toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different field, set new field and default to desc
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Auto-apply filters and sorting when they change
  useEffect(() => {
    if (maids.length > 0) {
      applyFilters();
    }
  }, [filters, maids, sortBy, sortOrder]);

  // Skills management functions
  const handleSkillChange = (skillName, checked) => {
    setMaidForm(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.skill === skillName ? { ...skill, value: checked } : skill
      )
    }));
  };

  const addNewSkill = () => {
    if (newSkill.trim() && !allSkills.includes(newSkill.trim())) {
      const updatedSkills = [...allSkills, newSkill.trim()].sort();
      setAllSkills(updatedSkills);

      setMaidForm(prev => ({
        ...prev,
        skills: [...prev.skills, { skill: newSkill.trim(), value: true }]
      }));

      setNewSkill('');
    }
  };

  // Language management functions
  const addLanguage = () => {
    setMaidForm(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', level: 'Good' }]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setMaidForm(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (index) => {
    setMaidForm(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Previous Employment management functions
  const addPreviousEmployment = () => {
    setMaidForm(prev => ({
      ...prev,
      previousEmployment: [...prev.previousEmployment, {
        employerName: '',
        location: '',
        period: '',
        duties: '',
        skills: [],
        reasonForLeave: '',
        noOfAdults: '',
        noOfNewBorn: '',
        noOfElderly: '',
        noOfChildrenWithAge: ''
      }]
    }));
  };

  const updatePreviousEmployment = (index, field, value) => {
    setMaidForm(prev => ({
      ...prev,
      previousEmployment: prev.previousEmployment.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      )
    }));
  };

  const removePreviousEmployment = (index) => {
    setMaidForm(prev => ({
      ...prev,
      previousEmployment: prev.previousEmployment.filter((_, i) => i !== index)
    }));
  };

  // Special Skills handlers
  const handleSpecialSkillChange = (skillKey, field, value) => {
    setMaidForm(prev => {
      const existingSkillIndex = prev.specialSkills.findIndex(skill => skill.skill === skillKey);

      if (existingSkillIndex >= 0) {
        // Update existing skill
        const updatedSkills = [...prev.specialSkills];
        updatedSkills[existingSkillIndex] = {
          ...updatedSkills[existingSkillIndex],
          [field]: value
        };
        return { ...prev, specialSkills: updatedSkills };
      } else {
        // Add new skill
        return {
          ...prev,
          specialSkills: [...prev.specialSkills, {
            skill: skillKey,
            experienced: field === 'experienced' ? value : false,
            accepted: field === 'accepted' ? value : false
          }]
        };
      }
    });
  };

  // Personal Information handlers
  const handlePersonalInfoChange = (questionKey, value) => {
    setMaidForm(prev => {
      const existingInfoIndex = prev.personalInformation.findIndex(info => info.question === questionKey);

      if (existingInfoIndex >= 0) {
        // Update existing info
        const updatedInfo = [...prev.personalInformation];
        updatedInfo[existingInfoIndex] = {
          ...updatedInfo[existingInfoIndex],
          answer: value
        };
        return { ...prev, personalInformation: updatedInfo };
      } else {
        // Add new info
        return {
          ...prev,
          personalInformation: [...prev.personalInformation, {
            question: questionKey,
            answer: value
          }]
        };
      }
    });
  };

  const testAPIConnection = async () => {
    try {
      console.log('Testing API connection...');
      const token = localStorage.getItem('token');
      console.log('Auth token:', token ? 'Present' : 'Missing');

      const response = await axios.get('/api/maids');
      console.log('API test successful:', response.data);
      alert(`API connection successful! Found ${response.data.length} maids in database.`);
    } catch (error) {
      console.error('API test failed:', error);
      const errorMsg = error.response?.data?.message || error.message;
      const statusCode = error.response?.status;
      alert(`API connection failed (${statusCode}): ${errorMsg}`);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        name: 'Maria Santos',
        gender: 'Female',
        educationLevel: 'High School',
        nationality: 'Philippines',
        maritalStatus: 'Single',
        height: 160,
        weight: 55,
        chineseZodiac: 'Dragon',
        religion: 'Catholic',
        horoscope: 'Virgo',
        workExperience: 5,
        status: 'available',
        languages: '[{"language": "English", "level": "Good"}, {"language": "Tagalog", "level": "Good"}]',
        skills: '[{"skill": "Baby Sitting", "value": true}, {"skill": "Cooking", "value": true}, {"skill": "Cleaning", "value": true}]',
        previousEmployment: '[{"employerName": "ABC Family", "location": "Hong Kong", "period": "2019-2023", "duties": "Childcare and cleaning"}]'
      },
      {
        name: 'Siti Nurhaliza',
        gender: 'Female',
        educationLevel: 'College',
        nationality: 'Indonesia',
        maritalStatus: 'Married',
        height: 155,
        weight: 50,
        chineseZodiac: 'Tiger',
        religion: 'Islam',
        horoscope: 'Leo',
        workExperience: 3,
        status: 'available',
        languages: '[{"language": "English", "level": "Fair"}, {"language": "Indonesian", "level": "Good"}, {"language": "Arabic", "level": "Good"}]',
        skills: '[{"skill": "Cooking", "value": true}, {"skill": "Elderly Care", "value": true}, {"skill": "Pet Care", "value": false}]',
        previousEmployment: '[{"employerName": "XYZ Family", "location": "Singapore", "period": "2021-2024", "duties": "Elderly care and household management"}]'
      }
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'maid_sample_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Quick status change from the maid detail modal (saves immediately)
  const handleQuickStatusChange = async (newStatus) => {
    if (!selectedMaid || newStatus === selectedMaid.status) return;
    const token = localStorage.getItem('token');
    try {
      const fd = new FormData();
      fd.append('status', newStatus);
      const res = await axios.put(`/api/maids/${selectedMaid._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      setSelectedMaid(res.data);
      fetchData();
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleEmployment = (index) => {
    setExpandedEmployment(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const indexOfLastMaid = currentPage * maidsPerPage;
  const indexOfFirstMaid = indexOfLastMaid - maidsPerPage;
  const currentMaids = filteredMaids.slice(indexOfFirstMaid, indexOfLastMaid);
  const totalPages = Math.ceil(filteredMaids.length / maidsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">Admin Panel</h2>
              <small className="text-muted">
                {localStorage.getItem('token') ? (
                  <span className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Authenticated
                  </span>
                ) : (
                  <span className="text-danger">
                    <i className="bi bi-x-circle me-1"></i>
                    Not authenticated - Please login
                  </span>
                )}
              </small>
            </div>
            <div className="d-flex gap-2">
              <div className="d-flex gap-2">
                <button
                  onClick={downloadSampleCSV}
                  className="btn btn-outline-info btn-sm"
                >
                  <i className="bi bi-download me-1"></i>
                  Sample CSV
                </button>
                <button
                  onClick={testAPIConnection}
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-wifi me-1"></i>
                  Test API
                </button>
                <div className="position-relative">
                  <input
                    type="file"
                    id="fileUpload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploadLoading}
                  />
                  <button
                    onClick={() => document.getElementById('fileUpload').click()}
                    className="btn btn-info"
                    disabled={uploadLoading}
                  >
                    <i className="bi bi-upload me-1"></i>
                    {uploadLoading ? 'Uploading...' : 'Upload CSV/Excel'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowMaidForm(true)}
                className="btn btn-success"
              >
                <i className="bi bi-plus-circle me-1"></i>
                Add New Maid
              </button>
              <button
                onClick={() => setShowCompanyForm(true)}
                className="btn btn-outline-primary"
              >
                <i className="bi bi-building me-1"></i>
                Edit Company Info
              </button>
            </div>
          </div>

          {uploadLoading && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Processing maids data...</small>
                <small className="text-muted">{uploadProgress}%</small>
              </div>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Manage Maids ({filteredMaids.length} of {maids.length})</h3>
            {filteredMaids.length > 0 && (
              <small className="text-muted">
                Showing {indexOfFirstMaid + 1}-{Math.min(indexOfLastMaid, filteredMaids.length)} of {filteredMaids.length} maids
              </small>
            )}
          </div>

          {/* Filter Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Filter Maids</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
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
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="not available">Not Available</option>
                  </select>
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <button onClick={clearFilters} className="btn btn-outline-secondary flex-fill">
                      <i className="bi bi-x-circle me-1"></i>
                      Clear
                    </button>
                    {(filters.maidNumber || filters.status) && (
                      <span className="badge bg-info align-self-center">
                        {[
                          filters.maidNumber && 'ID',
                          filters.status && 'Status'
                        ].filter(Boolean).join(', ')} active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sorting Section */}
              <div className="row g-3 mt-3 pt-3 border-top">
                <div className="col-12">
                  <h6 className="mb-3">
                    <i className="bi bi-sort-down me-2"></i>
                    Sort By
                  </h6>
                </div>
                <div className="col-md-3">
                  <button
                    onClick={() => handleSortChange('createdAt')}
                    className={`btn w-100 ${sortBy === 'createdAt' ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    <i className="bi bi-calendar-plus me-1"></i>
                    Create Date
                    {sortBy === 'createdAt' && (
                      <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    onClick={() => handleSortChange('updatedAt')}
                    className={`btn w-100 ${sortBy === 'updatedAt' ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    <i className="bi bi-calendar-check me-1"></i>
                    Update Date
                    {sortBy === 'updatedAt' && (
                      <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    onClick={() => handleSortChange('maidId')}
                    className={`btn w-100 ${sortBy === 'maidId' ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    <i className="bi bi-hash me-1"></i>
                    Maid ID
                    {sortBy === 'maidId' && (
                      <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </button>
                </div>
                <div className="col-md-3">
                  <div className="text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    Click to toggle sort order
                    <br />
                    <strong>Current:</strong> {sortBy === 'createdAt' ? 'Create Date' : sortBy === 'updatedAt' ? 'Update Date' : 'Maid ID'} ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {filteredMaids.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <p className="mt-3 text-muted">
                {maids.length === 0
                  ? "No maids found. Add some maids or upload a CSV/Excel file."
                  : "No maids match your filter criteria. Try adjusting your filters."
                }
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {currentMaids.map(maid => (
                <div key={maid._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    {maid.profilePhoto ? (
                      <img
                        src={maid.profilePhoto}
                        alt={maid.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: '200px' }}>
                        <i className="bi bi-person-circle display-4"></i>
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{maid.name}</h5>
                      <div className="mb-3">
                        <small className="text-muted d-block"><strong>{t('maid.id')}:</strong> {maid.maidId}</small>
                        <small className="text-muted d-block"><strong>{t('maid.nationality')}:</strong> {maid.nationality}</small>
                        <small className="text-muted d-block"><strong>{t('maid.experience')}:</strong> {maid.workExperience} {t('maid.years')}</small>
                        {maid.contactNumber && <small className="text-muted d-block"><strong>{t('maid.contactNumber')}:</strong> {maid.contactNumber}</small>}
                        {maid.email && <small className="text-muted d-block"><strong>{t('maid.email')}:</strong> {maid.email}</small>}
                        <span className={`badge ${maid.status === 'available' ? 'bg-success' :
                          maid.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                          {maid.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        {maid.skills.filter(skill => skill.value).map((skill, index) => (
                          <span key={index} className="badge bg-info me-1 mb-1">
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
                            View Details
                          </button>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => handleEditMaid(maid)}
                              className="btn btn-outline-primary flex-fill"
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMaid(maid._id)}
                              className="btn btn-outline-danger flex-fill"
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bootstrap Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Admin maid pagination" className="mt-4">
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
        </div>
      </div>

      {/* Maid Form Modal */}
      {showMaidForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingMaid ? 'Edit Maid' : 'Add New Maid'}</h5>
                <button type="button" className="btn-close" onClick={resetMaidForm}></button>
              </div>
              <div className="modal-body">
                <form id="maidForm" onSubmit={handleMaidSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={maidForm.name}
                        onChange={handleMaidFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select
                        name="gender"
                        className="form-select"
                        value={maidForm.gender}
                        onChange={handleMaidFormChange}
                        required
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">{t('maid.dateOfBirth')}</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        className="form-control"
                        value={maidForm.dateOfBirth}
                        onChange={handleMaidFormChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">{t('maid.children')}</label>
                      <input
                        type="text"
                        name="numberOfChildren"
                        className="form-control"
                        value={maidForm.numberOfChildren}
                        onChange={handleMaidFormChange}
                        placeholder="e.g., 2 children (ages 5, 8)"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">{t('maid.brothers')}</label>
                      <input
                        type="number"
                        name="numberOfBrothers"
                        className="form-control"
                        value={maidForm.numberOfBrothers}
                        onChange={handleMaidFormChange}
                        min="0"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">{t('maid.sisters')}</label>
                      <input
                        type="number"
                        name="numberOfSisters"
                        className="form-control"
                        value={maidForm.numberOfSisters}
                        onChange={handleMaidFormChange}
                        min="0"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows="3"
                        value={maidForm.address}
                        onChange={handleMaidFormChange}
                        placeholder="Full address"
                      />
                      <small className="text-muted">This field is only visible to administrators</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Education Level</label>
                      <select
                        name="educationLevel"
                        className="form-select"
                        value={maidForm.educationLevel}
                        onChange={handleMaidFormChange}
                        required
                      >
                        <option value="">Select Education Level</option>
                        <option value="Elementary">Elementary</option>
                        <option value="High School">High School</option>
                        <option value="College">College</option>
                        <option value="University">University</option>
                        <option value="Vocational">Vocational</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        className="form-control"
                        value={maidForm.nationality}
                        onChange={handleMaidFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Marital Status</label>
                      <select
                        name="maritalStatus"
                        className="form-select"
                        value={maidForm.maritalStatus}
                        onChange={handleMaidFormChange}
                        required
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        className="form-control"
                        value={maidForm.height}
                        onChange={handleMaidFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        className="form-control"
                        value={maidForm.weight}
                        onChange={handleMaidFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">{t('maid.chineseZodiac')}</label>
                      <select
                        name="chineseZodiac"
                        className="form-select"
                        value={maidForm.chineseZodiac}
                        onChange={handleMaidFormChange}
                        required
                      >
                        <option value="">Select Chinese Zodiac</option>
                        <option value="Rat">Rat</option>
                        <option value="Ox">Ox</option>
                        <option value="Tiger">Tiger</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Dragon">Dragon</option>
                        <option value="Snake">Snake</option>
                        <option value="Horse">Horse</option>
                        <option value="Goat">Goat</option>
                        <option value="Monkey">Monkey</option>
                        <option value="Rooster">Rooster</option>
                        <option value="Dog">Dog</option>
                        <option value="Pig">Pig</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Religion</label>
                      <input
                        type="text"
                        name="religion"
                        className="form-control"
                        value={maidForm.religion}
                        onChange={handleMaidFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Horoscope</label>
                      <input
                        type="text"
                        name="horoscope"
                        className="form-control"
                        value={maidForm.horoscope}
                        onChange={handleMaidFormChange}
                        placeholder="e.g., Virgo, Leo"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Work Experience (years)</label>
                      <input
                        type="number"
                        name="workExperience"
                        className="form-control"
                        value={maidForm.workExperience}
                        onChange={handleMaidFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Contact Number</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        className="form-control"
                        value={maidForm.contactNumber}
                        onChange={handleMaidFormChange}
                        placeholder="e.g., +65 9123 4567"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={maidForm.email}
                        onChange={handleMaidFormChange}
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={maidForm.status}
                        onChange={handleMaidFormChange}
                        required
                      >
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="not available">Not Available</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-label mb-0">Skills</label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ width: '150px' }}
                          placeholder="Add new skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewSkill())}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={addNewSkill}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <div className="row g-2">
                        {allSkills.map(skillName => {
                          const skillObj = maidForm.skills.find(s => s.skill === skillName);
                          const isChecked = skillObj ? skillObj.value : false;

                          return (
                            <div key={skillName} className="col-md-6 col-lg-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`skill-${skillName}`}
                                  checked={isChecked}
                                  onChange={(e) => handleSkillChange(skillName, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`skill-${skillName}`}>
                                  {skillName}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="mt-2">
                      <small className="text-muted">Selected skills:</small>
                      <div className="mt-1">
                        {maidForm.skills.filter(skill => skill.value).map((skill, index) => (
                          <span key={index} className="badge bg-info me-1 mb-1">
                            {t(`maid.${skill.skill}`) || skill.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-label mb-0">Languages</label>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={addLanguage}
                      >
                        <i className="bi bi-plus me-1"></i>
                        Add Language
                      </button>
                    </div>

                    <div className="border rounded p-3">
                      {maidForm.languages.length === 0 ? (
                        <p className="text-muted mb-0">No languages added yet. Click "Add Language" to start.</p>
                      ) : (
                        maidForm.languages.map((lang, index) => (
                          <div key={index} className="row g-2 mb-3 align-items-center">
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Language name"
                                value={lang.language}
                                onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex flex-wrap gap-2 align-items-center">
                                {['Poor', 'Fair', 'Good', 'Excellent', 'Native'].map(level => (
                                  <div key={level} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name={`language-level-${index}`}
                                      id={`${level.toLowerCase()}-${index}`}
                                      checked={lang.level === level}
                                      onChange={() => updateLanguage(index, 'level', level)}
                                    />
                                    <label className="form-check-label" htmlFor={`${level.toLowerCase()}-${index}`}>
                                      {level}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="col-md-2">
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeLanguage(index)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Languages Preview */}
                    <div className="mt-2">
                      <small className="text-muted">Languages preview:</small>
                      <div className="mt-1">
                        {maidForm.languages.filter(lang => lang.language.trim()).map((lang, index) => (
                          <span key={index} className="badge bg-secondary me-1 mb-1">
                            {lang.language}: {lang.level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Previous Employment Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <label className="form-label mb-0">Previous Employment</label>
                        <small className="text-muted d-block">
                          Total: {maidForm.previousEmployment.length} employment record{maidForm.previousEmployment.length !== 1 ? 's' : ''}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={addPreviousEmployment}
                      >
                        <i className="bi bi-plus me-1"></i>
                        Add Employment
                      </button>
                    </div>

                    <div className="border rounded p-3">
                      {maidForm.previousEmployment.length === 0 ? (
                        <p className="text-muted mb-0">No previous employment records added yet. Click "Add Employment" to start.</p>
                      ) : (
                        maidForm.previousEmployment.map((emp, index) => (
                          <div key={index} className="card mb-3">
                            <div className="card-header d-flex justify-content-between align-items-center py-2">
                              <small className="text-muted mb-0">Employment #{index + 1}</small>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removePreviousEmployment(index)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Employer Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., ABC Family"
                                    value={emp.employerName}
                                    onChange={(e) => updatePreviousEmployment(index, 'employerName', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Location</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Hong Kong"
                                    value={emp.location}
                                    onChange={(e) => updatePreviousEmployment(index, 'location', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Period</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., 2019-2023"
                                    value={emp.period}
                                    onChange={(e) => updatePreviousEmployment(index, 'period', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Duties</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Childcare and cleaning"
                                    value={emp.duties}
                                    onChange={(e) => updatePreviousEmployment(index, 'duties', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Reason for Leave</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Contract ended"
                                    value={emp.reasonForLeave || ''}
                                    onChange={(e) => updatePreviousEmployment(index, 'reasonForLeave', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">No of Adults</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={emp.noOfAdults || ''}
                                    onChange={(e) => updatePreviousEmployment(index, 'noOfAdults', e.target.value)}
                                    min="0"
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">No of New Born</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={emp.noOfNewBorn || ''}
                                    onChange={(e) => updatePreviousEmployment(index, 'noOfNewBorn', e.target.value)}
                                    min="0"
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">No of Elderly</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={emp.noOfElderly || ''}
                                    onChange={(e) => updatePreviousEmployment(index, 'noOfElderly', e.target.value)}
                                    min="0"
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">No of Children (with Age)</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={emp.noOfChildrenWithAge || ''}
                                    onChange={(e) => updatePreviousEmployment(index, 'noOfChildrenWithAge', e.target.value)}
                                    placeholder="e.g., 2 (ages 3, 7)"
                                  />
                                </div>
                                <div className="col-12">
                                  <label className="form-label">Skills Used</label>
                                  <div className="row g-2">
                                    {allSkills.map(skillName => (
                                      <div key={skillName} className="col-md-4 col-6">
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`emp-${index}-skill-${skillName}`}
                                            checked={emp.skills?.some(skill => skill.skill === skillName) || false}
                                            onChange={(e) => {
                                              const currentSkills = emp.skills || [];
                                              const updatedSkills = e.target.checked
                                                ? [...currentSkills, { skill: skillName, value: true }]
                                                : currentSkills.filter(skill => skill.skill !== skillName);
                                              updatePreviousEmployment(index, 'skills', updatedSkills);
                                            }}
                                          />
                                          <label className="form-check-label" htmlFor={`emp-${index}-skill-${skillName}`}>
                                            {skillName}
                                          </label>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Previous Employment Preview */}
                    <div className="mt-2">
                      <small className="text-muted">Employment preview:</small>
                      <div className="mt-1">
                        {maidForm.previousEmployment.filter(emp => emp.employerName.trim()).map((emp, index) => (
                          <span key={index} className="badge bg-warning text-dark me-1 mb-1">
                            {emp.employerName} ({emp.period})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Special Skills Section */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">Special Skills & Experience</h6>
                    <p className="text-muted mb-3">Please indicate experience and acceptance for each task</p>

                    <div className="row g-2">
                      {[
                        'babyCare', 'changingDiaper', 'feedingMilk', 'babyBathing', 'childCare',
                        'playWithChild', 'tutoringChildren', 'specialNeedCare', 'elderlyCare',
                        'specialCareDisabled', 'handWashClothes', 'cookingChinese', 'shopInMarket',
                        'petsCare', 'gardening'
                      ].map(skillName => {
                        const skill = maidForm.specialSkills.find(s => s.skill === skillName);
                        return (
                          <div key={skillName} className="col-12">
                            <div className="card">
                              <div className="card-body py-2">
                                <div className="row align-items-center">
                                  <div className="col-md-6">
                                    <span className="fw-medium">{skillName}</span>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`${skillName}-experienced`}
                                        checked={skill?.experienced || false}
                                        onChange={(e) => handleSpecialSkillChange(skillName, 'experienced', e.target.checked)}
                                      />
                                      <label className="form-check-label" htmlFor={`${skillName}-experienced`}>
                                        Experienced
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`${skillName}-accepted`}
                                        checked={skill?.accepted || false}
                                        onChange={(e) => handleSpecialSkillChange(skillName, 'accepted', e.target.checked)}
                                      />
                                      <label className="form-check-label" htmlFor={`${skillName}-accepted`}>
                                        Accepted
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">{t('maid.personalInformation')}</h6>
                    <p className="text-muted mb-3">Please answer the following questions</p>

                    <div className="row g-2">
                      {[
                        'eatChineseFood', 'eatWesternFood', 'smoke', 'drinkAlcohol',
                        'acceptSalaryInsteadRest', 'acceptDayOffNotSatSun', 'afraidOfPets',
                        'sufferAllergy', 'willingNotPlayPhone', 'seriousIllness'
                      ].map(questionText => {
                        const info = maidForm.personalInformation.find(i => i.question === questionText);
                        return (
                          <div key={questionText} className="col-12">
                            <div className="card">
                              <div className="card-body py-3">
                                <div className="row align-items-center">
                                  <div className="col-md-8">
                                    <span className="fw-medium">{t(`maid.${questionText}`)}</span>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="d-flex gap-3">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name={`personal-${questionText}`}
                                          id={`${questionText}-yes`}
                                          checked={info?.answer === 'yes'}
                                          onChange={() => handlePersonalInfoChange(questionText, 'yes')}
                                        />
                                        <label className="form-check-label" htmlFor={`${questionText}-yes`}>
                                          Yes
                                        </label>
                                      </div>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name={`personal-${questionText}`}
                                          id={`${questionText}-no`}
                                          checked={info?.answer === 'no'}
                                          onChange={() => handlePersonalInfoChange(questionText, 'no')}
                                        />
                                        <label className="form-check-label" htmlFor={`${questionText}-no`}>
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Profile Photo</label>
                    <input
                      type="file"
                      name="profilePhoto"
                      className="form-control"
                      onChange={handleMaidFormChange}
                      accept="image/*"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={resetMaidForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" form="maidForm" className="btn btn-success">
                  {editingMaid ? 'Update' : 'Add'} Maid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Form Modal */}
      {showCompanyForm && companyInfo && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Company Information</h5>
                <button type="button" className="btn-close" onClick={() => setShowCompanyForm(false)}></button>
              </div>
              <div className="modal-body">
                <form id="companyForm" onSubmit={handleCompanySubmit}>
                  <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={companyInfo.description}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Founded Year</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyInfo.founded}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, founded: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Number of Employees</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyInfo.employees}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, employees: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={companyInfo.contact.phone}
                      onChange={(e) => setCompanyInfo(prev => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={companyInfo.contact.email}
                      onChange={(e) => setCompanyInfo(prev => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyInfo.contact.address}
                      onChange={(e) => setCompanyInfo(prev => ({
                        ...prev,
                        contact: { ...prev.contact, address: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCompanyForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" form="companyForm" className="btn btn-success">
                  Update Company Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maid Detail Modal */}
      {showMaidModal && selectedMaid && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeMaidModal}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  {selectedMaid.name} - {selectedMaid.maidId}
                </h5>
                <button type="button" className="btn-close" onClick={closeMaidModal}></button>
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
                    <div className="mt-2">
                      <span className={`badge fs-6 ${selectedMaid.status === 'available' ? 'bg-success' :
                        selectedMaid.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                        {selectedMaid.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <label className="form-label small text-muted mb-1">Change Status</label>
                      <select
                        className="form-select form-select-sm"
                        value={selectedMaid.status}
                        onChange={(e) => handleQuickStatusChange(e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="not available">Not Available</option>
                      </select>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-person-fill me-2"></i>
                      {t('maid.personalInformation')}
                    </h6>
                    <div className="row g-2 mb-3">
                      <div className="col-sm-6">
                        <strong>{t('maid.name')}:</strong><br />
                        <span className="text-muted">{selectedMaid.name}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.gender')}:</strong><br />
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
                        <strong>{t('maid.chineseZodiac')}:</strong><br />
                        <span className="text-muted">{selectedMaid.chineseZodiac}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.horoscope')}:</strong><br />
                        <span className="text-muted">{selectedMaid.horoscope}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.workExperience')}:</strong><br />
                        <span className="text-muted">{selectedMaid.workExperience} {t('maid.years')}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.dateOfBirth')}:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.dateOfBirth ? new Date(selectedMaid.dateOfBirth).toLocaleDateString() : 'Not specified'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.children')}:</strong><br />
                        <span className="text-muted">{selectedMaid.numberOfChildren || 'Not specified'}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.brothers')}:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.numberOfBrothers !== undefined ? selectedMaid.numberOfBrothers : 'Not specified'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.sisters')}:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.numberOfSisters !== undefined ? selectedMaid.numberOfSisters : 'Not specified'}
                        </span>
                      </div>
                      <div className="col-12">
                        <strong>{t('maid.address')}:</strong><br />
                        <span className="text-muted">{selectedMaid.address || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Contact Information
                    </h6>
                    <div className="row g-2">
                      <div className="col-sm-6">
                        <strong>{t('maid.contactNumber')}:</strong><br />
                        <span className="text-muted">{selectedMaid.contactNumber || 'Not provided'}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>{t('maid.email')}:</strong><br />
                        <span className="text-muted">{selectedMaid.email || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-translate me-2"></i>
                      Languages
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
                      <p className="text-muted">No languages specified</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-tools me-2"></i>
                      Skills & Abilities
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
                      <p className="text-muted">No skills specified</p>
                    )}
                  </div>
                </div>

                {/* Special Skills */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-star-fill me-2"></i>
                      Special Skills & Experience
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
                                    <strong>{t('maid.employer')}:</strong><br />
                                    <span className="text-muted">{emp.employerName || 'Not specified'}</span>
                                  </div>
                                  <div className="col-sm-6">
                                    <strong>{t('maid.location')}:</strong><br />
                                    <span className="text-muted">{emp.location || 'Not specified'}</span>
                                  </div>
                                  <div className="col-sm-6">
                                    <strong>{t('maid.period')}:</strong><br />
                                    <span className="text-muted">{emp.period || 'Not specified'}</span>
                                  </div>
                                  <div className="col-12">
                                    <strong>{t('maid.duties')}:</strong><br />
                                    <span className="text-muted">{emp.duties || 'Not specified'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No previous employment records</p>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-calendar-fill me-2"></i>
                      Record Information
                    </h6>
                    <div className="row g-2">
                      <div className="col-sm-6">
                        <strong>Created Date:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.createdAt ? new Date(selectedMaid.createdAt).toLocaleDateString() : 'Not available'}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Last Updated:</strong><br />
                        <span className="text-muted">
                          {selectedMaid.updatedAt ? new Date(selectedMaid.updatedAt).toLocaleDateString() : 'Not available'}
                        </span>
                      </div>
                    </div>
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
                  onClick={() => handleEditMaid(selectedMaid)}
                  className="btn btn-warning"
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit Maid
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

export default AdminPanel;