#!/usr/bin/env node

/**
 * Supabase Bucket Creation Script
 *
 * This script creates the required 'uploads' bucket in Supabase Storage
 * Run this script when you first set up avatar uploads
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function createUploadsBucket() {
  console.log('📦 Creating Supabase bucket "uploads"...');

  // Get Supabase credentials from environment
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.log('💡 Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    process.exit(1);
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Check if bucket already exists
    console.log('🔍 Checking existing buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Error checking buckets:', listError);
      process.exit(1);
    }

    console.log(`📂 Found ${buckets?.length || 0} existing buckets:`, buckets?.map(b => b.name).join(', ') || 'none');

    // Check if 'uploads' bucket exists
    const uploadsBucketExists = buckets?.some(bucket => bucket.name === 'uploads');

    if (uploadsBucketExists) {
      console.log('✅ Bucket "uploads" already exists!');
      console.log('🎉 Avatar upload system is ready to use');
      return;
    }

    // Create the bucket
    console.log('📦 Creating bucket "uploads"...');
    const { error: createError } = await supabase.storage.createBucket('uploads', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('❌ Error creating bucket:', createError);

      if (createError.message.includes('already exists')) {
        console.log('💡 Bucket might already exist but not visible. Please check Supabase dashboard manually.');
      } else {
        console.log('💡 Please create the bucket manually in your Supabase dashboard:');
        console.log(`   1. Go to https://supabase.com/dashboard/project/${supabaseUrl.split('/').pop()}/storage`);
        console.log(`   2. Create a new bucket named 'uploads'`);
        console.log(`   3. Set it to public and allow image uploads`);
        console.log(`   4. Set file size limit to 5MB`);
      }
      process.exit(1);
    }

    console.log('✅ Successfully created bucket "uploads"');
    console.log('🎉 Avatar upload system is now ready!');

    // Verify bucket creation
    const { data: newBuckets, error: verifyError } = await supabase.storage.listBuckets();
    if (!verifyError && newBuckets?.some(bucket => bucket.name === 'uploads')) {
      console.log('✅ Bucket creation verified successfully');
    } else {
      console.log('⚠️ Bucket created but verification failed. Please check Supabase dashboard.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
createUploadsBucket();
