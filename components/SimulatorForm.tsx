"use client";

import { SimulationParams } from "@/lib/types";
import CryptoSearch from "./CryptoSearch";
import { Calculator } from "lucide-react";

interface Props {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
  onSubmit: () => void;
  loading: boolean;
}

const FREQUENCIES: { value: SimulationParams["frequency"]; label: string }[] = [
  { value: "oneshot", label: "One-shot" },
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
];

export default function SimulatorForm({
  params,
  onChange,
  onSubmit,
  loading,
}: Props) {
  function update<K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K]
  ) {
    onChange({ ...params, [key]: value });
  }

  const isValid =
    params.cryptoId && params.amount > 0 && params.startDate && params.endDate;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <Calculator size={20} className="text-primary" />
        Paramètres de simulation
      </h2>

      <div className="space-y-4">
        <CryptoSearch
          value={params.cryptoName}
          label="Crypto-monnaie"
          image={params.cryptoImage}
          onSelect={(id, name, symbol, image) =>
            onChange({
              ...params,
              cryptoId: id,
              cryptoName: name,
              cryptoSymbol: symbol,
              cryptoImage: image,
            })
          }
        />

        <div>
          <label className="block text-sm font-medium text-muted mb-1.5">
            Montant par période (EUR)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={params.amount || ""}
            onChange={(e) => update("amount", Number(e.target.value))}
            placeholder="100"
            className="input tabular-nums"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-2">
            Fréquence
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => update("frequency", f.value)}
                className={`btn text-xs py-2 ${
                  params.frequency === f.value
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              Date de début
            </label>
            <input
              type="date"
              value={params.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              Date de fin
            </label>
            <input
              type="date"
              value={params.endDate}
              onChange={(e) => update("endDate", e.target.value)}
              className="input"
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!isValid || loading}
          className="btn btn-primary w-full py-3 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="spinner" style={{ width: 16, height: 16 }} />
              Calcul en cours...
            </span>
          ) : (
            "Lancer la simulation"
          )}
        </button>
      </div>
    </div>
  );
}
