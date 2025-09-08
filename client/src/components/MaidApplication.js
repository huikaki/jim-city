import React, { useState } from 'react';
import axios from 'axios';

function MaidApplication() {
  const [language, setLanguage] = useState('en'); // 'en' for English, 'id' for Indonesian
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
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
    profilePhoto: null
  });

  // Translation object
  const translations = {
    en: {
      title: 'Maid Application Form',
      subtitle: 'Apply to join our professional maid service team',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      dateOfBirth: 'Date of Birth',
      numberOfChildren: 'Number of Children/Ages',
      numberOfBrothers: 'Number of Brothers',
      numberOfSisters: 'Number of Sisters',
      address: 'Address',
      educationLevel: 'Education Level',
      selectEducation: 'Select Education Level',
      elementary: 'Elementary',
      highSchool: 'High School',
      college: 'College',
      university: 'University',
      vocational: 'Vocational',
      other: 'Other',
      nationality: 'Nationality',
      maritalStatus: 'Marital Status',
      single: 'Single',
      married: 'Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      chineseZodiac: 'Chinese Zodiac',
      selectZodiac: 'Select Chinese Zodiac',
      rat: 'Rat',
      ox: 'Ox',
      tiger: 'Tiger',
      rabbit: 'Rabbit',
      dragon: 'Dragon',
      snake: 'Snake',
      horse: 'Horse',
      goat: 'Goat',
      monkey: 'Monkey',
      rooster: 'Rooster',
      dog: 'Dog',
      pig: 'Pig',
      religion: 'Religion',
      horoscope: 'Horoscope',
      workExperience: 'Work Experience (years)',
      contactNumber: 'Contact Number',
      email: 'Email Address',
      skills: 'Skills',
      skillsDesc: 'Select your skills (check all that apply)',
      babySitting: 'Baby Sitting',
      cooking: 'Cooking',
      cleaning: 'Cleaning',
      elderCare: 'Elder Care',
      petCare: 'Pet Care',
      ironing: 'Ironing',
      gardening: 'Gardening',
      languages: 'Languages',
      languagesDesc: 'Languages you can speak',
      addLanguage: 'Add Language',
      languageName: 'Language name',
      proficiency: 'Proficiency',
      poor: 'Poor',
      fair: 'Fair',
      good: 'Good',
      excellent: 'Excellent',
      native: 'Native',
      remove: 'Remove',
      previousEmployment: 'Previous Employment',
      employmentDesc: 'Your previous work experience',
      addEmployment: 'Add Employment',
      employerName: 'Employer Name',
      location: 'Location',
      period: 'Period',
      duties: 'Duties',
      employmentSkills: 'Skills',
      reasonForLeave: 'Reason for Leave',
      noOfAdults: 'Number of Adults',
      noOfNewBorn: 'Number of New Born',
      noOfElderly: 'Number of Elderly',
      noOfChildrenWithAge: 'Number of Children (with Age)',
      specialSkillsTitle: 'Personal In-Depth Information and Special Skills',
      specialSkillsDesc: 'Please indicate your experience and acceptance for each task',
      experienced: 'Experienced',
      accepted: 'Accepted',
      babyCare: 'Baby Care (0-12 months)',
      changingDiaper: 'Changing Diaper',
      feedingMilk: 'Feeding Milk to Baby',
      babyBathing: 'Baby Bathing',
      childCare: 'Child Care (over 3 years)',
      playWithChild: 'Playing with the Children',
      tutoringChildren: 'Tutoring the Children ',
      specialNeedCare: 'Special Care of Abnormal Children',
      elderlyCare: 'Elderly Care',
      specialCareDisabled: 'Special Care of Disabled Elderly',
      handWashClothes: 'Hand Wash Clothes',
      cookingChinese: 'Cooking Chinese Food ',
      shopInMarket: 'Marketing',
      petsCare: 'Pets Care',
      gardening: 'Gardening',
      personalInfoTitle: 'Personal Information',
      personalInfoDesc: 'Please answer the following questions',
      eatChineseFood: 'Do You Eat Chinese Food?',
      eatWesternFood: 'Do You Eat Western Food?',
      smoke: 'Do You Smoke?',
      drinkAlcohol: 'Do You Drink Alcohol?',
      acceptSalaryInsteadRest: 'Do You Accept the Salary Instead of the Rest Day?',
      acceptDayOffNotWeekend: 'Do You Accept Your Day Off is NOT on Sat or Sun?',
      afraidOfPets: 'Are you afraid of dog or any pets?',
      sufferAllergy: 'Do you suffer from any allergy, if so, what is it?',
      willingNotPlayPhone: 'Are you willing NOT playing cell phone during work?',
      seriousIllness: 'Have you suffered from any serious illness before?',
      yes: 'Yes',
      no: 'No',
      profilePhoto: 'Profile Photo',
      photoDesc: 'Upload your profile photo (optional)',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      successTitle: 'Application Submitted Successfully!',
      successMessage: 'Thank you for your application. We will review it and contact you soon.',
      backToHome: 'Back to Home',
      required: 'This field is required',
      switchLanguage: 'Bahasa Indonesia'
    },
    id: {
      title: 'Formulir Aplikasi Pembantu',
      subtitle: 'Daftar untuk bergabung dengan tim layanan pembantu profesional kami',
      personalInfo: 'Informasi Pribadi',
      name: 'Nama Lengkap',
      gender: 'Jenis Kelamin',
      male: 'Laki-laki',
      female: 'Perempuan',
      dateOfBirth: 'Tanggal Lahir',
      numberOfChildren: 'Jumlah Anak/Usia',
      numberOfBrothers: 'Jumlah Saudara Laki-laki',
      numberOfSisters: 'Jumlah Saudara Perempuan',
      address: 'Alamat',
      educationLevel: 'Tingkat Pendidikan',
      selectEducation: 'Pilih Tingkat Pendidikan',
      elementary: 'SD',
      highSchool: 'SMA',
      college: 'Diploma',
      university: 'Universitas',
      vocational: 'Kejuruan',
      other: 'Lainnya',
      nationality: 'Kewarganegaraan',
      maritalStatus: 'Status Pernikahan',
      single: 'Lajang',
      married: 'Menikah',
      divorced: 'Bercerai',
      widowed: 'Janda/Duda',
      height: 'Tinggi Badan (cm)',
      weight: 'Berat Badan (kg)',
      chineseZodiac: 'Shio Cina',
      selectZodiac: 'Pilih Shio Cina',
      rat: 'Tikus',
      ox: 'Kerbau',
      tiger: 'Harimau',
      rabbit: 'Kelinci',
      dragon: 'Naga',
      snake: 'Ular',
      horse: 'Kuda',
      goat: 'Kambing',
      monkey: 'Monyet',
      rooster: 'Ayam',
      dog: 'Anjing',
      pig: 'Babi',
      religion: 'Agama',
      horoscope: 'Horoskop',
      workExperience: 'Pengalaman Kerja (tahun)',
      contactNumber: 'Nomor Kontak',
      email: 'Alamat Email',
      skills: 'Keahlian',
      skillsDesc: 'Pilih keahlian Anda (centang semua yang sesuai)',
      babySitting: 'Mengasuh Anak',
      cooking: 'Memasak',
      cleaning: 'Membersihkan',
      elderCare: 'Merawat Lansia',
      petCare: 'Merawat Hewan',
      ironing: 'Menyetrika',
      gardening: 'Berkebun',
      languages: 'Bahasa',
      languagesDesc: 'Bahasa yang bisa Anda gunakan',
      addLanguage: 'Tambah Bahasa',
      languageName: 'Nama bahasa',
      proficiency: 'Kemampuan',
      poor: 'Kurang',
      fair: 'Cukup',
      good: 'Baik',
      excellent: 'Sangat Baik',
      native: 'Asli',
      remove: 'Hapus',
      previousEmployment: 'Pekerjaan Sebelumnya',
      employmentDesc: 'Pengalaman kerja sebelumnya',
      addEmployment: 'Tambah Pekerjaan',
      employerName: 'Nama Majikan',
      location: 'Lokasi',
      period: 'Periode',
      duties: 'Tugas',
      employmentSkills: 'Keahlian',
      reasonForLeave: 'Alasan Berhenti',
      noOfAdults: 'Jumlah Dewasa',
      noOfNewBorn: 'Jumlah Bayi Baru Lahir',
      noOfElderly: 'Jumlah Lansia',
      noOfChildrenWithAge: 'Jumlah Anak (dengan Usia)',
      specialSkillsTitle: 'Informasi Pribadi Mendalam dan Keahlian Khusus',
      specialSkillsDesc: 'Silakan tunjukkan pengalaman dan penerimaan Anda untuk setiap tugas',
      experienced: 'Berpengalaman',
      accepted: 'Diterima',
      babyCare: 'Perawatan Bayi (0-12 bulan)',
      changingDiaper: 'Mengganti Popok',
      feedingMilk: 'Memberi Susu pada Bayi',
      babyBathing: 'Memandikan Bayi',
      childCare: 'Perawatan Anak (di atas 3 tahun)',
      playWithChild: 'Bermain dengan Anak-anak',
      tutoringChildren: 'Mengajar Anak-anak',
      specialNeedCare: 'Perawatan Khusus Anak Berkebutuhan Khusus',
      elderlyCare: 'Perawatan Lansia',
      specialCareDisabled: 'Perawatan Khusus Lansia Disabilitas',
      handWashClothes: 'Mencuci Pakaian dengan Tangan',
      cookingChinese: 'Memasak Makanan Cina',
      shopInMarket: 'Berbelanja di Pasar',
      petsCare: 'Perawatan Hewan Peliharaan',
      gardening: 'Berkebun',
      personalInfoTitle: 'Informasi Pribadi',
      personalInfoDesc: 'Silakan jawab pertanyaan berikut',
      eatChineseFood: 'Apakah Anda Makan Makanan Cina?',
      eatWesternFood: 'Apakah Anda Makan Makanan Barat?',
      smoke: 'Apakah Anda Merokok?',
      drinkAlcohol: 'Apakah Anda Minum Alkohol?',
      acceptSalaryInsteadRest: 'Apakah Anda Menerima Gaji Sebagai Pengganti Hari Libur?',
      acceptDayOffNotWeekend: 'Apakah Anda Menerima Hari Libur BUKAN di Sabtu atau Minggu?',
      afraidOfPets: 'Apakah Anda takut pada anjing atau hewan peliharaan?',
      sufferAllergy: 'Apakah Anda menderita alergi, jika ya, apa itu?',
      willingNotPlayPhone: 'Apakah Anda bersedia TIDAK bermain ponsel saat bekerja?',
      seriousIllness: 'Apakah Anda pernah menderita penyakit serius sebelumnya?',
      yes: 'Ya',
      no: 'Tidak',
      profilePhoto: 'Foto Profil',
      photoDesc: 'Unggah foto profil Anda (opsional)',
      submit: 'Kirim Aplikasi',
      submitting: 'Mengirim...',
      successTitle: 'Aplikasi Berhasil Dikirim!',
      successMessage: 'Terima kasih atas aplikasi Anda. Kami akan meninjau dan menghubungi Anda segera.',
      backToHome: 'Kembali ke Beranda',
      required: 'Bidang ini wajib diisi',
      switchLanguage: 'English'
    }
  };

  const t = translations[language];

  const availableSkills = [
    'babySitting',
    'cooking',
    'cleaning',
    'elderCare',
    'petCare',
    'ironing',
    'gardening'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillChange = (skillKey, checked) => {
    setFormData(prev => ({
      ...prev,
      skills: checked
        ? [...prev.skills, { skill: t[skillKey], value: true }]
        : prev.skills.filter(skill => skill.skill !== t[skillKey])
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', level: 'Good' }]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addPreviousEmployment = () => {
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      previousEmployment: prev.previousEmployment.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      )
    }));
  };

  const removePreviousEmployment = (index) => {
    setFormData(prev => ({
      ...prev,
      previousEmployment: prev.previousEmployment.filter((_, i) => i !== index)
    }));
  };

  // Special Skills handlers
  const handleSpecialSkillChange = (skillKey, field, value) => {
    setFormData(prev => {
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
    setFormData(prev => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');

    // Basic validation
    if (!formData.name.trim()) {
      alert(language === 'en' ? 'Please enter your name' : 'Silakan masukkan nama Anda');
      return;
    }

    if (!formData.educationLevel) {
      alert(language === 'en' ? 'Please select your education level' : 'Silakan pilih tingkat pendidikan Anda');
      return;
    }

    if (!formData.nationality.trim()) {
      alert(language === 'en' ? 'Please enter your nationality' : 'Silakan masukkan kewarganegaraan Anda');
      return;
    }

    if (!formData.height || formData.height < 100 || formData.height > 250) {
      alert(language === 'en' ? 'Please enter a valid height (100-250 cm)' : 'Silakan masukkan tinggi badan yang valid (100-250 cm)');
      return;
    }

    if (!formData.weight || formData.weight < 30 || formData.weight > 200) {
      alert(language === 'en' ? 'Please enter a valid weight (30-200 kg)' : 'Silakan masukkan berat badan yang valid (30-200 kg)');
      return;
    }

    if (!formData.chineseZodiac) {
      alert(language === 'en' ? 'Please select your Chinese zodiac' : 'Silakan pilih shio Cina Anda');
      return;
    }

    if (!formData.religion.trim()) {
      alert(language === 'en' ? 'Please enter your religion' : 'Silakan masukkan agama Anda');
      return;
    }

    if (!formData.horoscope.trim()) {
      alert(language === 'en' ? 'Please enter your horoscope' : 'Silakan masukkan horoskop Anda');
      return;
    }

    if (!formData.workExperience || formData.workExperience < 0) {
      alert(language === 'en' ? 'Please enter your work experience (0 or more years)' : 'Silakan masukkan pengalaman kerja Anda (0 tahun atau lebih)');
      return;
    }

    if (!formData.contactNumber.trim()) {
      alert(language === 'en' ? 'Please enter your contact number' : 'Silakan masukkan nomor kontak Anda');
      return;
    }

    if (!formData.email.trim()) {
      alert(language === 'en' ? 'Please enter your email address' : 'Silakan masukkan alamat email Anda');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(language === 'en' ? 'Please enter a valid email address' : 'Silakan masukkan alamat email yang valid');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'languages' || key === 'previousEmployment' || key === 'specialSkills' || key === 'personalInformation') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profilePhoto' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'profilePhoto') {
          submitData.append(key, formData[key]);
        }
      });

      // Debug: Log what we're sending
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      // Note: Status will be automatically set to 'pending' by the server
      console.log('Submitting application data:', {
        name: formData.name,
        nationality: formData.nationality,
        educationLevel: formData.educationLevel,
        skillsCount: formData.skills.length,
        languagesCount: formData.languages.length,
        employmentCount: formData.previousEmployment.length
      });

      const response = await axios.post('/api/maids/apply', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Application submitted successfully:', response.data);

      setError(''); // Clear any previous errors
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);

      let errorMessage;
      if (error.response?.data?.details) {
        errorMessage = language === 'en'
          ? `Error: ${error.response.data.details}`
          : `Kesalahan: ${error.response.data.details}`;
      } else if (error.response?.data?.error) {
        errorMessage = language === 'en'
          ? `Error: ${error.response.data.error}`
          : `Kesalahan: ${error.response.data.error}`;
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = language === 'en'
          ? 'Network error. Please check your internet connection and try again.'
          : 'Kesalahan jaringan. Periksa koneksi internet Anda dan coba lagi.';
      } else {
        errorMessage = language === 'en'
          ? 'Error submitting application. Please try again.'
          : 'Terjadi kesalahan saat mengirim aplikasi. Silakan coba lagi.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card mt-5">
              <div className="card-body text-center py-5">
                <i className="bi bi-check-circle-fill text-success display-1 mb-4"></i>
                <h2 className="text-success mb-3">{t.successTitle}</h2>
                <p className="text-muted mb-4">{t.successMessage}</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn btn-primary"
                >
                  <i className="bi bi-house me-1"></i>
                  {t.backToHome}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card mt-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">{t.title}</h2>
                  <p className="text-muted mb-0">{t.subtitle}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                >
                  <i className="bi bi-translate me-1"></i>
                  {t.switchLanguage}
                </button>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h4 className="mb-3">{t.personalInfo}</h4>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">{t.name} *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.gender} *</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Female">{t.female}</option>
                      <option value="Male">{t.male}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.educationLevel} *</label>
                    <select
                      name="educationLevel"
                      className="form-select"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t.selectEducation}</option>
                      <option value="Elementary">{t.elementary}</option>
                      <option value="High School">{t.highSchool}</option>
                      <option value="College">{t.college}</option>
                      <option value="University">{t.university}</option>
                      <option value="Vocational">{t.vocational}</option>
                      <option value="Other">{t.other}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.nationality} *</label>
                    <input
                      type="text"
                      name="nationality"
                      className="form-control"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.maritalStatus} *</label>
                    <select
                      name="maritalStatus"
                      className="form-select"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Single">{t.single}</option>
                      <option value="Married">{t.married}</option>
                      <option value="Divorced">{t.divorced}</option>
                      <option value="Widowed">{t.widowed}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.height} *</label>
                    <input
                      type="number"
                      name="height"
                      className="form-control"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.weight} *</label>
                    <input
                      type="number"
                      name="weight"
                      className="form-control"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.chineseZodiac} *</label>
                    <select
                      name="chineseZodiac"
                      className="form-select"
                      value={formData.chineseZodiac}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t.selectZodiac}</option>
                      <option value="Rat">{t.rat}</option>
                      <option value="Ox">{t.ox}</option>
                      <option value="Tiger">{t.tiger}</option>
                      <option value="Rabbit">{t.rabbit}</option>
                      <option value="Dragon">{t.dragon}</option>
                      <option value="Snake">{t.snake}</option>
                      <option value="Horse">{t.horse}</option>
                      <option value="Goat">{t.goat}</option>
                      <option value="Monkey">{t.monkey}</option>
                      <option value="Rooster">{t.rooster}</option>
                      <option value="Dog">{t.dog}</option>
                      <option value="Pig">{t.pig}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.religion} *</label>
                    <input
                      type="text"
                      name="religion"
                      className="form-control"
                      value={formData.religion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.horoscope} *</label>
                    <input
                      type="text"
                      name="horoscope"
                      className="form-control"
                      value={formData.horoscope}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.workExperience} *</label>
                    <input
                      type="number"
                      name="workExperience"
                      className="form-control"
                      value={formData.workExperience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.contactNumber} *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      className="form-control"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'e.g., +65 9123 4567' : 'contoh: +65 9123 4567'}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.email} *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'your.email@example.com' : 'email.anda@contoh.com'}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.dateOfBirth}</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.numberOfChildren}</label>
                    <input
                      type="text"
                      name="numberOfChildren"
                      className="form-control"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'e.g., 2 children (ages 5, 8)' : 'contoh: 2 anak (usia 5, 8)'}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.numberOfBrothers}</label>
                    <input
                      type="number"
                      name="numberOfBrothers"
                      className="form-control"
                      value={formData.numberOfBrothers}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t.numberOfSisters}</label>
                    <input
                      type="number"
                      name="numberOfSisters"
                      className="form-control"
                      value={formData.numberOfSisters}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t.address}</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Full address' : 'Alamat lengkap'}
                    />
                    <small className="text-muted">{language === 'en' ? 'This field is only visible to administrators' : 'Bidang ini hanya terlihat oleh administrator'}</small>
                  </div>
                </div>

                {/* Skills Section */}
                <h4 className="mb-3">{t.skills}</h4>
                <p className="text-muted mb-3">{t.skillsDesc}</p>

                <div className="row g-3 mb-4">
                  {availableSkills.map(skillKey => (
                    <div key={skillKey} className="col-md-6 col-lg-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`skill-${skillKey}`}
                          checked={formData.skills.some(skill => skill.skill === t[skillKey])}
                          onChange={(e) => handleSkillChange(skillKey, e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor={`skill-${skillKey}`}>
                          {t[skillKey]}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Languages Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">{t.languages}</h4>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addLanguage}
                    >
                      <i className="bi bi-plus me-1"></i>
                      {t.addLanguage}
                    </button>
                  </div>
                  <p className="text-muted mb-3">{t.languagesDesc}</p>

                  {formData.languages.length === 0 ? (
                    <p className="text-muted">{language === 'en' ? 'No languages added yet.' : 'Belum ada bahasa yang ditambahkan.'}</p>
                  ) : (
                    formData.languages.map((lang, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-body">
                          <div className="row g-3 align-items-center">
                            <div className="col-md-4">
                              <label className="form-label">{t.languageName}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={lang.language}
                                onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">{t.proficiency}</label>
                              <select
                                className="form-select"
                                value={lang.level}
                                onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                              >
                                <option value="Poor">{t.poor}</option>
                                <option value="Fair">{t.fair}</option>
                                <option value="Good">{t.good}</option>
                                <option value="Excellent">{t.excellent}</option>
                                <option value="Native">{t.native}</option>
                              </select>
                            </div>
                            <div className="col-md-2">
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeLanguage(index)}
                              >
                                <i className="bi bi-trash"></i>
                                <span className="d-none d-md-inline ms-1">{t.remove}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Previous Employment Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">{t.previousEmployment}</h4>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addPreviousEmployment}
                    >
                      <i className="bi bi-plus me-1"></i>
                      {t.addEmployment}
                    </button>
                  </div>
                  <p className="text-muted mb-3">{t.employmentDesc}</p>

                  {formData.previousEmployment.length === 0 ? (
                    <p className="text-muted">{language === 'en' ? 'No previous employment added yet.' : 'Belum ada pekerjaan sebelumnya yang ditambahkan.'}</p>
                  ) : (
                    formData.previousEmployment.map((emp, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center py-2">
                          <small className="text-muted mb-0">
                            {language === 'en' ? `Employment #${index + 1}` : `Pekerjaan #${index + 1}`}
                          </small>
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
                              <label className="form-label">{t.employerName}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={emp.employerName}
                                onChange={(e) => updatePreviousEmployment(index, 'employerName', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">{t.location}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={emp.location}
                                onChange={(e) => updatePreviousEmployment(index, 'location', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">{t.period}</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={language === 'en' ? 'e.g., 2019-2023' : 'contoh: 2019-2023'}
                                value={emp.period}
                                onChange={(e) => updatePreviousEmployment(index, 'period', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">{t.duties}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={emp.duties}
                                onChange={(e) => updatePreviousEmployment(index, 'duties', e.target.value)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">{t.reasonForLeave}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={emp.reasonForLeave || ''}
                                onChange={(e) => updatePreviousEmployment(index, 'reasonForLeave', e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">{t.noOfAdults}</label>
                              <input
                                type="number"
                                className="form-control"
                                value={emp.noOfAdults || ''}
                                onChange={(e) => updatePreviousEmployment(index, 'noOfAdults', e.target.value)}
                                min="0"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">{t.noOfNewBorn}</label>
                              <input
                                type="number"
                                className="form-control"
                                value={emp.noOfNewBorn || ''}
                                onChange={(e) => updatePreviousEmployment(index, 'noOfNewBorn', e.target.value)}
                                min="0"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">{t.noOfElderly}</label>
                              <input
                                type="number"
                                className="form-control"
                                value={emp.noOfElderly || ''}
                                onChange={(e) => updatePreviousEmployment(index, 'noOfElderly', e.target.value)}
                                min="0"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">{t.noOfChildrenWithAge}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={emp.noOfChildrenWithAge || ''}
                                onChange={(e) => updatePreviousEmployment(index, 'noOfChildrenWithAge', e.target.value)}
                                placeholder={language === 'en' ? 'e.g., 2 (ages 3, 7)' : 'contoh: 2 (usia 3, 7)'}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">{t.employmentSkills}</label>
                              <div className="row g-2">
                                {availableSkills.map(skillKey => (
                                  <div key={skillKey} className="col-md-4 col-6">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`emp-${index}-skill-${skillKey}`}
                                        checked={emp.skills?.some(skill => skill.skill === t[skillKey]) || false}
                                        onChange={(e) => {
                                          const currentSkills = emp.skills || [];
                                          const updatedSkills = e.target.checked
                                            ? [...currentSkills, { skill: t[skillKey], value: true }]
                                            : currentSkills.filter(skill => skill.skill !== t[skillKey]);
                                          updatePreviousEmployment(index, 'skills', updatedSkills);
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor={`emp-${index}-skill-${skillKey}`}>
                                        {t[skillKey]}
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

                {/* Special Skills Section */}
                <div className="mb-4">
                  <h4 className="mb-3">{t.specialSkillsTitle}</h4>
                  <p className="text-muted mb-3">{t.specialSkillsDesc}</p>

                  <div className="row g-3">
                    {[
                      'babyCare', 'changingDiaper', 'feedingMilk', 'babyBathing', 'childCare',
                      'playWithChild', 'tutoringChildren', 'specialNeedCare', 'elderlyCare',
                      'specialCareDisabled', 'handWashClothes', 'cookingChinese', 'shopInMarket',
                      'petsCare', 'gardening'
                    ].map(skillKey => {
                      const skill = formData.specialSkills.find(s => s.skill === skillKey);
                      return (
                        <div key={skillKey} className="col-12">
                          <div className="card">
                            <div className="card-body py-2">
                              <div className="row align-items-center">
                                <div className="col-md-6">
                                  <span className="fw-medium">{t[skillKey]}</span>
                                </div>
                                <div className="col-md-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`${skillKey}-experienced`}
                                      checked={skill?.experienced || false}
                                      onChange={(e) => handleSpecialSkillChange(skillKey, 'experienced', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor={`${skillKey}-experienced`}>
                                      {t.experienced}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`${skillKey}-accepted`}
                                      checked={skill?.accepted || false}
                                      onChange={(e) => handleSpecialSkillChange(skillKey, 'accepted', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor={`${skillKey}-accepted`}>
                                      {t.accepted}
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
                  <h4 className="mb-3">{t.personalInfoTitle}</h4>
                  <p className="text-muted mb-3">{t.personalInfoDesc}</p>

                  <div className="row g-3">
                    {[
                      'eatChineseFood', 'eatWesternFood', 'smoke', 'drinkAlcohol',
                      'acceptSalaryInsteadRest', 'acceptDayOffNotWeekend', 'afraidOfPets',
                      'sufferAllergy', 'willingNotPlayPhone', 'seriousIllness'
                    ].map(questionKey => {
                      const info = formData.personalInformation.find(i => i.question === questionKey);
                      return (
                        <div key={questionKey} className="col-12">
                          <div className="card">
                            <div className="card-body py-3">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <span className="fw-medium">{t[questionKey]}</span>
                                </div>
                                <div className="col-md-4">
                                  <div className="d-flex gap-3">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`personal-${questionKey}`}
                                        id={`${questionKey}-yes`}
                                        checked={info?.answer === 'yes'}
                                        onChange={() => handlePersonalInfoChange(questionKey, 'yes')}
                                      />
                                      <label className="form-check-label" htmlFor={`${questionKey}-yes`}>
                                        {t.yes}
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`personal-${questionKey}`}
                                        id={`${questionKey}-no`}
                                        checked={info?.answer === 'no'}
                                        onChange={() => handlePersonalInfoChange(questionKey, 'no')}
                                      />
                                      <label className="form-check-label" htmlFor={`${questionKey}-no`}>
                                        {t.no}
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

                {/* Profile Photo */}
                <div className="mb-4">
                  <label className="form-label">{t.profilePhoto}</label>
                  <input
                    type="file"
                    name="profilePhoto"
                    className="form-control"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <small className="text-muted">{t.photoDesc}</small>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i>
                        {t.submit}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaidApplication;