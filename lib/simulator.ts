import { PricePoint, SimulationParams, SimulationEvent, SimulationResult } from "./types";

function isBuyDay(date: Date, frequency: string, prevBuyDate: Date | null): boolean {
  if (frequency === "oneshot") return !prevBuyDate;
  if (frequency === "daily") return true;
  if (frequency === "weekly") {
    if (!prevBuyDate) return true;
    const diff = (date.getTime() - prevBuyDate.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 7;
  }
  if (frequency === "monthly") {
    if (!prevBuyDate) return true;
    const diffMonths =
      (date.getFullYear() - prevBuyDate.getFullYear()) * 12 +
      (date.getMonth() - prevBuyDate.getMonth());
    return diffMonths >= 1;
  }
  return false;
}

function getPriceForDate(
  prices: PricePoint[],
  targetDate: Date
): number | null {
  const targetTime = targetDate.getTime();
  let closest = prices[0];
  let minDiff = Math.abs(prices[0].timestamp - targetTime);

  for (const p of prices) {
    const diff = Math.abs(p.timestamp - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = p;
    }
    if (p.timestamp > targetTime) break;
  }

  return closest ? closest.price : null;
}

export function runSimulation(
  params: SimulationParams,
  prices: PricePoint[]
): SimulationResult {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  const events: SimulationEvent[] = [];

  let accumulated = 0;
  let invested = 0;
  let prevBuyDate: Date | null = null;

  const current = new Date(start);
  while (current <= end) {
    const price = getPriceForDate(prices, current);
    const priceNum = price ?? 0;

    let bought = 0;
    if (isBuyDay(current, params.frequency, prevBuyDate) && priceNum > 0) {
      bought = params.amount / priceNum;
      accumulated += bought;
      invested += params.amount;
      prevBuyDate = new Date(current);
    }

    const value = accumulated * priceNum;
    const gain = value - invested;

    events.push({
      date: current.toISOString().split("T")[0],
      price: priceNum,
      bought,
      accumulated,
      invested,
      value,
      gain,
    });

    current.setDate(current.getDate() + 1);
  }

  const lastEvent = events[events.length - 1];
  const totalValue = lastEvent?.value ?? 0;
  const totalInvested = lastEvent?.invested ?? 0;
  const totalGain = lastEvent?.gain ?? 0;
  const performance = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const averageBuyPrice = accumulated > 0 ? totalInvested / accumulated : 0;
  const buyCount = events.filter((e) => e.bought > 0).length;

  return {
    events,
    totalInvested,
    totalAccumulated: accumulated,
    totalValue,
    totalGain,
    performance,
    averageBuyPrice,
    buyCount,
  };
}
