export const PAYMENT_PATTERNS = {
  // Checkout
  CREATE_PAYMENT_SESSION: 'payment.session.create.payment',

  // Queries
  CREATE: 'payment.create.payment',
  GET_BY_ID: 'payment.get_by_id',
  FIND_ALL: 'payment.find_all',
  FIND_MY: 'payment.find_my',
  FIND_MY_BY_ID: 'payment.find_my_by_id',
  UPDATE: 'payment.update',
  CANCEL: 'payment.cancel',
  TOTALS_BY_METHOD: 'payment.totals_by_method',
  TOTALS_BY_METHOD_RANGE: 'payment.totals_by_method_range',

  // Lifecycle (webhook)
  WEB_HOOK_STRIPE: 'payment.webhook.stripe',
  WEB_HOOK_PAYPAL: 'payment.webhook.paypal',
  CONFIRM: 'payment.confirm',
  FAIL: 'payment.fail',

  // Optional
  REFUND: 'payment.refund',
} as const;