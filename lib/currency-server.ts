import { cookies } from "next/headers";
import {
  currencies,
  CURRENCY_COOKIE,
  type Currency,
} from "./currency";

export async function getCurrencyFromCookies(): Promise<Currency> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CURRENCY_COOKIE)?.value;
  if (cookieValue && currencies[cookieValue]) {
    return currencies[cookieValue];
  }
  return currencies.USD;
}
