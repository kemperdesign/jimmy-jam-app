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

// Email templates and sending functions
export const emailTemplates = {
  bbqTeam: (teamData) => ({
    subject: '✅ Jimmy Jam BBQ Slam - Team Registration Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🍖 BBQ Slam Registration Confirmed</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Hello ${teamData.contactName},</p>
          <p>Thank you for registering your BBQ team for the Jimmy Jam BBQ Slam competition!</p>

          <div style="background-color: white; border-left: 4px solid #b91c1c; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #b91c1c;">Registration Details</h2>
            <p><strong>Team Name:</strong> ${teamData.teamName}</p>
            <p><strong>Contact:</strong> ${teamData.contactName}</p>
            <p><strong>Email:</strong> ${teamData.email}</p>
            <p><strong>Phone:</strong> ${teamData.phone}</p>
            <p><strong>Team Members:</strong> ${teamData.members}</p>
            <p><strong>BBQ Style:</strong> ${teamData.bbqStyle}</p>
            <p><strong>Experience Level:</strong> ${teamData.experience}</p>
          </div>

          <p>We're excited to have you competing at Jimmy Jam! More details about the event will be sent soon.</p>
          <p>If you have any questions, feel free to reach out to us.</p>

          <p style="margin-top: 30px;">Best regards,<br><strong>Jimmy Jam Team</strong></p>
        </div>
      </div>
    `
  }),

  vendor: (vendorData) => ({
    subject: '✅ Jimmy Jam - Vendor Application Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🏪 Vendor Application Confirmed</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Hello ${vendorData.contactName},</p>
          <p>Thank you for applying to be a vendor at the Jimmy Jam BBQ & Bourbon Event!</p>

          <div style="background-color: white; border-left: 4px solid #b91c1c; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #b91c1c;">Application Details</h2>
            <p><strong>Business:</strong> ${vendorData.businessName}</p>
            <p><strong>Category:</strong> ${vendorData.category}</p>
            <p><strong>Contact:</strong> ${vendorData.contactName}</p>
            <p><strong>Email:</strong> ${vendorData.email}</p>
            <p><strong>Phone:</strong> ${vendorData.phone}</p>
            <p><strong>Booth Size:</strong> ${vendorData.booth}</p>
            <p><strong>Description:</strong> ${vendorData.description}</p>
          </div>

          <p>We've received your application and will review it shortly. You'll hear from us within 3-5 business days.</p>
          <p>Questions? Reply to this email or call us!</p>

          <p style="margin-top: 30px;">Best regards,<br><strong>Jimmy Jam Team</strong></p>
        </div>
      </div>
    `
  }),

  carShow: (carData) => ({
    subject: '✅ Jimmy Jam - Car Show Registration Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🚗 Car Show Registration Confirmed</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Hello ${carData.ownerName},</p>
          <p>Thank you for registering your vehicle for the Jimmy Jam Car Show!</p>

          <div style="background-color: white; border-left: 4px solid #b91c1c; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #b91c1c;">Registration Details</h2>
            <p><strong>Owner:</strong> ${carData.ownerName}</p>
            <p><strong>Vehicle:</strong> ${carData.carYear} ${carData.carMake} ${carData.carModel}</p>
            <p><strong>Category:</strong> ${carData.category}</p>
            <p><strong>Email:</strong> ${carData.email}</p>
            <p><strong>Phone:</strong> ${carData.phone}</p>
          </div>

          <p>Your vehicle has been registered for the show. More details about parking, setup times, and awards will be sent soon.</p>
          <p>We look forward to seeing your beautiful ride!</p>

          <p style="margin-top: 30px;">Best regards,<br><strong>Jimmy Jam Team</strong></p>
        </div>
      </div>
    `
  }),

  assistance: (appData) => ({
    subject: '✅ Jimmy Jam - Assistance Application Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🤝 Application Received</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Hello ${appData.fullName},</p>
          <p>Thank you for submitting your assistance application to Jimmy Jam!</p>

          <div style="background-color: white; border-left: 4px solid #b91c1c; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #b91c1c;">Application Details</h2>
            <p><strong>Name:</strong> ${appData.fullName}</p>
            <p><strong>Email:</strong> ${appData.email}</p>
            <p><strong>Phone:</strong> ${appData.phone}</p>
            <p><strong>Type:</strong> ${appData.assistanceType}</p>
            <p><strong>Description:</strong> ${appData.description}</p>
          </div>

          <p>We've received your request and will be in touch soon to discuss how we can help.</p>
          <p>Thank you for supporting our community!</p>

          <p style="margin-top: 30px;">Best regards,<br><strong>Jimmy Jam Team</strong></p>
        </div>
      </div>
    `
  }),

  newsletter: (email) => ({
    subject: '✅ Welcome to Jimmy Jam Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">📧 Welcome to Jimmy Jam!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Hello!</p>
          <p>Thank you for subscribing to the Jimmy Jam newsletter!</p>

          <div style="background-color: white; border-left: 4px solid #b91c1c; padding: 15px; margin: 20px 0;">
            <p>You'll now receive updates about:</p>
            <ul style="margin: 10px 0;">
              <li>🍖 BBQ Slam Competition details and schedules</li>
              <li>🥃 Bourbon & BBQ event information</li>
              <li>🎤 Live entertainment and performers</li>
              <li>📸 Behind-the-scenes photos and videos</li>
              <li>🎫 Special ticket offers and promotions</li>
            </ul>
          </div>

          <p>Stay tuned for exciting announcements!</p>
          <p><em>You can unsubscribe at any time by replying to this email.</em></p>

          <p style="margin-top: 30px;">Best regards,<br><strong>Jimmy Jam Team</strong></p>
        </div>
      </div>
    `
  })
};

// Send email function - integrate with your email service (Resend, SendGrid, etc.)
export const sendEmail = async (to, templateType, templateData) => {
  try {
    // TODO: Configure with your preferred email service
    // Options:
    // 1. Resend: https://resend.com
    // 2. SendGrid: https://sendgrid.com
    // 3. Mailgun: https://mailgun.com
    // 4. Custom backend endpoint

    // Example with Resend (install: npm install resend):
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);
    // const template = emailTemplates[templateType](templateData);
    // await resend.emails.send({
    //   from: 'Jimmy Jam <noreply@jimmyjamoutreach.com>',
    //   to: to,
    //   subject: template.subject,
    //   html: template.html
    // });

    // For now, log the email that would be sent
    const template = emailTemplates[templateType](templateData);
    console.log(`📧 Email to ${to}:`, template);

    // Return success for now (implement actual email service later)
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Payment processing functions
// Note: In production, payment intent creation should be done server-side for security
// This frontend implementation is for demonstration purposes

export const submitTicketOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      order_type: 'tickets',
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      ticket_type: orderData.ticketType,
      quantity: orderData.quantity,
      amount: orderData.amount,
      status: 'pending',
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const submitMerchOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      order_type: 'merchandise',
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      items: JSON.stringify(orderData.items),
      amount: orderData.amount,
      status: 'pending',
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const submitDonation = async (donationData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      order_type: 'donation',
      customer_name: donationData.name,
      customer_email: donationData.email,
      customer_phone: donationData.phone,
      amount: donationData.amount,
      message: donationData.message,
      status: 'pending',
      submitted_at: new Date().toISOString()
    }]);

  return { data, error };
};

export const updateOrderStatus = async (orderId, status, stripePaymentId) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: status,
      stripe_payment_id: stripePaymentId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  return { data, error };
};

// Payment confirmation email template
export const paymentConfirmationEmail = (orderData) => ({
  subject: '✅ Payment Confirmed - Jimmy Jam Order',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">✅ Payment Received</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Hello ${orderData.name},</p>
        <p>Thank you for your purchase! Your payment has been received and confirmed.</p>

        <div style="background-color: white; border-left: 4px solid #b91c1c; padding: 15px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #b91c1c;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Order Type:</strong> ${orderData.orderType}</p>
          <p><strong>Amount:</strong> $${orderData.amount.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p><strong>Next Steps:</strong></p>
        <ul style="margin: 15px 0;">
          <li>A confirmation email with your receipt has been sent</li>
          <li>You will receive additional details about delivery/pickup soon</li>
          <li>If you have questions, reply to this email or contact us</li>
        </ul>

        <p style="margin-top: 30px;">Best regards,<br><strong>Jimmy Jam Team</strong></p>
      </div>
    </div>
  `
});
