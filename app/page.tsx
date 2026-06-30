"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SimulatorForm from "@/components/SimulatorForm";
import ResultsCards from "@/components/ResultsCards";
import HistoryChart from "@/components/HistoryChart";
import ProfitLossChart from "@/components/ProfitLossChart";
import { SimulationParams, SimulationResult } from "@/lib/types";
import { getHistoricalPrices } from "@/lib/coingecko";
import { runSimulation } from "@/lib/simulator";

const DEFAULT_PARAMS: SimulationParams = {
  cryptoId: "",
  cryptoName: "",
  cryptoSymbol: "",
  cryptoImage: "",
  amount: 100,
  frequency: "monthly",
  startDate: "2020-01-01",
  endDate: "2024-12-31",
};

export default function Home() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  async function handleSimulate() {
    if (!params.cryptoId) return;
    setLoading(true);
    setError(null);
    setDemoMode(false);
    try {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const prices = await getHistoricalPrices(params.cryptoId, days + 1);
      const simResult = runSimulation(params, prices);
      setResult(simResult);
      // Check if we fell back to demo data (prices will look synthetic)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la simulation"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Simulateur Crypto-monnaie
          </h1>
          <p className="text-muted text-sm max-w-lg mx-auto">
            Calculez vos gains et performances pour un investissement crypto en
            DCA, en one-shot. Bitcoin, Ethereum, et plus de 7000 cryptos.
          </p>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          <div>
            <SimulatorForm
              params={params}
              onChange={setParams}
              onSubmit={handleSimulate}
              loading={loading}
            />
          </div>

          <div className="space-y-6">
            {error && (
              <div className="card p-4 border-danger/30 bg-danger/5">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {result && (
              <>
                <ResultsCards result={result} />
                <HistoryChart events={result.events} />
                <ProfitLossChart events={result.events} />
              </>
            )}

            {!result && !loading && (
              <div className="card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">
                  Configurez votre simulation
                </h3>
                <p className="text-sm text-muted max-w-xs">
                  Sélectionnez une crypto-monnaie, définissez un montant et une
                  période pour visualiser vos gains potentiels.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border-custom py-4 text-center text-xs text-muted">
        Simulateur fourni par S&apos;investir — données CoinGecko
      </footer>
    </div>
  );
}
