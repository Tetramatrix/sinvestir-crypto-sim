"use client";

import { SimulationResult } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  Target,
  ShoppingCart,
} from "lucide-react";

interface Props {
  result: SimulationResult;
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatCrypto(n: number): string {
  if (n >= 1) return n.toFixed(4);
  if (n >= 0.001) return n.toFixed(6);
  return n.toFixed(8);
}

function Card({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color || "#1098f7"}20` }}
        >
          {icon}
        </div>
        <span className="text-xs text-muted">{label}</span>
      </div>
      <div
        className="text-xl font-semibold tabular-nums"
        style={{ color: color || "var(--color-text)" }}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

export default function ResultsCards({ result }: Props) {
  const isPositive = result.totalGain >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <Card
        icon={<Wallet size={16} style={{ color: "#1098f7" }} />}
        label="Investi"
        value={formatEUR(result.totalInvested)}
        sub={`${result.buyCount} achat${result.buyCount > 1 ? "s" : ""}`}
        color="#1098f7"
      />
      <Card
        icon={<Coins size={16} style={{ color: "#a78bfa" }} />}
        label="Accumulé"
        value={`${formatCrypto(result.totalAccumulated)}`}
        color="#a78bfa"
      />
      <Card
        icon={<Target size={16} style={{ color: "#f59e0b" }} />}
        label="Prix moyen"
        value={formatEUR(result.averageBuyPrice)}
        color="#f59e0b"
      />
      <Card
        icon={<ShoppingCart size={16} style={{ color: "#06b6d4" }} />}
        label="Valeur actuelle"
        value={formatEUR(result.totalValue)}
        color="#06b6d4"
      />
      <Card
        icon={
          isPositive ? (
            <TrendingUp size={16} style={{ color: "#10b981" }} />
          ) : (
            <TrendingDown size={16} style={{ color: "#ef4444" }} />
          )
        }
        label="Plus-value"
        value={`${isPositive ? "+" : ""}${formatEUR(result.totalGain)}`}
        color={isPositive ? "#10b981" : "#ef4444"}
      />
      <Card
        icon={
          isPositive ? (
            <TrendingUp size={16} style={{ color: "#10b981" }} />
          ) : (
            <TrendingDown size={16} style={{ color: "#ef4444" }} />
          )
        }
        label="Performance"
        value={`${isPositive ? "+" : ""}${result.performance.toFixed(2)}%`}
        color={isPositive ? "#10b981" : "#ef4444"}
      />
    </div>
  );
}
