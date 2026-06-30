"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SimulationEvent } from "@/lib/types";
import { BarChart3 } from "lucide-react";

interface Props {
  events: SimulationEvent[];
}

function formatEUR(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M €`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k €`;
  return `${n.toFixed(0)} €`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-surface border border-border-custom rounded-lg p-3 shadow-xl text-sm">
      <div className="text-muted mb-2">{label}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-muted">{entry.name}:</span>
          <span className="tabular-nums font-medium">
            {formatEUR(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function HistoryChart({ events }: Props) {
  const data = events
    .filter((_, i) => i % Math.max(1, Math.floor(events.length / 365)) === 0)
    .map((e) => ({
      date: e.date,
      label: formatDate(e.date),
      Investé: Math.round(e.invested),
      Valeur: Math.round(e.value),
    }));

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <BarChart3 size={18} className="text-primary" />
        Évolution du portefeuille
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatEUR}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 12 }}
              formatter={(v: string) => (
                <span className="text-xs text-muted">{v}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="Investé"
              stroke="#1098f7"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Valeur"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
