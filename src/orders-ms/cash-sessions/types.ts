// Shape of payments-ms's payment.totals_by_method RPC response — kept local
// to this module since it's the only gateway feature that consumes it.
export interface PaymentTotalsByMethodResponse {
  totals: {
    paymentMethodId: string | null;
    paymentMethodName: string;
    isCash: boolean;
    totalAmount: number;
    paymentCount: number;
  }[];
  grandTotal: number;
  totalPayments: number;
  cashTotal: number;
  unclassifiedTotal: number;
  unclassifiedCount: number;
  hasCashMethodConfigured: boolean;
  cancelledTotal: number;
  cancelledCount: number;
  refundedTotal: number;
  refundedCount: number;
}
