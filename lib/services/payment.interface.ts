export interface PaymentSessionRequest {
    userId: string;
    amountInCents: number;
    currency: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
}

export interface PaymentSessionResponse {
    sessionId: string;
    redirectUrl: string;
}

export interface PaymentService {
    /**
     * Initializes a payment session with the provider (e.g. GoPay).
     * Returns a URL that the user should be redirected to for payment completion.
     */
    createCheckoutSession(request: PaymentSessionRequest): Promise<PaymentSessionResponse>;

    /**
     * Validates a webhook payload to ensure it came from the trusted payment provider.
     * Throws an error or returns false if invalid.
     */
    verifyWebhookSignature(payload: string, signature: string): boolean;

    /**
     * Parses the webhook data to extract standardized success details.
     */
    parseWebhookSuccess(payload: any): {
        sessionId: string;
        isPaid: boolean;
        amountInCents: number;
    };
}
