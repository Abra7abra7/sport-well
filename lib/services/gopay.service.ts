import { PaymentService, PaymentSessionRequest, PaymentSessionResponse } from './payment.interface';

// A mock or simplified wrapper for the GoPay REST API.
// In production, this would use fetch() with GOPAY_CLIENT_ID and GOPAY_CLIENT_SECRET.

export class GoPayAdapter implements PaymentService {
    private apiUrl: string;
    private clientId: string;
    private clientSecret: string;

    constructor() {
        this.apiUrl = process.env.GOPAY_API_URL || '';
        this.clientId = process.env.GOPAY_CLIENT_ID || '';
        this.clientSecret = process.env.GOPAY_CLIENT_SECRET || '';
    }

    async createCheckoutSession(request: PaymentSessionRequest): Promise<PaymentSessionResponse> {
        console.log('[GoPay] Creating session for amount:', request.amountInCents);

        // TODO: Implement actual GoPay oAuth and /api/payments/payment POST request
        // This is a stub satisfying the interface for the architecture phase

        return {
            sessionId: `gopay_mock_${Date.now()}`,
            redirectUrl: `${request.successUrl}?session_id=mock_success`
        };
    }

    verifyWebhookSignature(payload: string, signature: string): boolean {
        // GoPay signatures are usually verified implicitly or via an API call in the newer robust APIs
        return true;
    }

    parseWebhookSuccess(payload: any): { sessionId: string; isPaid: boolean; amountInCents: number; } {
        return {
            sessionId: payload?.id || "unknown",
            isPaid: payload?.state === 'PAID',
            amountInCents: payload?.amount || 0
        };
    }
}

// Export a singleton instance
export const paymentService: PaymentService = new GoPayAdapter();
