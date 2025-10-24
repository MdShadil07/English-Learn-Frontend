import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import BasicHeader from '@/components/layout/BasicHeader';
import Footer from '../../components/Landing Page Component/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  User,
  MapPin,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Link as LinkIcon,
  Save,
  Camera,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  BookOpen,
  Target,
  Globe,
  Building,
  Star,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import ImageCropModal from '../../components/Edit Profile/ImageCropModel';

// Types based on backend Profile model
interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
  description?: string;
  isCurrentlyEnrolled: boolean;
  educationLevel: 'high-school' | 'associate-degree' | 'bachelors-degree' | 'masters-degree' | 'phd' | 'certificate' | 'diploma' | 'other';
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
  isVerified: boolean;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  portfolio?: string;
  other?: string;
}

interface EditProfileData {
  // Basic Information
  full_name: string;
  avatar_url?: string;
  bio: string;
  isPremium?: boolean;

  // Contact Information
  location: string;
  phone: string;
  address: string;

  // Personal Information
  personalInfo: {
    dateOfBirth?: string;
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    nationality: string;
    languages: Array<{
      language: string;
      proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }>;
  };

  // Role and Experience
  role: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  field: string;

  // Learning Goals and Interests
  goals: string[];
  interests: string[];

  // Professional Information (for professionals, teachers, etc.)
  professionalInfo: {
    company: string;
    position: string;
    experienceYears?: number;
    industry: string;
    skills: string[];
    interests: string[];
    careerGoals: string;
  };

  // Educational Information
  education: Education[];

  // Certifications
  certifications: Certification[];

  // Social Links
  socialLinks: SocialLinks;

  // Learning Preferences
  learningPreferences: {
    preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing' | 'mixed';
    dailyLearningGoal: number;
    weeklyLearningGoal: number;
    targetEnglishLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native';
    focusAreas: string[];
  };

  // Privacy Settings
  privacySettings: {
    profileVisibility: 'public' | 'friends-only' | 'private';
    showContactInfo: boolean;
    showEducation: boolean;
    showCertifications: boolean;
    showAchievements: boolean;
  };
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Reset input value to allow selecting the same file again
    (event.target as HTMLInputElement).value = '';
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setUploadingPhoto(true);
    try {
      // Convert blob to File for upload
      const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('photo', croppedFile);

      // Upload to server endpoint (secure server-side upload)
      const response = await api.profile.uploadPhoto(formData);

      if (!response.success) {
        throw new Error(response.error || 'Upload failed');
      }

      // Update local state with server response URL
      updateFormData('avatar_url', response.data.url);
      setCurrentAvatarUrl(response.data.url);

      // Close modal and cleanup
      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

      toast({
        title: "Photo Updated Successfully! ",
        description: "Your profile photo has been cropped and uploaded to cloud storage.",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);

      // Close modal and cleanup on error too
      setShowCropModal(false);
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage('');

      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo to cloud storage",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (currentAvatarUrl && currentAvatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentAvatarUrl);
      }
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [currentAvatarUrl, selectedImage]); // Clean up both blob URLs

  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('basic');

  const [formData, setFormData] = useState<EditProfileData>({
    full_name: '',
    avatar_url: '',
    bio: '',
    isPremium: false,
    location: '',
    phone: '',
    address: '',
    personalInfo: {
      gender: 'prefer-not-to-say',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      nationality: '',
      languages: []
    },
    role: 'student',
    experienceLevel: 'beginner',
    field: '',
    goals: [],
    interests: [],
    professionalInfo: {
      company: '',
      position: '',
      industry: '',
      skills: [],
      interests: [],
      careerGoals: ''
    },
    education: [],
    certifications: [],
    socialLinks: {},
    learningPreferences: {
      preferredLearningStyle: 'mixed',
      dailyLearningGoal: 30,
      weeklyLearningGoal: 210,
      targetEnglishLevel: 'intermediate',
      focusAreas: []
    },
    privacySettings: {
      profileVisibility: 'public',
      showContactInfo: false,
      showEducation: true,
      showCertifications: true,
      showAchievements: true
    }
  });

  // Load existing profile data
  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.profile.get();
        if (response.success && response.data) {
          const profileData = response.data;

          // Handle both real and demo data formats
          setFormData({
            full_name: profileData.fullName || profileData.full_name || '',
            avatar_url: profileData.avatar_url || '',
            bio: profileData.bio || '',
            isPremium: profileData.isPremium || false,
            location: profileData.location || '',
            phone: profileData.phone || '', // Load phone from top level
            address: profileData.address || '', // Load address from top level
            personalInfo: {
              ...formData.personalInfo,
              nationality: profileData.personalInfo?.nationality || '',
              dateOfBirth: profileData.personalInfo?.dateOfBirth || '',
              gender: profileData.personalInfo?.gender || 'prefer-not-to-say',
              languages: profileData.personalInfo?.languages || []
            },
            role: profileData.role || 'student',
            experienceLevel: profileData.experienceLevel || 'beginner',
            field: profileData.field || '',
            goals: profileData.goals || [],
            interests: profileData.interests || [],
            professionalInfo: profileData.professionalInfo || formData.professionalInfo,
            education: profileData.educationalQualifications?.map((edu: any) => ({
              ...edu,
              startYear: edu.startYear,
              endYear: edu.endYear === 'Present' ? null : edu.endYear,
              isCurrentlyEnrolled: edu.isCurrentlyEnrolled || false
            })) || [],
            certifications: profileData.certifications || [],
            socialLinks: profileData.socialHandles || profileData.socialLinks || {},
            learningPreferences: {
              ...formData.learningPreferences,
              focusAreas: profileData.learningPreferences?.focusAreas || []
            },
            privacySettings: {
              ...formData.privacySettings
            }
          });

          // Set current avatar URL for blob URL management
          if (profileData.avatar_url) {
            // Check if it's a blob URL that might be invalid
            if (profileData.avatar_url.startsWith('blob:')) {
              // Test if the blob URL is still valid by trying to load it
              const img = new Image();
              img.onload = () => {
                setCurrentAvatarUrl(profileData.avatar_url);
              };
              img.onerror = async () => {
                // Blob URL is invalid, clear it from database
                console.warn('Invalid blob URL detected, clearing from database');
                try {
                  const token = localStorage.getItem('token');
                  if (token) {
                    await api.profile.update({ avatar_url: null });
                  }
                } catch (error) {
                  console.error('Failed to clear invalid avatar URL:', error);
                }
                updateFormData('avatar_url', '');
              };
              img.src = profileData.avatar_url;
            } else {
              setCurrentAvatarUrl(profileData.avatar_url);
            }
          } else {
            // Fallback to default avatar URL if none is provided
            setCurrentAvatarUrl('/default-avatar.jpg');
          }
        }
      } else {
        // Fallback to default avatar URL if no profile data
        setCurrentAvatarUrl('/default-avatar.jpg');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to default avatar URL on error
      setCurrentAvatarUrl('/default-avatar.jpg');
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  // Cleanup previous avatar URL when a new one is uploaded
  useEffect(() => {
    if (formData.avatar_url && formData.avatar_url !== currentAvatarUrl && formData.avatar_url.startsWith('blob:')) {
      URL.revokeObjectURL(formData.avatar_url);
    }
  }, [formData.avatar_url, currentAvatarUrl]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (section: 'personalInfo' | 'professionalInfo' | 'learningPreferences' | 'privacySettings' | 'socialLinks', field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section];
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Transform form data to match backend expectations
      const backendData = {
        fullName: formData.full_name,
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        isPremium: formData.isPremium,
        location: formData.location,
        phone: formData.phone, // Send phone at top level
        address: formData.address, // Send address at top level
        role: formData.role,
        experienceLevel: formData.experienceLevel,
        field: formData.field,
        goals: formData.goals,
        interests: formData.interests,
        professionalInfo: formData.professionalInfo,
        educationalQualifications: formData.education.map((edu: any) => ({
          ...edu,
          endYear: edu.isCurrentlyEnrolled ? null : edu.endYear
        })),
        certifications: formData.certifications,
        socialHandles: formData.socialLinks,
        personalInfo: {
          ...formData.personalInfo,
          // Remove phone and address from personalInfo to avoid duplicates
          phone: undefined,
          address: undefined
        },
        learningPreferences: formData.learningPreferences,
        privacySettings: formData.privacySettings
      };

      await api.profile.update(backendData);

      toast({
        title: "Profile Updated Successfully! 🎉",
        description: "Your profile information has been saved.",
      });

      // Don't redirect automatically - let user stay on edit page
      // navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      educationLevel: 'bachelors-degree',
      isCurrentlyEnrolled: false
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => {
        if (i === index) {
          if (field === 'isCurrentlyEnrolled' && value) {
            // If currently enrolled is checked, clear end year
            return { ...edu, [field]: value, endYear: null };
          } else if (field === 'endYear' && prev.education[index].isCurrentlyEnrolled) {
            // If trying to set end year while currently enrolled, don't allow it
            return edu;
          }
          return { ...edu, [field]: value };
        }
        return edu;
      })
    }));
  };

  const addCertification = () => {
    const newCertification: Certification = {
      name: '',
      issuer: '',
      issueDate: '',
      skills: [],
      isVerified: false
    };
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const toggleArrayField = (field: 'goals' | 'interests' | 'focusAreas' | 'skills', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.some(l => l.language === language)
          ? prev.personalInfo.languages.filter(l => l.language !== language)
          : [...prev.personalInfo.languages, { language, proficiency: 'intermediate' }]
      }
    }));
  };

  const updateLanguageProficiency = (language: string, proficiency: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        languages: prev.personalInfo.languages.map(l =>
          l.language === language ? { ...l, proficiency: proficiency as any } : l
        )
      }
    }));
  };

  // Role-based field visibility
  const isProfessional = ['professional', 'teacher', 'professor', 'researcher', 'software-engineer', 'data-scientist', 'writer', 'entrepreneur', 'freelancer'].includes(formData.role);
  const isStudent = ['student', 'high-school-student', 'college-student', 'graduate-student'].includes(formData.role);

  // Predefined options
  const roleOptions = [
    'student', 'high-school-student', 'college-student', 'graduate-student',
    'professional', 'teacher', 'professor', 'researcher', 'software-engineer',
    'data-scientist', 'writer', 'entrepreneur', 'freelancer', 'admin', 'other'
  ];

  const experienceOptions = ['beginner', 'intermediate', 'advanced'];
  const genderOptions = ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'];
  const proficiencyOptions = ['beginner', 'intermediate', 'advanced', 'native'];
  const educationLevelOptions = ['high-school', 'associate-degree', 'bachelors-degree', 'masters-degree', 'phd', 'certificate', 'diploma', 'other'];
  const learningStyleOptions = ['visual', 'auditory', 'kinesthetic', 'reading-writing', 'mixed'];
  const targetLevelOptions = ['beginner', 'intermediate', 'advanced', 'expert', 'native'];
  const focusAreaOptions = ['speaking', 'listening', 'reading', 'writing', 'grammar', 'vocabulary', 'pronunciation', 'business-english', 'academic-english'];
  const goalOptions = [
    'improve-speaking-skills', 'enhance-vocabulary', 'master-grammar',
    'prepare-for-exams', 'business-english', 'travel-communication',
    'academic-writing', 'pronunciation-improvement', 'reading-comprehension', 'writing-skills'
  ];
  const interestOptions = [
    'technology', 'business', 'science', 'literature', 'travel',
    'movies', 'music', 'sports', 'cooking', 'art', 'politics',
    'history', 'medicine', 'law', 'finance', 'education'
  ];
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];
  const industryOptions = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Marketing',
    'Sales', 'Engineering', 'Legal', 'Creative', 'Research', 'Other'
  ];

  const sections = [
    { id: 'basic', title: 'Basic Information', icon: User },
    { id: 'personal', title: 'Personal Details', icon: Calendar },
    { id: 'education', title: 'Education', icon: GraduationCap },
    ...(isProfessional ? [{ id: 'professional', title: 'Professional Info', icon: Briefcase }] : []),
    { id: 'certifications', title: 'Certifications', icon: Award },
    { id: 'social', title: 'Social Links', icon: LinkIcon },
    { id: 'preferences', title: 'Learning Preferences', icon: Target },
    { id: 'privacy', title: 'Privacy Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'user@example.com',
          ...(user || {}),
          fullName: formData.full_name || user?.email?.split('@')[0] || 'User',
          avatar_url: formData.avatar_url,
          isPremium: formData.isPremium || false,
        }}
        onLogout={() => {}}
        showSidebarToggle={false}
        sidebarOpen={false}
        title="Edit Profile"
        subtitle="Update your information"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Profile Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Basic Information Section */}
              {activeSection === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Photo */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                            {formData.avatar_url && formData.avatar_url.startsWith('blob:') ? (
                              <img
                                src={formData.avatar_url}
                                alt="Profile Preview"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                  console.warn('Blob URL invalid, clearing avatar');
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  updateFormData('avatar_url', '');
                                  setCurrentAvatarUrl('');
                                }}
                              />
                            ) : formData.avatar_url ? (
                              <img src={formData.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-8 h-8 text-slate-500" />
                            )}
                          </div>
                          <label className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center shadow-lg transition-colors">
                            {uploadingPhoto ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Camera className="w-4 h-4 text-white" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                              disabled={uploadingPhoto}
                            />
                          </label>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">Profile Photo</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {uploadingPhoto ? 'Uploading...' : 'Click to upload a professional photo (max 5MB)'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Supports: JPEG, PNG, GIF, WebP
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.full_name}
                          onChange={(e) => updateFormData('full_name', e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-white dark:bg-slate-700"
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => updateFormData('bio', e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="bg-white dark:bg-slate-700"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map(role => (
                              <SelectItem key={role} value={role}>
                                {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Experience Level */}
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel">English Level</Label>
                        <Select value={formData.experienceLevel} onValueChange={(value) => updateFormData('experienceLevel', value)}>
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceOptions.map(level => (
                              <SelectItem key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Field of Study/Expertise */}
                      <div className="space-y-2">
                        <Label htmlFor="field">Field of Study/Expertise</Label>
                        <Input
                          id="field"
                          value={formData.field}
                          onChange={(e) => updateFormData('field', e.target.value)}
                          placeholder="e.g., Computer Science, Business, Medicine"
                          className="bg-white dark:bg-slate-700"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Personal Details Section */}
              {activeSection === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Personal Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => updateFormData('location', e.target.value)}
                            placeholder="City, Country"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => updateFormData('address', e.target.value)}
                          placeholder="123 Main Street, City, State, ZIP"
                          className="bg-white dark:bg-slate-700"
                        />
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.personalInfo.dateOfBirth || ''}
                            onChange={(e) => updateNestedFormData('personalInfo', 'dateOfBirth', e.target.value)}
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={formData.personalInfo.gender}
                            onValueChange={(value) => updateNestedFormData('personalInfo', 'gender', value)}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-700">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map(gender => (
                                <SelectItem key={gender} value={gender}>
                                  {gender.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Nationality */}
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.personalInfo.nationality}
                          onChange={(e) => updateNestedFormData('personalInfo', 'nationality', e.target.value)}
                          placeholder="Your nationality"
                          className="bg-white dark:bg-slate-700"
                        />
                      </div>

                      {/* Languages */}
                      <div className="space-y-3">
                        <Label>Languages You Speak</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {languageOptions.map(language => (
                            <div key={language} className="flex items-center space-x-2">
                              <Checkbox
                                id={language}
                                checked={formData.personalInfo.languages.some(l => l.language === language)}
                                onCheckedChange={() => toggleLanguage(language)}
                              />
                              <Label htmlFor={language} className="text-sm">{language}</Label>
                            </div>
                          ))}
                        </div>

                        {/* Language Proficiency */}
                        {formData.personalInfo.languages.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm font-medium">Language Proficiency</Label>
                            {formData.personalInfo.languages.map(lang => (
                              <div key={lang.language} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-20">{lang.language}:</span>
                                <Select
                                  value={lang.proficiency}
                                  onValueChange={(value) => updateLanguageProficiency(lang.language, value)}
                                >
                                  <SelectTrigger className="w-40 bg-white dark:bg-slate-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {proficiencyOptions.map(level => (
                                      <SelectItem key={level} value={level}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Learning Goals */}
                      <div className="space-y-3">
                        <Label>Learning Goals</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {goalOptions.map(goal => (
                            <div key={goal} className="flex items-center space-x-2">
                              <Checkbox
                                id={goal}
                                checked={formData.goals.includes(goal)}
                                onCheckedChange={() => toggleArrayField('goals', goal)}
                              />
                              <Label htmlFor={goal} className="text-sm">
                                {goal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interests */}
                      <div className="space-y-3">
                        <Label>Interests</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {interestOptions.map(interest => (
                            <div key={interest} className="flex items-center space-x-2">
                              <Checkbox
                                id={interest}
                                checked={formData.interests.includes(interest)}
                                onCheckedChange={() => toggleArrayField('interests', interest)}
                              />
                              <Label htmlFor={interest} className="text-sm">
                                {interest.charAt(0).toUpperCase() + interest.slice(1)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        Education
                      </CardTitle>
                      <Button onClick={addEducation} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Education
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {formData.education.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No education information added yet</p>
                          <Button onClick={addEducation} variant="outline" className="mt-2">
                            Add Your First Education
                          </Button>
                        </div>
                      ) : (
                        formData.education.map((edu, index) => (
                          <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-semibold text-slate-900 dark:text-white">Education #{index + 1}</h4>
                              <Button
                                onClick={() => removeEducation(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Institution *</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                  placeholder="University/School name"
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Degree *</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                  placeholder="Bachelor's, Master's, etc."
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Field of Study *</Label>
                                <Input
                                  value={edu.fieldOfStudy}
                                  onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                                  placeholder="Computer Science, Business, etc."
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Education Level *</Label>
                                <Select
                                  value={edu.educationLevel}
                                  onValueChange={(value) => updateEducation(index, 'educationLevel', value)}
                                >
                                  <SelectTrigger className="bg-white dark:bg-slate-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {educationLevelOptions.map(level => (
                                      <SelectItem key={level} value={level}>
                                        {level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Start Year</Label>
                                <Input
                                  type="number"
                                  value={edu.startYear || ''}
                                  onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value) || undefined)}
                                  placeholder="2020"
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Year</Label>
                                <Input
                                  type="number"
                                  value={edu.isCurrentlyEnrolled ? 'Present' : (edu.endYear || '')}
                                  onChange={(e) => !edu.isCurrentlyEnrolled && updateEducation(index, 'endYear', parseInt(e.target.value) || undefined)}
                                  placeholder="2024"
                                  className="bg-white dark:bg-slate-700"
                                  disabled={edu.isCurrentlyEnrolled}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Grade/GPA</Label>
                                <Input
                                  value={edu.grade || ''}
                                  onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                                  placeholder="3.8 GPA or A+"
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`currentlyEnrolled-${index}`}
                                    checked={edu.isCurrentlyEnrolled}
                                    onCheckedChange={(checked) => updateEducation(index, 'isCurrentlyEnrolled', checked)}
                                  />
                                  <Label htmlFor={`currentlyEnrolled-${index}`}>Currently Enrolled</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 mt-4">
                              <Label>Description/Achievements</Label>
                              <Textarea
                                value={edu.description || ''}
                                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                placeholder="Describe your achievements, projects, or relevant coursework..."
                                rows={3}
                                className="bg-white dark:bg-slate-700"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Professional Information Section (only for professionals) */}
              {activeSection === 'professional' && isProfessional && (
                <motion.div
                  key="professional"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                        Professional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Organization</Label>
                          <Input
                            id="company"
                            value={formData.professionalInfo.company}
                            onChange={(e) => updateNestedFormData('professionalInfo', 'company', e.target.value)}
                            placeholder="Your current company"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Position/Job Title</Label>
                          <Input
                            id="position"
                            value={formData.professionalInfo.position}
                            onChange={(e) => updateNestedFormData('professionalInfo', 'position', e.target.value)}
                            placeholder="Software Engineer, Manager, etc."
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            value={formData.professionalInfo.industry}
                            onValueChange={(value) => updateNestedFormData('professionalInfo', 'industry', value)}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-700">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industryOptions.map(industry => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experienceYears">Years of Experience</Label>
                          <Input
                            id="experienceYears"
                            type="number"
                            value={formData.professionalInfo.experienceYears || ''}
                            onChange={(e) => updateNestedFormData('professionalInfo', 'experienceYears', parseInt(e.target.value) || undefined)}
                            placeholder="5"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="careerGoals">Career Goals</Label>
                        <Textarea
                          id="careerGoals"
                          value={formData.professionalInfo.careerGoals}
                          onChange={(e) => updateNestedFormData('professionalInfo', 'careerGoals', e.target.value)}
                          placeholder="Describe your professional goals and aspirations..."
                          rows={3}
                          className="bg-white dark:bg-slate-700"
                        />
                      </div>

                      {/* Professional Skills */}
                      <div className="space-y-3">
                        <Label>Professional Skills</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Project Management', 'Leadership', 'Communication', 'Data Analysis', 'Machine Learning', 'Design', 'Marketing'].map(skill => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={skill}
                                checked={formData.professionalInfo.skills?.includes(skill) || false}
                                onCheckedChange={() => {
                                  const currentSkills = formData.professionalInfo.skills || [];
                                  const updatedSkills = currentSkills.includes(skill)
                                    ? currentSkills.filter(s => s !== skill)
                                    : [...currentSkills, skill];
                                  updateNestedFormData('professionalInfo', 'skills', updatedSkills);
                                }}
                              />
                              <Label htmlFor={skill} className="text-sm">{skill}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Professional Interests */}
                      <div className="space-y-3">
                        <Label>Professional Interests</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Technology', 'Innovation', 'Leadership', 'Research', 'Teaching', 'Consulting', 'Entrepreneurship', 'Social Impact'].map(interest => (
                            <div key={interest} className="flex items-center space-x-2">
                              <Checkbox
                                id={interest}
                                checked={formData.professionalInfo.interests?.includes(interest) || false}
                                onCheckedChange={() => {
                                  const currentInterests = formData.professionalInfo.interests || [];
                                  const updatedInterests = currentInterests.includes(interest)
                                    ? currentInterests.filter(i => i !== interest)
                                    : [...currentInterests, interest];
                                  updateNestedFormData('professionalInfo', 'interests', updatedInterests);
                                }}
                              />
                              <Label htmlFor={interest} className="text-sm">{interest}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Certifications Section */}
              {activeSection === 'certifications' && (
                <motion.div
                  key="certifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        Certifications
                      </CardTitle>
                      <Button onClick={addCertification} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Certification
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {formData.certifications.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No certifications added yet</p>
                          <Button onClick={addCertification} variant="outline" className="mt-2">
                            Add Your First Certification
                          </Button>
                        </div>
                      ) : (
                        formData.certifications.map((cert, index) => (
                          <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-semibold text-slate-900 dark:text-white">Certification #{index + 1}</h4>
                              <Button
                                onClick={() => removeCertification(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Certification Name *</Label>
                                <Input
                                  value={cert.name}
                                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                  placeholder="TOEFL, IELTS, etc."
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Issuing Organization *</Label>
                                <Input
                                  value={cert.issuer}
                                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                  placeholder="ETS, British Council, etc."
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Issue Date *</Label>
                                <Input
                                  type="date"
                                  value={cert.issueDate}
                                  onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input
                                  type="date"
                                  value={cert.expiryDate || ''}
                                  onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Credential ID</Label>
                                <Input
                                  value={cert.credentialId || ''}
                                  onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                                  placeholder="Certificate number"
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Credential URL</Label>
                                <Input
                                  value={cert.credentialUrl || ''}
                                  onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value)}
                                  placeholder="https://verify.certification.com"
                                  className="bg-white dark:bg-slate-700"
                                />
                              </div>
                            </div>

                            <div className="space-y-2 mt-4">
                              <Label>Description</Label>
                              <Textarea
                                value={cert.description || ''}
                                onChange={(e) => updateCertification(index, 'description', e.target.value)}
                                placeholder="Describe what this certification covers..."
                                rows={2}
                                className="bg-white dark:bg-slate-700"
                              />
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox
                                id={`verified-${index}`}
                                checked={cert.isVerified}
                                onCheckedChange={(checked) => updateCertification(index, 'isVerified', checked)}
                              />
                              <Label htmlFor={`verified-${index}`}>Verified Certification</Label>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Social Links Section */}
              {activeSection === 'social' && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-indigo-600" />
                        Social Links & Portfolio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={formData.socialLinks.linkedin || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={formData.socialLinks.github || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'github', e.target.value)}
                            placeholder="https://github.com/yourusername"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter/X</Label>
                          <Input
                            id="twitter"
                            value={formData.socialLinks.twitter || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'twitter', e.target.value)}
                            placeholder="https://twitter.com/yourusername"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Personal Website</Label>
                          <Input
                            id="website"
                            value={formData.socialLinks.website || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            value={formData.socialLinks.instagram || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'instagram', e.target.value)}
                            placeholder="https://instagram.com/yourusername"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="youtube">YouTube</Label>
                          <Input
                            id="youtube"
                            value={formData.socialLinks.youtube || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'youtube', e.target.value)}
                            placeholder="https://youtube.com/yourchannel"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="portfolio">Portfolio</Label>
                          <Input
                            id="portfolio"
                            value={formData.socialLinks.portfolio || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'portfolio', e.target.value)}
                            placeholder="https://yourportfolio.com"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="other">Other Links</Label>
                          <Input
                            id="other"
                            value={formData.socialLinks.other || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'other', e.target.value)}
                            placeholder="Any other relevant links"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Learning Preferences Section */}
              {activeSection === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-600" />
                        Learning Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Learning Style */}
                      <div className="space-y-2">
                        <Label>Preferred Learning Style</Label>
                        <Select
                          value={formData.learningPreferences.preferredLearningStyle}
                          onValueChange={(value) => updateNestedFormData('learningPreferences', 'preferredLearningStyle', value)}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {learningStyleOptions.map(style => (
                              <SelectItem key={style} value={style}>
                                {style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Learning Goals */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dailyGoal">Daily Learning Goal (minutes)</Label>
                          <Input
                            id="dailyGoal"
                            type="number"
                            value={formData.learningPreferences.dailyLearningGoal}
                            onChange={(e) => updateNestedFormData('learningPreferences', 'dailyLearningGoal', parseInt(e.target.value) || 30)}
                            min="5"
                            max="180"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weeklyGoal">Weekly Learning Goal (minutes)</Label>
                          <Input
                            id="weeklyGoal"
                            type="number"
                            value={formData.learningPreferences.weeklyLearningGoal}
                            onChange={(e) => updateNestedFormData('learningPreferences', 'weeklyLearningGoal', parseInt(e.target.value) || 210)}
                            min="35"
                            max="1260"
                            className="bg-white dark:bg-slate-700"
                          />
                        </div>
                      </div>

                      {/* Target English Level */}
                      <div className="space-y-2">
                        <Label>Target English Level</Label>
                        <Select
                          value={formData.learningPreferences.targetEnglishLevel}
                          onValueChange={(value) => updateNestedFormData('learningPreferences', 'targetEnglishLevel', value)}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {targetLevelOptions.map(level => (
                              <SelectItem key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Focus Areas */}
                      <div className="space-y-3">
                        <Label>Focus Areas</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {focusAreaOptions.map(area => (
                            <div key={area} className="flex items-center space-x-2">
                              <Checkbox
                                id={area}
                                checked={formData.learningPreferences.focusAreas.includes(area)}
                                onCheckedChange={() => toggleArrayField('focusAreas', area)}
                              />
                              <Label htmlFor={area} className="text-sm">
                                {area.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Privacy Settings Section */}
              {activeSection === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-600" />
                        Privacy Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Visibility */}
                      <div className="space-y-2">
                        <Label>Profile Visibility</Label>
                        <Select
                          value={formData.privacySettings.profileVisibility}
                          onValueChange={(value) => updateNestedFormData('privacySettings', 'profileVisibility', value)}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public - Anyone can see</SelectItem>
                            <SelectItem value="friends-only">Friends Only</SelectItem>
                            <SelectItem value="private">Private - Only you can see</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Privacy Options */}
                      <div className="space-y-3">
                        <Label>Show Information</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showContactInfo"
                              checked={formData.privacySettings.showContactInfo}
                              onCheckedChange={(checked) => updateNestedFormData('privacySettings', 'showContactInfo', checked)}
                            />
                            <Label htmlFor="showContactInfo">Show contact information (phone, address)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showEducation"
                              checked={formData.privacySettings.showEducation}
                              onCheckedChange={(checked) => updateNestedFormData('privacySettings', 'showEducation', checked)}
                            />
                            <Label htmlFor="showEducation">Show education information</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showCertifications"
                              checked={formData.privacySettings.showCertifications}
                              onCheckedChange={(checked) => updateNestedFormData('privacySettings', 'showCertifications', checked)}
                            />
                            <Label htmlFor="showCertifications">Show certifications</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showAchievements"
                              checked={formData.privacySettings.showAchievements}
                              onCheckedChange={(checked) => updateNestedFormData('privacySettings', 'showAchievements', checked)}
                            />
                            <Label htmlFor="showAchievements">Show achievements and awards</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save and Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                View Profile
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Image Cropping Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          if (selectedImage && selectedImage.startsWith('blob:')) {
            URL.revokeObjectURL(selectedImage);
          }
          setSelectedImage('');
        }}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
    </div>
  );
};

export default EditProfile;
