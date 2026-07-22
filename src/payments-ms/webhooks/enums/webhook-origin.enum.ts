// Marks which Stripe webhook endpoint an event arrived through. Marking
// only — never used to reject or drop an event. Must stay character-for-
// character identical to payments-ms/src/webhooks/enums/webhook-origin.enum.ts,
// since the string values (not the enum name) are what crosses the queue.
export enum WebhookOrigin {
  PLATFORM = 'platform',
  CONNECT = 'connect',
}
