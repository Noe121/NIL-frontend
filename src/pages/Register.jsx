import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/config.js';

// Role configuration with hierarchical structure
const ROLE_TYPES = {
  creator: {
    label: 'Creator / Athlete',
    icon: '🏃',
    description: 'Athletes, influencers, and content creators',
    subtypes: {
      student_athlete: {
        label: 'Student-Athlete',
        description: 'High school or college athlete',
        role: 'athlete',
        additionalFields: ['sport', 'school_type']
      },
      professional_athlete: {
        label: 'Professional Athlete',
        description: 'Professional sports player',
        role: 'athlete',
        additionalFields: ['sport', 'league']
      },
      influencer: {
        label: 'Content Creator / Influencer',
        description: 'Social media influencer or content creator',
        role: 'influencer',
        additionalFields: ['platform', 'niche']
      }
    }
  },
  brand: {
    label: 'Brand / Sponsor',
    icon: '🏢',
    description: 'Businesses and sponsors',
    subtypes: {
      local_brand: {
        label: 'Local Business',
        description: 'Local shop, restaurant, or service',
        role: 'sponsor',
        additionalFields: ['business_name', 'industry']
      },
      national_brand: {
        label: 'National Brand',
        description: 'Established national or global brand',
        role: 'sponsor',
        additionalFields: ['company_name', 'industry']
      },
      nil_collective: {
        label: 'NIL Collective',
        description: 'NIL collective or booster organization',
        role: 'sponsor',
        additionalFields: ['collective_name', 'affiliated_school']
      }
    }
  },
  agency: {
    label: 'Agency / Representative',
    icon: '💼',
    description: 'Talent agencies, management, and school staff',
    subtypes: {
      talent_agency: {
        label: 'Talent Agency',
        description: 'Professional talent management agency',
        role: 'agency',
        additionalFields: ['agency_name', 'agency_type']
      },
      management_company: {
        label: 'Management Company',
        description: 'Sports or entertainment management',
        role: 'agency',
        additionalFields: ['company_name', 'specialization']
      },
      family_office: {
        label: 'Family Office / Representative',
        description: 'Family representative or advisor',
        role: 'agency',
        additionalFields: ['office_name']
      },
      school_representative: {
        label: 'School Representative',
        description: 'School administration, compliance, or coaching staff',
        role: 'school_admin',
        requiresVerification: true,
        additionalFields: ['school_name', 'school_type', 'staff_role', 'department']
      },
      platform_admin: {
        label: 'Platform Administrator',
        description: 'NILBx platform oversight and verification',
        role: 'admin',
        requiresVerification: true,
        additionalFields: ['admin_type', 'organization', 'verification_request']
      }
    }
  },
  fan: {
    label: 'Fan / Supporter',
    icon: '⭐',
    description: 'Fans and supporters',
    subtypes: {
      sports_fan: {
        label: 'Sports Fan',
        description: 'Follow and support athletes',
        role: 'fan',
        additionalFields: ['favorite_team', 'favorite_sport']
      },
      general_fan: {
        label: 'General Supporter',
        description: 'General NIL platform user',
        role: 'fan',
        additionalFields: []
      }
    }
  }
};

export default function Register() {
  const [step, setStep] = useState(1); // 1: main type, 2: subtype, 3: details
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    // Additional fields
    name: '',
    sport: '',
    school_type: '',
    league: '',
    platform: '',
    niche: '',
    business_name: '',
    company_name: '',
    industry: '',
    collective_name: '',
    affiliated_school: '',
    agency_name: '',
    agency_type: '',
    specialization: '',
    office_name: '',
    favorite_team: '',
    favorite_sport: '',
    // School representative fields
    school_name: '',
    staff_role: '',
    department: '',
    // Platform admin fields
    admin_type: '',
    organization: '',
    verification_request: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectMainType = (typeKey) => {
    setSelectedType(typeKey);
    setStep(2);
  };

  const selectSubtype = (subtypeKey) => {
    const subtype = ROLE_TYPES[selectedType].subtypes[subtypeKey];
    setSelectedSubtype(subtypeKey);
    setForm({ ...form, role: subtype.role });
    setStep(3);
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedType(null);
    } else if (step === 3) {
      setStep(2);
      setSelectedSubtype(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!form.name) {
      setError('Name is required');
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        email: form.email,
        password: form.password,
        role: form.role,
        name: form.name,
        metadata: {}
      };

      // Add role-specific fields to metadata
      const subtype = ROLE_TYPES[selectedType].subtypes[selectedSubtype];
      if (subtype.additionalFields) {
        subtype.additionalFields.forEach(field => {
          if (form[field]) {
            registrationData.metadata[field] = form[field];
          }
        });
      }

      // Add verification flag if required
      if (subtype.requiresVerification) {
        registrationData.metadata.requiresVerification = true;
        registrationData.metadata.verification_status = 'pending';
      }

      await axios.post(`${config.authServiceUrl}/register`, registrationData);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  // Step 1: Select main type
  if (step === 1) {
    return (
      <div style={{
        maxWidth: 900,
        margin: '2rem auto',
        padding: 20
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join NILBx</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Choose your account type to get started</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {Object.entries(ROLE_TYPES).map(([key, type]) => (
            <button
              key={key}
              onClick={() => selectMainType(key)}
              style={{
                padding: '2rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: 12,
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{type.icon}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {type.label}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>{type.description}</div>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              border: '1px solid #d0d0d0',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Already have an account? Login
          </button>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: 8,
          fontSize: '0.875rem',
          color: '#0369a1'
        }}>
          <strong>Note:</strong> Admin and oversight roles require verification. If you need administrative access,
          please contact us at admin@nilbx.com after registration.
        </div>
      </div>
    );
  }

  // Step 2: Select subtype
  if (step === 2 && selectedType) {
    const mainType = ROLE_TYPES[selectedType];
    return (
      <div style={{
        maxWidth: 800,
        margin: '2rem auto',
        padding: 20
      }}>
        <button
          onClick={goBack}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid #d0d0d0',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{mainType.icon}</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            I'm a {mainType.label}
          </h2>
          <p style={{ color: '#666' }}>Select the option that best describes you</p>
        </div>

        <div style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {Object.entries(mainType.subtypes).map(([key, subtype]) => (
            <button
              key={key}
              onClick={() => selectSubtype(key)}
              style={{
                padding: '1.5rem',
                border: '2px solid #e0e0e0',
                borderRadius: 10,
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = 'white';
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {subtype.label}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>{subtype.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Registration form
  if (step === 3 && selectedType && selectedSubtype) {
    const mainType = ROLE_TYPES[selectedType];
    const subtype = mainType.subtypes[selectedSubtype];

    return (
      <div style={{
        maxWidth: 500,
        margin: '2rem auto',
        padding: 20
      }}>
        <button
          onClick={goBack}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid #d0d0d0',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: 8
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{mainType.icon}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{subtype.label}</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Basic Information</h3>

            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #d0d0d0',
                borderRadius: 6,
                fontSize: '1rem'
              }}
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #d0d0d0',
                borderRadius: 6,
                fontSize: '1rem'
              }}
            />

            <input
              name="password"
              type="password"
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #d0d0d0',
                borderRadius: 6,
                fontSize: '1rem'
              }}
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.75rem',
                border: '1px solid #d0d0d0',
                borderRadius: 6,
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Additional Fields Based on Subtype */}
          {subtype.additionalFields && subtype.additionalFields.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Additional Details</h3>

              {subtype.additionalFields.includes('sport') && (
                <input
                  name="sport"
                  type="text"
                  placeholder="Sport (e.g., Basketball, Football)"
                  value={form.sport}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('school_type') && (
                <select
                  name="school_type"
                  value={form.school_type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select School Level</option>
                  <option value="high_school">High School</option>
                  <option value="college">College / University</option>
                </select>
              )}

              {subtype.additionalFields.includes('league') && (
                <input
                  name="league"
                  type="text"
                  placeholder="League (e.g., NBA, NFL, MLS)"
                  value={form.league}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('platform') && (
                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Primary Platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="multiple">Multiple Platforms</option>
                </select>
              )}

              {subtype.additionalFields.includes('niche') && (
                <input
                  name="niche"
                  type="text"
                  placeholder="Content Niche (e.g., Fitness, Gaming, Lifestyle)"
                  value={form.niche}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('business_name') && (
                <input
                  name="business_name"
                  type="text"
                  placeholder="Business Name"
                  value={form.business_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('company_name') && (
                <input
                  name="company_name"
                  type="text"
                  placeholder="Company Name"
                  value={form.company_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('industry') && (
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Industry</option>
                  <option value="retail">Retail</option>
                  <option value="food_beverage">Food & Beverage</option>
                  <option value="technology">Technology</option>
                  <option value="sports">Sports & Recreation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              )}

              {subtype.additionalFields.includes('collective_name') && (
                <input
                  name="collective_name"
                  type="text"
                  placeholder="Collective Name"
                  value={form.collective_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('affiliated_school') && (
                <input
                  name="affiliated_school"
                  type="text"
                  placeholder="Affiliated School/University"
                  value={form.affiliated_school}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('agency_name') && (
                <input
                  name="agency_name"
                  type="text"
                  placeholder="Agency Name"
                  value={form.agency_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('agency_type') && (
                <select
                  name="agency_type"
                  value={form.agency_type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Agency Type</option>
                  <option value="talent_agency">Talent Agency</option>
                  <option value="nil_collective">NIL Collective</option>
                  <option value="management_company">Management Company</option>
                  <option value="marketing_agency">Marketing Agency</option>
                </select>
              )}

              {subtype.additionalFields.includes('favorite_team') && (
                <input
                  name="favorite_team"
                  type="text"
                  placeholder="Favorite Team (Optional)"
                  value={form.favorite_team}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('favorite_sport') && (
                <input
                  name="favorite_sport"
                  type="text"
                  placeholder="Favorite Sport (Optional)"
                  value={form.favorite_sport}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {/* School Representative Fields */}
              {subtype.additionalFields.includes('school_name') && (
                <input
                  name="school_name"
                  type="text"
                  placeholder="School Name"
                  value={form.school_name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('staff_role') && (
                <select
                  name="staff_role"
                  value={form.staff_role}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Staff Role</option>
                  <option value="athletic_director">Athletic Director</option>
                  <option value="compliance_officer">Compliance Officer</option>
                  <option value="assistant_ad">Assistant Athletic Director</option>
                  <option value="coach">Coach</option>
                  <option value="assistant_coach">Assistant Coach</option>
                  <option value="nil_coordinator">NIL Coordinator</option>
                  <option value="academic_advisor">Academic Advisor</option>
                  <option value="other">Other</option>
                </select>
              )}

              {subtype.additionalFields.includes('department') && (
                <input
                  name="department"
                  type="text"
                  placeholder="Department (e.g., Athletics, Compliance)"
                  value={form.department}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {/* Platform Admin Fields */}
              {subtype.additionalFields.includes('admin_type') && (
                <select
                  name="admin_type"
                  value={form.admin_type}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Admin Type</option>
                  <option value="platform_admin">Platform Administrator</option>
                  <option value="verification_officer">Verification Officer</option>
                  <option value="compliance_monitor">Compliance Monitor</option>
                  <option value="content_moderator">Content Moderator</option>
                  <option value="support_manager">Support Manager</option>
                </select>
              )}

              {subtype.additionalFields.includes('organization') && (
                <input
                  name="organization"
                  type="text"
                  placeholder="Organization (e.g., NILBx, NCAA)"
                  value={form.organization}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem'
                  }}
                />
              )}

              {subtype.additionalFields.includes('verification_request') && (
                <textarea
                  name="verification_request"
                  placeholder="Please explain why you need administrative access and provide any relevant credentials or references..."
                  value={form.verification_request}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #d0d0d0',
                    borderRadius: 6,
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              )}
            </div>
          )}

          {/* Verification Notice */}
          {subtype.requiresVerification && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: 8,
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: 0, color: '#856404', fontSize: '0.95rem' }}>
                <strong>⚠️ Verification Required:</strong> Your account will be created in a pending state and require manual verification by our team before you can access administrative features. You will receive an email once your account has been reviewed.
              </p>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Create Account
          </button>
        </form>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: 8,
            marginTop: '1rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: 8,
            marginTop: '1rem'
          }}>
            Registration successful! Redirecting to login...
          </div>
        )}

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          By registering, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    );
  }

  return null;
}
