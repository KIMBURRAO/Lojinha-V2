// =============================================================
// PIX Payment Gateway — Mock Implementation
// =============================================================
// This module provides a mock interface for PIX payments.
// Replace this implementation with a real gateway (e.g., Mercado Pago,
// Asaas, EfiPay) when ready. The interface contract stays the same.
// =============================================================

export interface PixCharge {
  chargeId: string;
  qrCode: string;        // PIX copy-paste code
  qrCodeBase64: string;  // Base64 QR code image
  expiresAt: string;     // ISO 8601
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELED";
}

export interface PixChargeInput {
  orderId: string;
  totalCents: number;
  customerName: string;
  customerEmail: string;
}

/**
 * Create a PIX charge (mock).
 * TODO: Replace with real gateway integration.
 */
export async function createPixCharge(input: PixChargeInput): Promise<PixCharge> {
  // Simulate a PIX charge creation
  const chargeId = `pix_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  
  return {
    chargeId,
    qrCode: `00020126580014br.gov.bcb.pix0136mock-${chargeId}520400005303986540${(input.totalCents / 100).toFixed(2)}5802BR5913LOJA N8N AUTO6008SAOPAULO62070503***6304MOCK`,
    qrCodeBase64: "", // Would be a real QR code image in production
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    status: "PENDING",
  };
}

/**
 * Check the status of a PIX charge (mock).
 * TODO: Replace with real gateway polling.
 */
export async function checkPixStatus(chargeId: string): Promise<PixCharge["status"]> {
  console.log(`[MOCK] Checking PIX status for charge: ${chargeId}`);
  // Always returns PENDING in mock mode
  return "PENDING";
}

/**
 * Handle PIX webhook notification (mock).
 * TODO: Replace with real gateway webhook handler.
 */
export async function handlePixWebhook(payload: unknown): Promise<{
  chargeId: string;
  status: PixCharge["status"];
} | null> {
  console.log("[MOCK] Received PIX webhook:", payload);
  // In production, this would validate the webhook signature,
  // extract the chargeId and status, and return them.
  return null;
}
