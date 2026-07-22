/**
 * SubscriptionController — wiring tests for changePlan / cancel / resume.
 *
 * Boundary contract only: asserts the service is called with the right
 * shape ({ id, userId } [+ plan]), where userId always comes from the
 * validated @User() context, never a client-controllable value. The actual
 * pattern-string + RPC payload assertions live in subscription.service.spec.ts
 * below, mirroring the split already used by organization.controller.spec.ts
 * (controller = pure dispatch, service = RPC contract).
 *
 * Strategy: direct instantiation (new SubscriptionController(mock)) — no
 * Nest DI, no guard resolution, no broker. Same style as
 * organization.controller.spec.ts.
 */

import { SubscriptionController } from './subscription.controller';
import { AuthenticatedUser } from 'src/common/interfaces/current-user-context.type';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { SubscriptionPlan } from './enums/subscription-plan.enum';

const SUBSCRIPTION_ID = 'sub00000-aaaa-aaaa-aaaa-000000000001';
const USER_ID = 'usr00000-aaaa-aaaa-aaaa-000000000001';

function makeUser(): AuthenticatedUser {
  return {
    id: USER_ID,
    platformRole: PlatformRolesEnum.STAFF,
    aud: 'saas',
  };
}

describe('SubscriptionController — wiring (changePlan / cancel / resume)', () => {
  let controller: SubscriptionController;
  const svc = {
    changePlan: jest.fn(),
    cancel: jest.fn(),
    resume: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new SubscriptionController(svc as any);
  });

  describe('PATCH /subscription/me/:id/plan — changePlan', () => {
    it('calls service.changePlan(id, userId, plan) with userId from @User(), not the body', () => {
      const user = makeUser();
      controller.changePlan(SUBSCRIPTION_ID, { plan: SubscriptionPlan.PRO }, user);

      expect(svc.changePlan).toHaveBeenCalledTimes(1);
      expect(svc.changePlan).toHaveBeenCalledWith(
        SUBSCRIPTION_ID,
        USER_ID,
        SubscriptionPlan.PRO,
      );
    });

    it('forwards whatever id the :id param resolved to (post ParseUUIDPipe)', () => {
      const user = makeUser();
      const otherId = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';
      controller.changePlan(otherId, { plan: SubscriptionPlan.BASIC }, user);

      expect(svc.changePlan).toHaveBeenCalledWith(
        otherId,
        USER_ID,
        SubscriptionPlan.BASIC,
      );
    });
  });

  describe('DELETE /subscription/me/:id — cancel', () => {
    it('calls service.cancel(id, userId) with userId from @User()', () => {
      const user = makeUser();
      controller.cancel(SUBSCRIPTION_ID, user);

      expect(svc.cancel).toHaveBeenCalledTimes(1);
      expect(svc.cancel).toHaveBeenCalledWith(SUBSCRIPTION_ID, USER_ID);
    });

    it('method signature takes @Param() + @User() only — no body (length === 2)', () => {
      expect(controller.cancel.length).toBe(2);
    });
  });

  describe('PATCH /subscription/me/:id/resume — resume', () => {
    it('calls service.resume(id, userId) with userId from @User()', () => {
      const user = makeUser();
      controller.resume(SUBSCRIPTION_ID, user);

      expect(svc.resume).toHaveBeenCalledTimes(1);
      expect(svc.resume).toHaveBeenCalledWith(SUBSCRIPTION_ID, USER_ID);
    });

    it('method signature takes @Param() + @User() only — no body (length === 2)', () => {
      expect(controller.resume.length).toBe(2);
    });
  });
});
