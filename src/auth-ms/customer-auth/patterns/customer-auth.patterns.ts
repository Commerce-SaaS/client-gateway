export const CUSTOMER_AUTH_PATTERNS = {
  REGISTER: 'auth.customer.register',
  LOGIN: 'auth.customer.login',
  GOOGLE_AUTH: 'auth.customer.google',
  REFRESH: 'auth.customer.refresh',
  CHANGE_PASSWORD: 'auth.customer.change_password',
  FORGOT_PASSWORD: 'auth.customer.forgot_password',
  RESET_PASSWORD: 'auth.customer.reset_password',
  VERIFY_EMAIL: 'customer.auth.verify-email',
  RESEND_VERIFICATION: 'customer.auth.resend-verification',
  CHANGE_EMAIL_REQUEST: 'customer.auth.change-email.request',
  CHANGE_EMAIL_CONFIRM: 'customer.auth.change-email.confirm',
} as const;
