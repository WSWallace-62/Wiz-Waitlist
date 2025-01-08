import twilio from 'twilio';
import type { EmailConfig, WaitlistEmailCustomizations } from './types';
import { waitlistConfirmationTemplate } from './email-templates/waitlist-confirmation';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let emailEnabled = false;

// Initialize Twilio with retry
async function initializeTwilio(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SID) {
        // Test the credentials by making a simple API call
        await client.verify.v2.services(process.env.TWILIO_VERIFY_SID).fetch();
        emailEnabled = true;
        console.log('Twilio initialized successfully');
        return true;
      } else {
        console.log('Twilio credentials not set - email notifications disabled');
        return false;
      }
    } catch (error: any) {
      console.error(`Error initializing Twilio (attempt ${attempt}/${retries}):`, {
        message: error.message,
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
initializeTwilio();

export async function sendWaitlistConfirmation(
  email: string,
  fullName: string,
  customizations?: WaitlistEmailCustomizations
) {
  if (!emailEnabled) {
    console.log(`Email notifications disabled - skipping confirmation email to ${email}`);
    return;
  }

  const emailContent = waitlistConfirmationTemplate.generateHTML({
    fullName,
    customizations: {
      ...customizations,
      headerImage: '/avo-friend.png'
    }
  });

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await client.verify.v2.services(process.env.TWILIO_VERIFY_SID!)
        .verifications
        .create({
          to: email,
          channel: 'email',
          templateId: 'welcome-email',
          channelConfiguration: {
            substitutions: {
              name: fullName,
              content: emailContent
            }
          }
        });
      
      console.log(`Confirmation email sent successfully to ${email}`);
      return;
    } catch (error: any) {
      attempts++;
      console.error(`Error sending confirmation email (attempt ${attempts}/${maxAttempts}):`, {
        message: error.message,
        code: error.code,
        response: error.response
      });

      if (attempts === maxAttempts) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 10000)));
    }
  }
}
