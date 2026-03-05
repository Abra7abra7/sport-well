import { describe, it, expect, vi } from 'vitest';
import { GoPayAdapter } from './gopay.service';

describe('GoPayAdapter', () => {
    const adapter = new GoPayAdapter();

    it('should return a mock session ID and redirect URL', async () => {
        const result = await adapter.createCheckoutSession({
            amountInCents: 1000,
            currency: 'EUR',
            successUrl: 'http://success.com',
            cancelUrl: 'http://cancel.com',
            description: 'Test payment'
        });

        expect(result.sessionId).toContain('gopay_mock_');
        expect(result.redirectUrl).toBe('http://success.com?session_id=mock_success');
    });

    it('should parse webhook success correctly', () => {
        const payload = { id: 'test_id', state: 'PAID', amount: 1000 };
        const result = adapter.parseWebhookSuccess(payload);

        expect(result.sessionId).toBe('test_id');
        expect(result.isPaid).toBe(true);
        expect(result.amountInCents).toBe(1000);
    });
});
