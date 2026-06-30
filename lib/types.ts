export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_cap_rank: number | null;
}

export interface SimulationParams {
  cryptoId: string;
  cryptoName: string;
  cryptoSymbol: string;
  cryptoImage: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "oneshot";
  startDate: string;
  endDate: string;
}

export interface SimulationEvent {
  date: string;
  price: number;
  bought: number;
  accumulated: number;
  invested: number;
  value: number;
  gain: number;
}

export interface SimulationResult {
  events: SimulationEvent[];
  totalInvested: number;
  totalAccumulated: number;
  totalValue: number;
  totalGain: number;
  performance: number;
  averageBuyPrice: number;
  buyCount: number;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}
