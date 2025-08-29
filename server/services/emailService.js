import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@pharmgenius.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'PharmGenius';
    this.enabled = !!process.env.SENDGRID_API_KEY;
  }

  // Send welcome email
  async sendWelcomeEmail(email, firstName) {
    if (!this.enabled) {
      console.log('Email service disabled - welcome email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Welcome to PharmGenius!',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Welcome email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, firstName, resetUrl) {
    if (!this.enabled) {
      console.log('Email service disabled - password reset email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Reset Your PharmGenius Password',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          resetUrl,
          expiryHours: 1,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  // Send password changed confirmation email
  async sendPasswordChangedEmail(email, firstName) {
    if (!this.enabled) {
      console.log('Email service disabled - password changed email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Your Password Has Been Changed',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Password changed email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send password changed email:', error);
      throw error;
    }
  }

  // Send consultation confirmation email
  async sendConsultationConfirmation(email, firstName, consultationData) {
    if (!this.enabled) {
      console.log('Email service disabled - consultation confirmation email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Consultation Confirmed',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          consultationDate: consultationData.scheduledAt,
          consultationType: consultationData.consultationType,
          providerName: consultationData.providerName,
          duration: consultationData.duration,
          loginUrl: `${process.env.FRONTEND_URL}/consultations/${consultationData.id}`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Consultation confirmation email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send consultation confirmation email:', error);
      throw error;
    }
  }

  // Send consultation reminder email
  async sendConsultationReminder(email, firstName, consultationData) {
    if (!this.enabled) {
      console.log('Email service disabled - consultation reminder email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Consultation Reminder',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          consultationDate: consultationData.scheduledAt,
          consultationType: consultationData.consultationType,
          providerName: consultationData.providerName,
          duration: consultationData.duration,
          loginUrl: `${process.env.FRONTEND_URL}/consultations/${consultationData.id}`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Consultation reminder email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send consultation reminder email:', error);
      throw error;
    }
  }

  // Send course enrollment confirmation email
  async sendCourseEnrollmentEmail(email, firstName, courseData) {
    if (!this.enabled) {
      console.log('Email service disabled - course enrollment email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Course Enrollment Confirmed',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          courseTitle: courseData.title,
          courseDescription: courseData.description,
          estimatedDuration: courseData.estimatedDuration,
          loginUrl: `${process.env.FRONTEND_URL}/courses/${courseData.id}`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Course enrollment email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send course enrollment email:', error);
      throw error;
    }
  }

  // Send payment receipt email
  async sendPaymentReceipt(email, firstName, paymentData) {
    if (!this.enabled) {
      console.log('Email service disabled - payment receipt email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Payment Receipt',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          amount: (paymentData.amount / 100).toFixed(2),
          currency: paymentData.currency,
          description: paymentData.description,
          transactionId: paymentData._id,
          date: new Date().toLocaleDateString(),
          loginUrl: `${process.env.FRONTEND_URL}/payments`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Payment receipt email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send payment receipt email:', error);
      throw error;
    }
  }

  // Send subscription renewal reminder email
  async sendSubscriptionRenewalReminder(email, firstName, subscriptionData) {
    if (!this.enabled) {
      console.log('Email service disabled - subscription renewal reminder email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Subscription Renewal Reminder',
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          plan: subscriptionData.plan,
          renewalDate: subscriptionData.currentPeriodEnd,
          amount: (subscriptionData.amount / 100).toFixed(2),
          currency: subscriptionData.currency,
          loginUrl: `${process.env.FRONTEND_URL}/subscription`,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Subscription renewal reminder email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send subscription renewal reminder email:', error);
      throw error;
    }
  }

  // Send general notification email
  async sendNotificationEmail(email, firstName, subject, message, actionUrl = null, actionText = null) {
    if (!this.enabled) {
      console.log('Email service disabled - notification email would be sent to:', email);
      return true;
    }

    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        templateId: 'd-1234567890abcdef', // Replace with your SendGrid template ID
        dynamicTemplateData: {
          firstName,
          message,
          actionUrl,
          actionText,
          loginUrl: process.env.FRONTEND_URL,
          supportEmail: 'support@pharmgenius.com'
        }
      };

      await sgMail.send(msg);
      console.log('Notification email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw error;
    }
  }

  // Send bulk emails (for newsletters, announcements, etc.)
  async sendBulkEmail(emails, subject, templateId, dynamicTemplateData) {
    if (!this.enabled) {
      console.log('Email service disabled - bulk email would be sent to:', emails.length, 'recipients');
      return true;
    }

    try {
      const personalizations = emails.map(email => ({
        to: [{ email }],
        dynamicTemplateData: {
          ...dynamicTemplateData,
          unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`
        }
      }));

      const msg = {
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        templateId,
        personalizations
      };

      await sgMail.send(msg);
      console.log('Bulk email sent to:', emails.length, 'recipients');
      return true;
    } catch (error) {
      console.error('Failed to send bulk email:', error);
      throw error;
    }
  }

  // Test email service
  async testEmailService() {
    if (!this.enabled) {
      return {
        enabled: false,
        message: 'Email service is disabled (no SENDGRID_API_KEY)'
      };
    }

    try {
      const testMsg = {
        to: 'test@example.com',
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'PharmGenius Email Service Test',
        text: 'This is a test email to verify the email service is working correctly.',
        html: '<p>This is a test email to verify the email service is working correctly.</p>'
      };

      // Don't actually send the test email, just verify configuration
      return {
        enabled: true,
        message: 'Email service is configured and ready',
        fromEmail: this.fromEmail,
        fromName: this.fromName
      };
    } catch (error) {
      return {
        enabled: false,
        message: 'Email service configuration error',
        error: error.message
      };
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export individual functions for backward compatibility
export const sendWelcomeEmail = (email, firstName) => emailService.sendWelcomeEmail(email, firstName);
export const sendPasswordResetEmail = (email, firstName, resetUrl) => emailService.sendPasswordResetEmail(email, firstName, resetUrl);
export const sendPasswordChangedEmail = (email, firstName) => emailService.sendPasswordChangedEmail(email, firstName);
export const sendConsultationConfirmation = (email, firstName, consultationData) => emailService.sendConsultationConfirmation(email, firstName, consultationData);
export const sendConsultationReminder = (email, firstName, consultationData) => emailService.sendConsultationReminder(email, firstName, consultationData);
export const sendCourseEnrollmentEmail = (email, firstName, courseData) => emailService.sendCourseEnrollmentEmail(email, firstName, courseData);
export const sendPaymentReceipt = (email, firstName, paymentData) => emailService.sendPaymentReceipt(email, firstName, paymentData);
export const sendSubscriptionRenewalReminder = (email, firstName, subscriptionData) => emailService.sendSubscriptionRenewalReminder(email, firstName, subscriptionData);
export const sendNotificationEmail = (email, firstName, subject, message, actionUrl, actionText) => emailService.sendNotificationEmail(email, firstName, subject, message, actionUrl, actionText);
export const sendBulkEmail = (emails, subject, templateId, dynamicTemplateData) => emailService.sendBulkEmail(emails, subject, templateId, dynamicTemplateData);
export const testEmailService = () => emailService.testEmailService();

export default emailService;
