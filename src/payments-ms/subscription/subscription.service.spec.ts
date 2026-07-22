/**
 * SubscriptionService — RPC contract tests for changePlan / cancel / resume.
 *
 * Boundary contract only: asserts the correct pattern string is sent and the
 * payload has the expected shape, using the established mocked-ClientProxy
 * approach (src/common/testing/mock-client-proxy.ts) — same style as the
 * CRUD contract harness specs. Mocks the ClientProxy; does not run payments-ms.
 */

import { SubscriptionService } from './subscription.service';
import { SUBSCRIPTION_PATTERNS } from './patterns/suscription_patterns';
import { SubscriptionPlan } from './enums/subscription-plan.enum';
import { createMockClientProxy } from 'src/common/testing/mock-client-proxy';

const SUBSCRIPTION_ID = 'sub00000-aaaa-aaaa-aaaa-000000000001';
const USER_ID = 'usr00000-aaaa-aaaa-aaaa-000000000001';

describe('SubscriptionService — RPC contract (changePlan / cancel / resume)', () => {
  it('changePlan sends SUBSCRIPTION_PATTERNS.CHANGE_PLAN with { id, userId, plan } and passes the response through', async () => {
    const response = { id: SUBSCRIPTION_ID, plan: SubscriptionPlan.PRO };
    const client = createMockClientProxy(response);
    const service = new SubscriptionService(client as any);

    const result = await service.changePlan(
      SUBSCRIPTION_ID,
      USER_ID,
      SubscriptionPlan.PRO,
    );

    expect(client.send).toHaveBeenCalledWith(
      SUBSCRIPTION_PATTERNS.CHANGE_PLAN,
      { id: SUBSCRIPTION_ID, userId: USER_ID, plan: SubscriptionPlan.PRO },
    );
    expect(result).toEqual(response);
  });

  it('cancel sends SUBSCRIPTION_PATTERNS.CANCEL with { id, userId } and passes the response through', async () => {
    const response = { id: SUBSCRIPTION_ID, cancelAtPeriodEnd: true };
    const client = createMockClientProxy(response);
    const service = new SubscriptionService(client as any);

    const result = await service.cancel(SUBSCRIPTION_ID, USER_ID);

    expect(client.send).toHaveBeenCalledWith(SUBSCRIPTION_PATTERNS.CANCEL, {
      id: SUBSCRIPTION_ID,
      userId: USER_ID,
    });
    expect(result).toEqual(response);
  });

  it('resume sends SUBSCRIPTION_PATTERNS.RESUME with { id, userId } and passes the response through', async () => {
    const response = { id: SUBSCRIPTION_ID, cancelAtPeriodEnd: false };
    const client = createMockClientProxy(response);
    const service = new SubscriptionService(client as any);

    const result = await service.resume(SUBSCRIPTION_ID, USER_ID);

    expect(client.send).toHaveBeenCalledWith(SUBSCRIPTION_PATTERNS.RESUME, {
      id: SUBSCRIPTION_ID,
      userId: USER_ID,
    });
    expect(result).toEqual(response);
  });

  it('pattern strings for the three flows are distinct', () => {
    const patterns = [
      SUBSCRIPTION_PATTERNS.CHANGE_PLAN,
      SUBSCRIPTION_PATTERNS.CANCEL,
      SUBSCRIPTION_PATTERNS.RESUME,
    ];
    expect(new Set(patterns).size).toBe(patterns.length);
  });
});
