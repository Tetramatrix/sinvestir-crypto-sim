"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SimulationEvent } from "@/lib/types";
import { TrendingUp } from "lucide-react";

interface Props {
  events: SimulationEvent[];
}

function formatEUR(n: number): string {
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M €`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}k €`;
  return `${n.toFixed(0)} €`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const gain = payload[0]?.value ?? 0;
  return (
    <div className="bg-surface border border-border-custom rounded-lg p-3 shadow-xl text-sm">
      <div className="text-muted mb-1">{label}</div>
      <div
        className="font-medium tabular-nums"
        style={{ color: gain >= 0 ? "#10b981" : "#ef4444" }}
      >
        {gain >= 0 ? "+" : ""}
        {formatEUR(gain)}
      </div>
    </div>
  );
}

export default function ProfitLossChart({ events }: Props) {
  const data = events
    .filter((_, i) => i % Math.max(1, Math.floor(events.length / 365)) === 0)
    .map((e) => ({
      date: e.date,
      label: formatDate(e.date),
      Gain: Math.round(e.gain),
    }));

  const maxGain = Math.max(...data.map((d) => d.Gain));
  const minGain = Math.min(...data.map((d) => d.Gain));
  const absMax = Math.max(Math.abs(maxGain), Math.abs(minGain));

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <TrendingUp size={18} className="text-primary" />
        Plus-value / Moins-value
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
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
              domain={[-absMax * 1.1, absMax * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Area
              type="monotone"
              dataKey="Gain"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gainGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
