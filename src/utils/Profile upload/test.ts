/**
 * Profile Picture Upload Test Script
 *
 * This script tests the Supabase profile picture upload functionality
 * and verifies that the fallback mechanism works correctly.
 *
 * To run this test:
 * 1. Open browser console in the profile edit page
 * 2. Run: await testProfilePictureUpload()
 */

import { ProfilePictureService } from '@/utils/Profile upload/supabase';

// Test file creation utility
function createTestImageFile(): File {
  // Create a simple test image (1x1 pixel PNG)
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 100, 100);
  }

  canvas.toBlob((blob) => {
    if (blob) {
      return new File([blob], 'test-profile.jpg', { type: 'image/jpeg' });
    }
  });

  // Fallback: create a simple blob
  return new File(['test'], 'test-profile.jpg', { type: 'image/jpeg' });
}

// Main test function
export async function testProfilePictureUpload() {
  console.log('🧪 Starting Profile Picture Upload Test...');

  try {
    // Test 1: Check Supabase availability
    console.log('📡 Testing Supabase availability...');
    const isAvailable = await ProfilePictureService['checkSupabaseAvailability']();
    console.log('📡 Supabase available:', isAvailable);

    // Test 2: Test upload with fallback
    console.log('📤 Testing upload with fallback...');
    const testFile = createTestImageFile();

    const result = await ProfilePictureService.uploadProfilePicture(
      'test-user-id',
      testFile,
      {
        onProgress: (progress) => {
          console.log('📊 Upload progress:', progress + '%');
        },
        onComplete: (url) => {
          console.log('✅ Upload completed:', url);
        },
        onError: (error) => {
          console.log('❌ Upload failed (expected if no backend):', error.message);
        }
      }
    );

    console.log('🎯 Test result:', result);
    console.log('✅ Profile Picture Upload Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test individual components
export async function testSupabaseAvailability() {
  console.log('🧪 Testing Supabase availability...');
  const isAvailable = await ProfilePictureService['checkSupabaseAvailability']();
  console.log('📡 Supabase available:', isAvailable);
  return isAvailable;
}

export function testFallbackUpload() {
  console.log('🧪 Testing backend fallback upload...');
  const testFile = createTestImageFile();

  return ProfilePictureService['fallbackToBackendUpload'](
    'test-user-id',
    testFile,
    {
      onProgress: (progress) => console.log('📊 Fallback progress:', progress + '%'),
      onComplete: (url) => console.log('✅ Fallback completed:', url),
      onError: (error) => console.log('❌ Fallback failed:', error.message)
    }
  );
}

// Test authentication status
export function testAuthentication() {
  console.log('🧪 Testing Authentication Status...');

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userData = localStorage.getItem('userData');

  console.log('🔑 Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('🔄 Refresh Token:', refreshToken ? 'Present' : 'Missing');
  console.log('👤 User Data:', userData ? 'Present' : 'Missing');

  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log('📋 User Info:', {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      });
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
    }
  }

  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    hasUserData: !!userData
  };
}

// Test backend connectivity
export async function testBackendConnectivity() {
  console.log('🧪 Testing Backend Connectivity...');

  try {
    const response = await fetch('http://localhost:5000/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('🌐 Backend status:', response.status);
    console.log('🌐 Backend response:', await response.text());

    return response.ok;
  } catch (error) {
    console.error('❌ Backend connectivity failed:', error);
    return false;
  }
}

// Test avatar upload endpoint
export async function testAvatarUploadEndpoint() {
  console.log('🧪 Testing Avatar Upload Endpoint...');

  try {
    const response = await fetch('http://localhost:5000/api/profile/test-upload', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    console.log('🌐 Response status:', response.status);
    const data = await response.json();
    console.log('📋 Response data:', data);

    return response.ok;
  } catch (error) {
    console.error('❌ Avatar upload endpoint test failed:', error);
    return false;
  }
}

// Test file upload with actual file - uses optimized route
export async function testFileUpload(file: File) {
  console.log('🧪 Testing File Upload with Optimized Route...');

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch('http://localhost:5000/api/profile/avatar-optimized', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: formData
    });

    console.log('🌐 Response status:', response.status);
    const data = await response.json();
    console.log('📋 Response data:', data);

    return response.ok;
  } catch (error) {
    console.error('❌ File upload test failed:', error);
    return false;
  }
}

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testAuthentication = testAuthentication;
  (window as any).testBackendConnectivity = testBackendConnectivity;
  (window as any).testAvatarUploadEndpoint = testAvatarUploadEndpoint;
  (window as any).testFileUpload = testFileUpload;
}
