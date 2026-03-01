import { addEmailToQueue } from '../queues/email.queue';

const generateProfessionalEmailTemplate = (
  content: string,
  options: { title: string; preheader?: string }
): string => {
  const { title, preheader = '' } = options;
  const logoUrl = 'https://res.cloudinary.com/dwddmg323/image/upload/v1770434490/logo_sddfri.png';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #F8FAFC;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1E293B;
      line-height: 1.6;
    }
    table { border-collapse: collapse; }

    .email-wrapper {
      background: #F8FAFC;
      padding: 40px 20px;
    }

    .container {
      max-width: 600px;
      margin: 30px 20px; 
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    }

    .logo-section {
      text-align: center;
      padding: 32px 20px 10px;
      background: #FFFFFF;
    }

    .logo-text {
      font-size: 28px;
      font-weight: 800;
      color: #4640DE;
      letter-spacing: -1px;
      margin: 0;
      font-family: 'Inter', sans-serif;
    }

    .content {
      padding: 0 40px 40px;
      font-size: 16px;
      color: #334155;
    }

    .content h1, .content h2 {
      color: #0F172A;
      font-size: 24px;
      margin: 0 0 20px 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .content p {
      margin: 0 0 16px;
      color: #475569;
    }

    .otp-code {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #4640DE;
      text-align: center;
      padding: 24px;
      background: #F1F5F9;
      border-radius: 12px;
      margin: 24px 0;
      border: 1px solid #E2E8F0;
    }

    .highlight-box {
      background: #F1F5F9;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 10px;
      font-size: 14px;
    }

    .highlight-box strong {
        color: #0F172A;
    }

    .highlight-box ul {
      margin: 12px 0 0;
      padding-left: 20px;
    }

    .highlight-box li {
      margin-bottom: 8px;
      color: #475569;
    }

    .button {
      display: inline-block;
      background: #4640DE;
      color: #FFFFFF !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-pending {
      background: #FEF3C7;
      color: #92400E;
    }

    .badge-approved {
      background: #DCFCE7;
      color: #166534;
    }

    .status-approved {
        background: #DCFCE7;
        color: #166534;
    }

    .badge-rejected {
      background: #FEE2E2;
      color: #991B1B;
    }

    .status-rejected {
        background: #FEE2E2;
        color: #991B1B;
    }

    .footer {
      background: #FFFFFF;
      padding: 20px 40px;
      text-align: center;
      font-size: 14px;
      color: #64748B;
      border-top: 1px solid #F1F5F9;
    }
    .social-links {
      margin: 20px 0 24px;
    }

    .social-icon {
      display: inline-block;
      margin: 0 12px;
      text-decoration: none;
    }

    .social-icon img {
      width: 24px;
      height: 24px;
      margin-bottom: 0;
      opacity: 0.7;
    }

    .footer a {
      color: #4640DE;
      text-decoration: none;
    }

    @media (max-width: 600px) {
      .email-wrapper { padding: 20px 10px; }
      .content { padding: 0 24px 32px; }
      .logo-section { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  ${
    preheader
      ? `<div style="display:none;font-size:1px;color:#f5f7fa;line-height:1px;max-height:0;overflow:hidden;">${preheader}</div>`
      : ''
  }

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-wrapper">
    <tr>
      <td align="center">
        <table class="container" role="presentation">
          <!-- Logo -->
          <tr>
            <td class="logo-section">
              <div class="logo-text">QuickHire</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <div class="social-links">
                <a href="https://facebook.com/quick-hire" class="social-icon">
                  <img src="https://img.icons8.com/ios-filled/50/4640DE/facebook-new.png" alt="Facebook">
                </a>
                <a href="https://instagram.com/quick-hire" class="social-icon">
                  <img src="https://img.icons8.com/ios-filled/50/4640DE/instagram-new.png" alt="Instagram">
                </a>
                <a href="https://linkedin.com/company/quick-hire" class="social-icon">
                  <img src="https://img.icons8.com/ios-filled/50/4640DE/linkedin.png" alt="LinkedIn">
                </a>
              </div>

              <p style="margin: 0 0 8px;">
                <a href="https://quick-hire.app">www.quick-hire.app</a> | <a href="mailto:support@quick-hire.app">support@quick-hire.app</a>
              </p>
              <p style="margin: 0;">
                © ${new Date().getFullYear()} QuickHire. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const generateOTPSection = (otp: string, minutes: number = 30) => `
  <p>Please enter the following verification code to proceed:</p>
  <div class="otp-code">${otp}</div>
  <p style="text-align: center; color: #718096; font-size: 13px;">This code will expire in ${minutes} minutes</p>
`;

const generateHighlightBox = (html: string) => `
  <div class="highlight-box">${html}</div>
`;

const generateButton = (text: string, url: string) => `
  <div style="text-align:center; margin:10px 0;">
    <a href="${url}" class="button" target="_blank">${text}</a>
  </div>
`;

// ──────────────────────────────────────────────
// Email Functions (all in English)
export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  const subject = 'Welcome to QuickHire!';
  const content = `
    <h1>Welcome, ${name}!</h1>
    <p>You're now part of QuickHire — the most efficient way to connect with top job opportunities and hire the best talent.</p>
    ${generateHighlightBox(`
      <p><strong>What you can do on QuickHire:</strong></p>
      <ul style="padding-left:24px; margin:16px 0;">
        <li>Create a professional profile and upload your resume</li>
        <li>Browse and apply for top job opportunities</li>
        <li>Track your application status in real-time</li>
        <li>Get personalized job alerts based on your skills</li>
      </ul>
    `)}
    <p>Ready to launch your next career move?</p>
    ${generateButton('Explore Jobs', 'https://quick-hire.app/jobs')}
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Welcome to QuickHire',
    preheader: `Hi ${name}, your career journey starts now with QuickHire!`,
  });

  await addEmailToQueue({ to, subject, html });
};

export const sendVerificationEmail = async (to: string, otp: string): Promise<void> => {
  const subject = 'Verify Your Email – QuickHire';
  const content = `
    <p>Thank you for signing up for QuickHire! Please use the code below to verify your email address:</p>
    ${generateOTPSection(otp, 15)}
    <p style="color:var(--muted); font-size:14px;">If you didn’t request this, you can safely ignore this email.</p>
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Email Verification',
    preheader: `Your verification code: ${otp}`,
  });

  await addEmailToQueue({ to, subject, html });
};

export const sendResetPasswordEmail = async (to: string, otp: string): Promise<void> => {
  const subject = 'Password Reset Request – Your OTP Code';
  const content = `
    <p>You requested to reset your password. Use the OTP below to continue:</p>
    ${generateOTPSection(otp, 15)}
    <p style="color:var(--muted); font-size:14px;">If you didn’t request this, your password will remain unchanged.</p>
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Password Reset',
    preheader: `Your reset code: ${otp}`,
  });

  await addEmailToQueue({ to, subject, html });
};

// ──────────────────────────────────────────────
// Company Registration Emails
export const sendPendingCompanyRegistrationEmail = async (
  to: string,
  name: string,
  companyName: string
): Promise<void> => {
  const subject = 'Company Profile Under Review – QuickHire';
  const content = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering <strong>${companyName}</strong> on QuickHire. Your profile is currently under review by our admin team.</p>
    ${generateHighlightBox(`
      <p><strong>Registration Details:</strong></p>
      <ul style="padding-left:24px; margin:16px 0;">
        <li>Company: ${companyName}</li>
        <li>Status: <span class="status-badge status-pending">Pending</span></li>
      </ul>
    `)}
    <p>We'll notify you once your profile has been verified.</p>
    <p style="color: #6b7280; font-size: 14px;">Verification usually takes 1-2 business days.</p>
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Registration Pending',
    preheader: `Your company registration for ${companyName} is under review`,
  });

  await addEmailToQueue({ to, subject, html });
};

export const sendCompanyRegistrationApprovedEmail = async (
  to: string,
  name: string,
  companyName: string
): Promise<void> => {
  const subject = 'Your Company Profile has been Approved! 🎊';
  const content = `
    <p>Great news <strong>${name}</strong>,</p>
    <p>Your company profile for <strong>${companyName}</strong> has been <span class="status-badge status-approved">Approved</span>.</p>
    ${generateHighlightBox(`
      <p><strong>What's Next:</strong></p>
      <ul style="padding-left:24px; margin:16px 0;">
        <li>You can now post job listings to our platform.</li>
        <li>Browse and manage applications from top candidates.</li>
        <li>Access your company analytics dashboard.</li>
      </ul>
    `)}
    <p>Ready to build your team? Click below to post your first job.</p>
    ${generateButton('Post a Job', 'https://quick-hire.app/dashboard/jobs/new')}
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Registration Approved',
    preheader: `Your company ${companyName} has been approved on QuickHire.`,
  });

  await addEmailToQueue({ to, subject, html });
};

export const sendCompanyRegistrationRejectedEmail = async (
  to: string,
  name: string,
  companyName: string,
  reason?: string
): Promise<void> => {
  const subject = 'Company Profile Verification Update';
  const content = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>We've reviewed your company profile for <strong>${companyName}</strong> and unfortunately, we couldn't approve it at this time (<span class="status-badge status-rejected">Rejected</span>).</p>
    ${
      reason
        ? generateHighlightBox(`
      <p><strong>Reason for Rejection:</strong></p>
      <p style="margin-top: 8px; color: #991B1B; font-weight: 500;">${reason}</p>
    `)
        : ''
    }
    <p>Please update your profile details and re-submit for verification.</p>
    ${generateButton('Update Profile', 'https://quick-hire.app/dashboard/company/edit')}
    <p style="color: #64748B; font-size: 14px; margin-top: 24px;">Need assistance? Please contact our support team.</p>
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Registration Rejected',
    preheader: `Action required for your company profile on QuickHire.`,
  });

  await addEmailToQueue({ to, subject, html });
};

// ──────────────────────────────────────────────
// User Created Email
export const sendUserCreatedEmail = async (
  to: string,
  name: string,
  adminName: string,
  defaultPassword: string
): Promise<void> => {
  const subject = 'Welcome to QuickHire – Account Created';
  const content = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your QuickHire account has been created by <strong>${adminName}</strong>. Your default password is <strong>${defaultPassword}</strong>. Please change your password after logging in for the first time.</p>
    ${generateHighlightBox(`
      <p><strong>What you can do:</strong></p>
      <ul style="padding-left:24px; margin:16px 0;">
        <li>Complete your profile to attract top employers</li>
        <li>Search and apply for thousands of matching jobs</li>
        <li>Manage your applications and interviews</li>
      </ul>
    `)}
    <p>You can now log in and start your job search.</p>
    ${generateButton('Log In to QuickHire', 'https://quick-hire.app/login')}
  `;

  const html = generateProfessionalEmailTemplate(content, {
    title: 'Welcome to QuickHire',
    preheader: `Your account has been created by ${adminName}`,
  });

  await addEmailToQueue({ to, subject, html });
};
