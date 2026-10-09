# Email Confirmation Setup Guide

This guide explains how to set up email confirmations for the Jimmy Jam app. Confirmation emails are automatically sent after each successful form submission.

## Current Implementation

Email template functions are defined in `src/supabaseClient.js` for:
- BBQ Slam team registrations
- Vendor applications
- Car show registrations
- Assistance applications
- Newsletter signups

Currently, the `sendEmail()` function logs emails to the console. To enable actual email sending, you need to integrate with an email service.

## Email Services

Choose one of the following options:

### Option 1: Resend (Recommended)

**Pros:** Modern, free tier, excellent React integration, developer-friendly

**Setup:**

1. Sign up at https://resend.com
2. Install Resend:
   ```bash
   npm install resend
   ```
3. Get your API key from Resend dashboard
4. Add to `.env.local`:
   ```
   REACT_APP_RESEND_API_KEY=your-api-key-here
   ```
5. Update `src/supabaseClient.js`:
   ```javascript
   import { Resend } from 'resend';

   export const sendEmail = async (to, templateType, templateData) => {
     try {
       const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);
       const template = emailTemplates[templateType](templateData);
       
       const response = await resend.emails.send({
         from: 'Jimmy Jam <noreply@jimmyjamoutreach.com>',
         to: to,
         subject: template.subject,
         html: template.html
       });

       return { success: true, data: response };
     } catch (error) {
       console.error('Email sending error:', error);
       return { success: false, error: error.message };
     }
   };
   ```
6. Update email domain in `.env.local`:
   ```
   REACT_APP_EMAIL_FROM=noreply@your-domain.com
   ```

### Option 2: SendGrid

**Setup:**

1. Sign up at https://sendgrid.com
2. Get your API key
3. Add to `.env.local`:
   ```
   REACT_APP_SENDGRID_API_KEY=your-api-key-here
   ```
4. Update `src/supabaseClient.js`:
   ```javascript
   export const sendEmail = async (to, templateType, templateData) => {
     try {
       const template = emailTemplates[templateType](templateData);
       
       const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.REACT_APP_SENDGRID_API_KEY}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           personalizations: [{
             to: [{ email: to }]
           }],
           from: { email: 'noreply@jimmyjamoutreach.com' },
           subject: template.subject,
           content: [{
             type: 'text/html',
             value: template.html
           }]
         })
       });

       return { success: response.ok };
     } catch (error) {
       console.error('Email sending error:', error);
       return { success: false, error: error.message };
     }
   };
   ```

### Option 3: Mailgun

**Setup:**

1. Sign up at https://mailgun.com
2. Get your API key and domain
3. Add to `.env.local`:
   ```
   REACT_APP_MAILGUN_API_KEY=your-api-key-here
   REACT_APP_MAILGUN_DOMAIN=your-domain.mailgun.org
   ```
4. Update `src/supabaseClient.js`:
   ```javascript
   import FormData from 'form-data';

   export const sendEmail = async (to, templateType, templateData) => {
     try {
       const template = emailTemplates[templateType](templateData);
       const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
       const apiKey = process.env.REACT_APP_MAILGUN_API_KEY;

       const response = await fetch(
         `https://api.mailgun.net/v3/${domain}/messages`,
         {
           method: 'POST',
           headers: {
             'Authorization': `Basic ${btoa(`api:${apiKey}`)}`
           },
           body: new URLSearchParams({
             from: `Jimmy Jam <noreply@${domain}>`,
             to: to,
             subject: template.subject,
             html: template.html
           })
         }
       );

       return { success: response.ok };
     } catch (error) {
       console.error('Email sending error:', error);
       return { success: false, error: error.message };
     }
   };
   ```

### Option 4: Supabase Edge Functions

**Setup:**

1. Create a Supabase Edge Function:
   ```bash
   supabase functions new send-email
   ```
2. Implement in `supabase/functions/send-email/index.ts` to use any email service
3. Call from React:
   ```javascript
   export const sendEmail = async (to, templateType, templateData) => {
     try {
       const template = emailTemplates[templateType](templateData);
       
       const response = await supabase.functions.invoke('send-email', {
         body: {
           to: to,
           subject: template.subject,
           html: template.html
         }
       });

       return response;
     } catch (error) {
       console.error('Email sending error:', error);
       return { success: false, error: error.message };
     }
   };
   ```

## Testing

1. **Console Output**: During development, emails are logged to browser console
2. **Email Testing Service**: Use Mailinator or Mailtrap to test without sending real emails
3. **Verify Send**: Check email logs in your email service dashboard

## Email Templates

All email templates are defined in `src/supabaseClient.js` under `emailTemplates`:

- `emailTemplates.bbqTeam()` - BBQ Slam team confirmation
- `emailTemplates.vendor()` - Vendor application confirmation
- `emailTemplates.carShow()` - Car show registration confirmation
- `emailTemplates.assistance()` - Assistance application confirmation
- `emailTemplates.newsletter()` - Newsletter welcome email

To customize templates, edit the HTML in the template functions. Each template includes:
- Branded header with Jimmy Jam colors
- Submission details
- Next steps information
- Contact information

## Environment Variables

Never commit actual API keys to version control. Use `.env.local` for local development:

```
REACT_APP_EMAIL_SERVICE=resend  # or sendgrid, mailgun, etc.
REACT_APP_RESEND_API_KEY=your-key-here
REACT_APP_EMAIL_FROM=noreply@jimmyjamoutreach.com
```

For production, set these in your hosting platform's environment variables.

## Troubleshooting

- **Emails not sending**: Check browser console for errors
- **CORS errors**: Some email services may require server-side implementation via Edge Functions
- **Email not received**: Check spam folder and email service logs
- **Template not rendering**: Verify HTML syntax in email templates

## Next Steps

1. Choose an email service
2. Update `sendEmail()` function in `src/supabaseClient.js`
3. Configure API keys in `.env.local`
4. Test by submitting a form
5. Monitor delivery in email service dashboard
