// «8 097»: разряды через неразрывный пробел — одинаково на всех языках, как
// в подписи бота (bot/src/helpers.ts downloadNumberLine).
export function formatDownloadNumber(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
