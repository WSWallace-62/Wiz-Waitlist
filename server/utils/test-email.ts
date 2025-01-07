import sgMail from '@sendgrid/mail';
import type { EmailConfig } from './types.js';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg: EmailConfig = {
  to: 'test@example.com',
  from: 'admin@plant-based-world.com',
  subject: 'SendGrid Test Email',
  html: '<p>This is a test email from Veganize-iT</p>'
};

async function sendTestEmail() {
  try {
    const response = await sgMail.send(msg);
    console.log('SendGrid API Response:', {
      statusCode: response[0].statusCode,
      headers: response[0].headers,
      body: response[0].body
    });
  } catch (error: any) {
    console.error('SendGrid Error Details:', {
      message: error.message,
      errors: error.response?.body?.errors,
      code: error.code,
      stack: error.stack
    });
  }
}

sendTestEmail();