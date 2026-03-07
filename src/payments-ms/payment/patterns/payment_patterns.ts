export const PAYMENT_PATTERNS = {
  // Checkout
  CREATE_PAYMENT_SESSION: 'payment.session.create.payment',

  // Queries
  GET_BY_ID: 'payment.get_by_id',

  // Lifecycle (normalmente disparado por webhook)
  WEB_HOOK_STRIPE: 'payment.webhook.stripe',
  WEB_HOOK_PAYPAL: 'payment.webhook.paypal',
  CONFIRM: 'payment.confirm',
  FAIL: 'payment.fail',

  // Optional / futuro
  REFUND: 'payment.refund',
} as const;