import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Get these from your Supabase project settings: https://supabase.com
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema functions
export const submitBBQTeamEntry = async (teamData) => {
  const { data, error } = await supabase
    .from('bbq_slam_teams')
    .insert([{
      team_name: teamData.teamName,
      contact_name: teamData.contactName,
      email: teamData.email,
      phone: teamData.phone,
      members_count: parseInt(teamData.members) || 0,
      bbq_style: teamData.bbqStyle,
      experience_level: teamData.experience,
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const submitVendorEntry = async (vendorData) => {
  const { data, error } = await supabase
    .from('bbq_slam_vendors')
    .insert([{
      business_name: vendorData.businessName,
      category: vendorData.category,
      contact_name: vendorData.contactName,
      email: vendorData.email,
      phone: vendorData.phone,
      description: vendorData.description,
      booth_size: vendorData.booth,
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const submitCarShowEntry = async (carData) => {
  const { data, error } = await supabase
    .from('car_show_entries')
    .insert([{
      owner_name: carData.ownerName,
      car_make: carData.carMake,
      car_model: carData.carModel,
      car_year: parseInt(carData.carYear) || null,
      email: carData.email,
      phone: carData.phone,
      category: carData.category,
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const submitAssistanceApplication = async (appData) => {
  const { data, error } = await supabase
    .from('assistance_applications')
    .insert([{
      full_name: appData.fullName,
      email: appData.email,
      phone: appData.phone,
      assistance_type: appData.assistanceType,
      description: appData.description,
      status: 'pending',
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const submitNewsletterSignup = async (email) => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{
      email: email,
      subscribed_at: new Date().toISOString(),
      status: 'active'
    }]);

  return { data, error };
};

// Photo upload functions
export const uploadPhoto = async (file, folder = 'event-photos') => {
  try {
    // Validate file
    if (!file) {
      return { data: null, error: new Error('No file selected') };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { data: null, error: new Error('File size must be less than 5MB') };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { data: null, error: new Error('File must be an image') };
    }

    // Create unique filename
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`;
    const filepath = `${folder}/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('jimmy-jam-photos')
      .upload(filepath, file);

    if (error) {
      return { data: null, error };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('jimmy-jam-photos')
      .getPublicUrl(filepath);

    return {
      data: {
        path: filepath,
        url: publicUrlData.publicUrl,
        filename: filename
      },
      error: null
    };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const getPhotos = async (folder = 'event-photos') => {
  try {
    const { data, error } = await supabase.storage
      .from('jimmy-jam-photos')
      .list(folder);

    if (error) {
      return { data: [], error };
    }

    // Get public URLs for all files
    const photos = data
      .filter(file => file.name) // Filter out empty entries
      .map(file => {
        const filepath = `${folder}/${file.name}`;
        const { data: publicUrlData } = supabase.storage
          .from('jimmy-jam-photos')
          .getPublicUrl(filepath);
        return {
          name: file.name,
          path: filepath,
          url: publicUrlData.publicUrl,
          created_at: file.created_at
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { data: photos, error: null };
  } catch (err) {
    return { data: [], error: err };
  }
};

export const deletePhoto = async (filepath) => {
  const { data, error } = await supabase.storage
    .from('jimmy-jam-photos')
    .remove([filepath]);

  return { data, error };
};
