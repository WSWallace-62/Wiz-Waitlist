export interface EmailTemplate {
  subject: string;
  generateHTML: (data: any) => string;
}

export interface EmailConfig {
  to: string;
  from: {
    email: string;
    name: string;
  };
  subject: string;
  html: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
    content_id: string;
  }>;
}

export interface WaitlistEmailCustomizations {
  accentColor?: string;
  headerImage?: string;
  features?: string[];
  footerText?: string;
}