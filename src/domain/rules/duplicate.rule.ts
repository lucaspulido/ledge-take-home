// src/domain/rules/duplicate.rule.ts

import crypto from 'crypto';

import { Order } from '../models/order';

export interface SimilarOrderCandidate {
  customerId: string;
  orderDate: Date;
  totalAmount: number;
  fingerprint: string;
}

/**
 * Generates a deterministic fingerprint used for
 * idempotency and exact duplicate detection.
 */
export function generateFingerprint(order: Order): string {
  return crypto
    .createHash('sha256')
    .update(
      [
        order.customerId,
        order.orderDate.toISOString(),
        order.totalAmount,
        order.freight,
      ].join('|')
    )
    .digest('hex');
}

/**
 * Detects possible duplicates using:
 * - same customer
 * - similar amount
 * - date within 7 days
 */
export function checkPossibleDuplicate(
  order: Order,
  existingOrders: SimilarOrderCandidate[]
): SimilarOrderCandidate | null {

  const TIME_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

  const match = existingOrders.find(existing => {

    const dateDiff = Math.abs(
      existing.orderDate.getTime() -
      order.orderDate.getTime()
    );

    const amountDiff = Math.abs(
      existing.totalAmount -
      order.totalAmount
    );

    return (
      existing.customerId === order.customerId &&
      amountDiff <= 0.01 &&
      dateDiff <= TIME_WINDOW_MS
    );
  });

  return match ?? null;
}