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
    from: 'veganize.it.app@gmail.com', // Using a simple email address for testing
    subject: waitlistConfirmationTemplate.subject,
    html: waitlistConfirmationTemplate.generateHTML({
      fullName,
      customizations: {
        ...customizations,
        // Using a base64 encoded image for now to avoid domain verification issues
        headerImage: 'data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KK+Mf+Chf7Vl38KfDa+DvCt99n8T6/D/pU8R+fT7M8bl7q7DkHttB6E1hisVTw1J1qrskdGFw1TFVo0KSvKTPOv2+P2wrr4UW7+DfBd0sXim8j/wBLu1+/p8DAgbf+mjkcAdgckZwD+cF5eXOoXc13ezSXFzcSNLLLIdzu7HJYk8kknknvUdFfkWPx9XGVnUqPyXZH7ZluX0sDRVKmvV9WFFFePftOftC6f+zh8L7zxJcxLeai+LfTbFmIFxcsCVBx0VQCxPoMdSK5aNGdaoqVNXbOmtWhRg6tV2SPYaK/M74Xf8FXPGvh/wAQqvxA0vT/ABBokrhpVtbdbO5t1z0XDeW5HqSwPt0r9F/hf8RPD/xY8F6b4q8K38d/pl9GGBVgJIX/AIopF/hde4P4jBwR9VjMrxOFjz1Y+709D43B5nhsXLkpS17PX0PRKKKg1HUbXSNPub6+uIrWztYnnnmlYKkSKCzMT2AAJNeCegT19xX8/v7UHxzu/j98ZNb8UzykWPmfZdOgJ4t7ZCQgx/ebBY+7Gv0Z/wCCj37V0fw18PS/D3wteB/E+qRg38sT/wDHhbMP4SOkrjgDsDk84B/LyvtOHsDdvFVF6L9T4PizH2SwVN+r/QKKivLyDTrSe6upo4LaFGklkkYKkaKMszE8AAck1+gn5+ea/tEfFiz+B/wh8R+L7zaZrSD/RIGbHm3MhCRJ9C5Ge4GT2r8NvEXiLUPF3iDUtZ1W4a61HUp5Lq4lY8vI7FmP5mvff2+P2kZPjp8V3stNuPM8MeHd1rYhW+WeY8POw7gkAL/7II6k14DX5pnePeKr8kX7sNPXufq+SYGODW+s/el+QUUUV4B74UUUUAf//Z'
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