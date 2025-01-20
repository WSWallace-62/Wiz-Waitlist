import sgMail from '@sendgrid/mail';
import { waitlistConfirmationTemplate } from './email-templates/waitlist-confirmation.js';
import type { EmailConfig, WaitlistEmailCustomizations } from './types.js';
import fs from 'fs';
import path from 'path';

// Track initialization state
let emailEnabled = false;
let lastInitializationError: string | null = null;

// Initialize SendGrid with retry
async function initializeSendGrid(retries = 3) {
  // Reset state
  emailEnabled = false;
  lastInitializationError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_VERIFIED_EMAIL) {
        lastInitializationError = 'Missing required SendGrid credentials';
        console.log('SendGrid credentials not set - email notifications disabled');
        console.log('Missing:', {
          apiKey: !process.env.SENDGRID_API_KEY ? 'SENDGRID_API_KEY' : undefined,
          verifiedEmail: !process.env.SENDGRID_VERIFIED_EMAIL ? 'SENDGRID_VERIFIED_EMAIL' : undefined
        });
        return false;
      }

      const verifiedEmail = process.env.SENDGRID_VERIFIED_EMAIL.trim();
      console.log('Attempting to initialize SendGrid with email:', verifiedEmail);

      // Validate the email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(verifiedEmail)) {
        lastInitializationError = `Invalid email format: ${verifiedEmail}`;
        console.error('SENDGRID_VERIFIED_EMAIL is not in a valid email format:', verifiedEmail);
        return false;
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      emailEnabled = true;
      lastInitializationError = null;
      console.log('SendGrid initialized successfully with verified email:', verifiedEmail);
      return true;
    } catch (error: any) {
      lastInitializationError = error.message;
      console.error(`Error initializing SendGrid (attempt ${attempt}/${retries}):`, {
        message: error.message,
        errors: error.response?.body?.errors,
        code: error.code
      });

      if (attempt === retries) {
        console.log('Email notifications will be disabled');
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
    }
  }
  return false;
}

// Initialize on startup
initializeSendGrid();

function getInlineLogoImage(): string {
  try {
    const imagePath = path.join(process.cwd(), 'client/public/avo-friend.png');
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error reading logo image:', error);
    return '';
  }
}

export async function sendWaitlistConfirmation(
  email: string,
  fullName: string,
  customizations?: WaitlistEmailCustomizations
) {
  // Check email service state
  if (!emailEnabled) {
    const reason = lastInitializationError || 'Email service not enabled';
    console.log(`Email notifications disabled - skipping confirmation email to ${email} (Reason: ${reason})`);
    return { sent: false, reason };
  }

  if (!process.env.SENDGRID_VERIFIED_EMAIL) {
    console.error('SENDGRID_VERIFIED_EMAIL not set - cannot send email');
    return { sent: false, reason: 'Missing verified sender email' };
  }

  const verifiedEmail = process.env.SENDGRID_VERIFIED_EMAIL.trim();
  const inlineImage = getInlineLogoImage();

  console.log('Preparing to send email with parameters:', {
    to: email,
    from: verifiedEmail,
    hasImage: !!inlineImage
  });

  const msg = {
    to: {
      email: email.trim(),
      name: fullName
    },
    from: {
      email: verifiedEmail,
      name: 'The Vegan Wiz'
    },
    subject: waitlistConfirmationTemplate.subject,
    html: waitlistConfirmationTemplate.generateHTML({
      fullName,
      customizations: {
        ...customizations,
        headerImage: 'cid:avo-friend'
      }
    }),
    attachments: [{
      content: inlineImage,
      filename: 'avo-friend.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'avo-friend'
    }]
  };

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await sgMail.send(msg);
      console.log(`Confirmation email sent successfully to ${email}`, {
        statusCode: response[0].statusCode,
        headers: response[0].headers
      });
      return { sent: true };
    } catch (error: any) {
      attempts++;
      console.error(`Error sending confirmation email (attempt ${attempts}/${maxAttempts}):`, {
        message: error.message,
        errors: error.response?.body?.errors,
        code: error.code,
        response: error.response?.body
      });

      if (attempts === maxAttempts) {
        return {
          sent: false,
          reason: error.response?.body?.errors?.[0]?.message || error.message
        };
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 10000)));
    }
  }

  return { sent: false, reason: 'Maximum retry attempts reached' };
}