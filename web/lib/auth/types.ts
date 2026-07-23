export interface SubscriptionStatus {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  isUnlimited: boolean;
  subscriptionUntil: string | null;
  subscriptionKind: "MONTHLY" | "YEARLY" | null;
}
