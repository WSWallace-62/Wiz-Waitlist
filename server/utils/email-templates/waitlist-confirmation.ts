import type { EmailTemplate, WaitlistEmailCustomizations } from '../types.js';

export const waitlistConfirmationTemplate: EmailTemplate = {
  subject: 'Welcome to The Wiz! 🌱',
  generateHTML: (data: { fullName: string; customizations?: WaitlistEmailCustomizations }) => {
    const {
      fullName,
      customizations = {}
    } = data;

    const {
      accentColor = '#2E7D32',
      headerImage,
      features = [
        'Transform traditional recipes into delicious plant-based alternatives',
        'Customize recipes based on your dietary preferences and restrictions',
        'Get personalized nutrition tracking and recommendations'
      ],
      footerText = 'If you didn\'t sign up for The Wiz, please ignore this email.'
    } = customizations;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to The Wiz</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            ${headerImage ? `
              <img src="${headerImage}" 
                   alt="The Vegan Wiz Mascot" 
                   style="width: 50px; height: auto; max-width: 50px; display: inline-block;"
                   width="50"
              />
            ` : `
              <div style="width: 50px; height: 50px; margin: 0 auto; background-color: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🥑</span>
              </div>
            `}
          </div>

          <h2 style="color: ${accentColor}; text-align: center; margin-bottom: 20px;">Welcome to The Vegan Wiz!</h2>

          <p style="color: #333333; font-size: 16px;">Hi ${fullName},</p>

          <p style="color: #333333; font-size: 16px;">Thank you for joining the waitlist for The Wiz! We're thrilled to have you as part of our growing community of plant-based food enthusiasts.</p>

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
            <p style="color: #666666; font-size: 14px;">Best regards,<br>The Vegan Wiz Team</p>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666666;">
            <p>${footerText}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};