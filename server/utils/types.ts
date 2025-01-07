export interface EmailTemplate {
  subject: string;
  generateHTML: (data: any) => string;
}

export interface EmailConfig {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export interface WaitlistEmailCustomizations {
  accentColor?: string;
  headerImage?: string;
  features?: string[];
  footerText?: string;
}
