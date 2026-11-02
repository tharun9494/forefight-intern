declare module '@codemoon/phonepe-lib' {
  interface PhonePeConfig {
    merchantId: string;
    saltKey: string;
    saltIndex: number;
    environment: 'PRODUCTION' | 'UAT';
  }

  interface PaymentPayload {
    merchantTransactionId: string;
    amount: number;
    merchantUserId: string;
    redirectUrl: string;
    redirectMode: 'POST' | 'GET';
    callbackUrl: string;
    paymentInstrument: {
      type: 'PAY_PAGE';
    };
  }

  interface PaymentResponse {
    success: boolean;
    message?: string;
    data?: {
      instrumentResponse: {
        redirectInfo: {
          url: string;
        };
      };
    };
  }

  export class PhonePe {
    constructor(config: PhonePeConfig);
    createPaymentPayload(payload: PaymentPayload): Record<string, unknown>;
    initiatePayment(payload: Record<string, unknown>): Promise<PaymentResponse>;
  }
}
