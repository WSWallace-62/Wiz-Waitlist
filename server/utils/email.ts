import sgMail from '@sendgrid/mail';

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
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
    }
  }
  return false;
}

// Initialize on startup
initializeSendGrid();

export async function sendWaitlistConfirmation(email: string, fullName: string) {
  if (!emailEnabled) {
    console.log(`Email notifications disabled - skipping confirmation email to ${email}`);
    return;
  }

  const msg = {
    to: email,
    from: 'notifications@plant-based-world.com',
    subject: 'Welcome to the Veganize-iT Waitlist! 🌱',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/your-repo/avo-friend.png" alt="Veganize-iT Mascot" style="width: 100px; height: auto;" />
        </div>

        <h2 style="color: #2E7D32; text-align: center; margin-bottom: 20px;">Welcome to Veganize-iT!</h2>

        <p style="color: #333333; font-size: 16px;">Hi ${fullName},</p>

        <p style="color: #333333; font-size: 16px;">Thank you for joining the waitlist for Veganize-iT! We're thrilled to have you as part of our growing community of plant-based food enthusiasts.</p>

        <div style="background-color: #F1F8E9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333333; font-size: 16px; margin-bottom: 10px;">You'll be among the first to know when we launch our innovative recipe conversion platform that will help you:</p>
          <ul style="color: #333333; font-size: 16px;">
            <li style="margin-bottom: 8px;">Transform traditional recipes into delicious vegan alternatives</li>
            <li style="margin-bottom: 8px;">Customize recipes based on your dietary preferences and restrictions</li>
            <li style="margin-bottom: 8px;">Get personalized nutrition tracking and recommendations</li>
          </ul>
        </div>

        <p style="color: #333333; font-size: 16px;">We'll notify you as soon as early access becomes available.</p>

        <p style="color: #333333; font-size: 16px;">In the meantime, feel free to follow us on social media for updates and plant-based inspiration!</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EEEEEE;">
          <p style="color: #666666; font-size: 14px;">Best regards,<br>The Veganize-iT Team</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666666;">
          <p>If you didn't sign up for Veganize-iT, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await sgMail.send(msg);
      console.log(`Confirmation email sent successfully to ${email}`);
      return;
    } catch (error) {
      attempts++;
      console.error(`Error sending confirmation email (attempt ${attempts}/${maxAttempts}):`, error);

      if (attempts === maxAttempts) {
        console.error('Max retry attempts reached for sending email');
        // Don't throw error - allow the signup process to continue
        return;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 10000)));
    }
  }
}