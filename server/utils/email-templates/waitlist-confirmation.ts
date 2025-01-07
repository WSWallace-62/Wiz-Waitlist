import { EmailTemplate } from '../types';

export const waitlistConfirmationTemplate: EmailTemplate = {
  subject: 'Welcome to the Veganize-iT Waitlist! 🌱',
  generateHTML: (data: { fullName: string; customizations?: { 
    accentColor?: string;
    headerImage?: string;
    features?: string[];
    footerText?: string;
  } }) => {
    const {
      fullName,
      customizations = {}
    } = data;

    const {
      accentColor = '#2E7D32',
      headerImage = '/avo-friend.png',
      features = [
        'Transform traditional recipes into delicious vegan alternatives',
        'Customize recipes based on your dietary preferences and restrictions',
        'Get personalized nutrition tracking and recommendations'
      ],
      footerText = 'If you didn\'t sign up for Veganize-iT, please ignore this email.'
    } = customizations;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${headerImage}" alt="Veganize-iT Mascot" style="width: 100px; height: auto;" />
        </div>

        <h2 style="color: ${accentColor}; text-align: center; margin-bottom: 20px;">Welcome to Veganize-iT!</h2>

        <p style="color: #333333; font-size: 16px;">Hi ${fullName},</p>

        <p style="color: #333333; font-size: 16px;">Thank you for joining the waitlist for Veganize-iT! We're thrilled to have you as part of our growing community of plant-based food enthusiasts.</p>

        <div style="background-color: ${accentColor}15; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333333; font-size: 16px; margin-bottom: 10px;">You'll be among the first to know when we launch our innovative recipe conversion platform that will help you:</p>
          <ul style="color: #333333; font-size: 16px;">
            ${features.map(feature => `
              <li style="margin-bottom: 8px;">${feature}</li>
            `).join('')}
          </ul>
        </div>

        <p style="color: #333333; font-size: 16px;">We'll notify you as soon as early access becomes available.</p>

        <p style="color: #333333; font-size: 16px;">In the meantime, feel free to follow us on social media for updates and plant-based inspiration!</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EEEEEE;">
          <p style="color: #666666; font-size: 14px;">Best regards,<br>The Veganize-iT Team</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666666;">
          <p>${footerText}</p>
        </div>
      </div>
    `;
  }
};
