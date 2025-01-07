import sgMail from '@sendgrid/mail';

let emailEnabled = false;

try {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    emailEnabled = true;
  } else {
    console.log('SENDGRID_API_KEY not set - email notifications disabled');
  }
} catch (error) {
  console.error('Error initializing SendGrid:', error);
  console.log('Email notifications will be disabled');
}

export async function sendWaitlistConfirmation(email: string, fullName: string) {
  if (!emailEnabled) {
    console.log('Email notifications disabled - skipping confirmation email');
    return;
  }

  const msg = {
    to: email,
    from: 'notifications@plant-based-world.com', // Replace with your verified sender
    subject: 'Welcome to the Veganize-iT Waitlist!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Welcome to Veganize-iT!</h2>
        <p>Hi ${fullName},</p>
        <p>Thank you for joining the waitlist for Veganize-iT! We're thrilled to have you as part of our growing community of plant-based food enthusiasts.</p>
        <p>You'll be among the first to know when we launch our innovative recipe conversion platform that will help you:</p>
        <ul>
          <li>Transform traditional recipes into delicious vegan alternatives</li>
          <li>Customize recipes based on your dietary preferences and restrictions</li>
          <li>Get personalized nutrition tracking and recommendations</li>
        </ul>
        <p>We'll notify you as soon as early access becomes available.</p>
        <p>In the meantime, feel free to follow us on social media for updates and plant-based inspiration!</p>
        <p>Best regards,<br>The Veganize-iT Team</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error - allow the signup process to continue
  }
}