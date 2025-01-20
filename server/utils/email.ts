import sgMail from '@sendgrid/mail';
import { waitlistConfirmationTemplate } from './email-templates/waitlist-confirmation.js';
import type { EmailConfig, WaitlistEmailCustomizations } from './types.js';
import fs from 'fs';
import path from 'path';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  if (!process.env.SENDGRID_VERIFIED_EMAIL) {
    console.error('SENDGRID_VERIFIED_EMAIL not set - cannot send email');
    return { sent: false, reason: 'Missing verified sender email' };
  }

  const inlineImage = getInlineLogoImage();
  console.log('Preparing to send email with inline image');
  console.log('Using verified sender email:', process.env.SENDGRID_VERIFIED_EMAIL);

  const msg: EmailConfig = {
    to: { 
      email: email,
      name: fullName
    },
    from: {
      email: process.env.SENDGRID_VERIFIED_EMAIL,
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
    attachments: [
      {
        content: inlineImage,
        filename: 'avo-friend.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'avo-friend'
      }
    ]
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`Confirmation email sent successfully to ${email}`, {
      response: response[0].statusCode
    });
    return { sent: true };
  } catch (error: any) {
    console.error('Failed to send confirmation email:', {
      message: error.message,
      errors: error.response?.body?.errors,
      code: error.code,
      statusCode: error.code,
      response: error.response?.body
    });
    return { 
      sent: false, 
      reason: error.response?.body?.errors?.[0]?.message || error.message 
    };
  }
}