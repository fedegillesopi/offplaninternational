export const exchangeRates: Record<string, number> = {
  AED: 1,
  USD: 0.272,
  EUR: 0.249,
  GBP: 0.214,
};

export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];
  if (!fromRate || !toRate) return amount;
  const amountInAed = fromCurrency === "AED" ? amount : amount / fromRate;
  return toCurrency === "AED" ? amountInAed : amountInAed * toRate;
}
