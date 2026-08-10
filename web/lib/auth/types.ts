// Профиль пользователя сайта. Раньше назывался SubscriptionStatus и нёс даты
// подписки — платных функций больше нет, остался только признак ручного
// админского безлимита (выдаётся через /grant в боте).
export interface UserProfile {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  isUnlimited: boolean;
}
