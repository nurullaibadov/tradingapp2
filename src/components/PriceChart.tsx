import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { generateChartData } from "@/lib/market-data";

export function PriceChart({ basePrice, color = "var(--color-primary)", height = 320 }: { basePrice: number; color?: string; height?: number }) {
  const data = useMemo(() => generateChartData(basePrice, 60), [basePrice]);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval={9} />
        <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin", "dataMax"]} width={70} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
        <Tooltip
          contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Price"]}
        />
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#chartFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
