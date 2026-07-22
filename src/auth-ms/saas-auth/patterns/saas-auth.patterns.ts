export const SAAS_AUTH_PATTERNS = {
  REGISTER: 'auth.saas.register',
  VERIFY_EMAIL: 'auth.saas.verify_email',
  RESEND_VERIFICATION: 'auth.saas.resend_verification',
  LOGIN: 'auth.saas.login',
  REFRESH: 'auth.saas.refresh',
  GOOGLE_AUTH: 'auth.saas.google',
  CHANGE_EMAIL_REQUEST: 'saas.auth.change-email.request',
  CHANGE_EMAIL_CONFIRM: 'saas.auth.change-email.confirm',
  CHANGE_PASSWORD: 'auth.saas.change_password',
  FORGOT_PASSWORD: 'auth.saas.forgot_password',
  RESET_PASSWORD: 'auth.saas.reset_password',
} as const;
