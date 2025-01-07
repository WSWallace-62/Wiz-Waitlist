import sgMail from '@sendgrid/mail';
import { waitlistConfirmationTemplate } from './email-templates/waitlist-confirmation.js';
import type { EmailConfig, WaitlistEmailCustomizations } from './types.js';

let emailEnabled = false;

// Initialize SendGrid with retry
async function initializeSendGrid(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        emailEnabled = true;
        console.log('SendGrid initialized successfully');
        return true;
      } else {
        console.log('SENDGRID_API_KEY not set - email notifications disabled');
        return false;
      }
    } catch (error) {
      console.error(`Error initializing SendGrid (attempt ${attempt}/${retries}):`, error);
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

export async function sendWaitlistConfirmation(
  email: string, 
  fullName: string,
  customizations?: WaitlistEmailCustomizations
) {
  if (!emailEnabled) {
    console.log(`Email notifications disabled - skipping confirmation email to ${email}`);
    return;
  }

  const msg: EmailConfig = {
    to: email,
    from: 'noreply@mg.plant-based-world.com', // Using SendGrid verified domain
    subject: waitlistConfirmationTemplate.subject,
    html: waitlistConfirmationTemplate.generateHTML({
      fullName,
      customizations: {
        ...customizations,
        // Use the verified sender domain for image hosting
        headerImage: 'https://mg.plant-based-world.com/images/avo-friend.png'
      }
    })
  };

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await sgMail.send(msg);
      console.log(`Confirmation email sent successfully to ${email}`);
      return;
    } catch (error: any) {
      attempts++;
      // Enhanced error logging
      console.error(`Error sending confirmation email (attempt ${attempts}/${maxAttempts}):`, {
        error: error.toString(),
        response: error.response?.body,
        statusCode: error.code,
      });

      if (attempts === maxAttempts) {
        console.error('Max retry attempts reached for sending email');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 10000)));
    }
  }
}