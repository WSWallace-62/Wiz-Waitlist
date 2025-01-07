import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendWaitlistConfirmation(email: string, fullName: string) {
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
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send confirmation email');
  }
}
