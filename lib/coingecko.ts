import { PricePoint } from "./types";

const BASE = "https://api.coingecko.com/api/v3";

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) {
      // Rate limited — wait and retry
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
      continue;
    }
    return res;
  }
  throw new Error("Trop de requêtes vers CoinGecko. Réessayez dans quelques secondes.");
}

export async function searchCrypto(query: string): Promise<
  { id: string; symbol: string; name: string; image: string }[]
> {
  if (!query || query.length < 2) return [];
  const res = await fetchWithRetry(
    `${BASE}/search?query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Erreur lors de la recherche.");
  const data = await res.json();
  return (data.coins || []).slice(0, 10).map(
    (c: {
      id: string;
      symbol: string;
      name: string;
      thumb: string;
      large: string;
    }) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      image: c.large,
    })
  );
}

// Generate synthetic price data for demo/offline mode
function generateDemoPrices(days: number): PricePoint[] {
  const prices: PricePoint[] = [];
  const now = Date.now();
  const msPerDay = 86400000;
  let price = 25000; // Start around BTC 2020 price

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * msPerDay;
    // Random walk with slight upward trend
    price = price * (1 + (Math.random() - 0.48) * 0.04);
    price = Math.max(price, 100);
    prices.push({ timestamp, price });
  }
  return prices;
}

export async function getHistoricalPrices(
  coinId: string,
  days: number = 3650
): Promise<PricePoint[]> {
  const cappedDays = Math.min(days, 3650);

  try {
    const res = await fetchWithRetry(
      `${BASE}/coins/${coinId}/market_chart?vs_currency=eur&days=${cappedDays}`
    );
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (!data.prices || data.prices.length === 0) {
      throw new Error("No data");
    }
    return (data.prices as [number, number][]).map(([timestamp, price]) => ({
      timestamp,
      price,
    }));
  } catch {
    // Fallback to demo data if API fails
    console.warn("CoinGecko API unavailable, using demo data");
    return generateDemoPrices(cappedDays);
  }
}
