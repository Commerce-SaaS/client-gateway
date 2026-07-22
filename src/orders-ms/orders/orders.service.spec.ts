/**
 * OrdersService.create — orchestration tests (product snapshot resolution).
 *
 * PIN test: locks in current behavior before any fix (see /orders Step 3 —
 * fix options reported separately, no app-code change here). Boundary mocks
 * only: productsService (the collaborator OrdersService actually calls) and
 * the orders ClientProxy.
 */

import { OrdersService } from './orders.service';
import { ORDER_PATTERNS } from './patterns/order-patterns';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { createMockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORG_ID = 'org00000-aaaa-aaaa-aaaa-000000000001';
const USER_ID = 'usr00000-aaaa-aaaa-aaaa-000000000001';
const PRODUCT_A = 'prod0000-aaaa-aaaa-aaaa-00000000000a';
const PRODUCT_B = 'prod0000-aaaa-aaaa-aaaa-00000000000b';

function makeStaffUser(): CurrentUserContext {
  return {
    id: USER_ID,
    organizationId: ORG_ID,
    platformRole: PlatformRolesEnum.STAFF,
    organizationRole: OrganizationRole.STAFF,
    aud: 'saas',
    stripeAccountId: null,
    email: 'staff@example.com',
  };
}

function makeCreateOrderDto() {
  return {
    items: [
      { productId: PRODUCT_A, name: 'Pizza', unitPrice: 10, quantity: 2 },
      { productId: PRODUCT_B, name: 'Soda', unitPrice: 2, quantity: 1 },
      // Repeats PRODUCT_A — exercises de-duplication of the product lookup.
      { productId: PRODUCT_A, name: 'Pizza', unitPrice: 10, quantity: 1 },
    ],
  } as any;
}

describe('OrdersService.create — product snapshot resolution', () => {
  it('happy path: dedupes productIds, resolves each once, and merges category snapshot fields into order.create', async () => {
    const orderResponse = { id: 'order-1' };
    const ordersClient = createMockClientProxy(orderResponse);

    const productsService = {
      findOne: jest.fn((productId: string) => {
        if (productId === PRODUCT_A) {
          return Promise.resolve({
            id: PRODUCT_A,
            category: { id: 'cat-a', name: 'Food', countsTowardKitchenCapacity: true },
          });
        }
        if (productId === PRODUCT_B) {
          return Promise.resolve({
            id: PRODUCT_B,
            category: { id: 'cat-b', name: 'Drinks', countsTowardKitchenCapacity: false },
          });
        }
        throw new Error(`unexpected productId ${productId}`);
      }),
    };

    const service = new OrdersService(ordersClient as any, productsService as any);
    const dto = makeCreateOrderDto();
    const user = makeStaffUser();

    const result = await service.create(dto, user);

    // Deduped: 2 unique productIds, not 3 calls for 3 items.
    expect(productsService.findOne).toHaveBeenCalledTimes(2);
    expect(productsService.findOne).toHaveBeenCalledWith(PRODUCT_A, ORG_ID);
    expect(productsService.findOne).toHaveBeenCalledWith(PRODUCT_B, ORG_ID);

    expect(ordersClient.send).toHaveBeenCalledTimes(1);
    const [pattern, payload] = ordersClient.send.mock.calls[0];
    expect(pattern).toBe(ORDER_PATTERNS.CREATE);
    expect(payload.organizationId).toBe(ORG_ID);
    // STAFF creating the order → userId is undefined, not the staff's id.
    expect(payload.userId).toBeUndefined();
    expect(payload.items).toEqual([
      expect.objectContaining({
        productId: PRODUCT_A,
        countsTowardKitchenCapacity: true,
        categoryId: 'cat-a',
        categoryName: 'Food',
      }),
      expect.objectContaining({
        productId: PRODUCT_B,
        countsTowardKitchenCapacity: false,
        categoryId: 'cat-b',
        categoryName: 'Drinks',
      }),
      expect.objectContaining({
        productId: PRODUCT_A,
        countsTowardKitchenCapacity: true,
        categoryId: 'cat-a',
        categoryName: 'Food',
      }),
    ]);

    expect(result).toEqual(orderResponse);
  });

  // PINS CURRENT BEHAVIOR (questionable): product-ms failure silently
  // degrades snapshot, order still created.
  it('partial failure: a rejecting product-ms lookup is swallowed, order.create still fires with default snapshot fields for that product', async () => {
    const orderResponse = { id: 'order-2' };
    const ordersClient = createMockClientProxy(orderResponse);

    const productsService = {
      findOne: jest.fn((productId: string) => {
        if (productId === PRODUCT_A) {
          return Promise.resolve({
            id: PRODUCT_A,
            category: { id: 'cat-a', name: 'Food', countsTowardKitchenCapacity: true },
          });
        }
        // PRODUCT_B lookup fails (e.g. product-ms down or product deleted).
        return Promise.reject(new Error('product-ms unavailable'));
      }),
    };

    const service = new OrdersService(ordersClient as any, productsService as any);
    const dto = makeCreateOrderDto();
    const user = makeStaffUser();

    const result = await service.create(dto, user);

    // PINS CURRENT BEHAVIOR (questionable): product-ms failure silently
    // degrades snapshot, order still created.
    expect(ordersClient.send).toHaveBeenCalledTimes(1);
    const [, payload] = ordersClient.send.mock.calls[0];
    const bItem = payload.items.find((i: any) => i.productId === PRODUCT_B);
    expect(bItem).toEqual(
      expect.objectContaining({
        productId: PRODUCT_B,
        countsTowardKitchenCapacity: true, // conservative default, not false/undefined
        categoryId: undefined,
        categoryName: undefined,
      }),
    );
    // The resolvable product (A) is unaffected by B's failure.
    const aItem = payload.items.find(
      (i: any, idx: number) => i.productId === PRODUCT_A && idx === 0,
    );
    expect(aItem).toEqual(
      expect.objectContaining({ categoryId: 'cat-a', countsTowardKitchenCapacity: true }),
    );

    expect(result).toEqual(orderResponse);
  });
});
