"use client"

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface UserStatsProps {
  currentTier: number;
  transactionCount: number;
}

export function UserStatsRadial({ currentTier, transactionCount }: UserStatsProps) {
  // Calculate percentage for tier (assuming max tier is 5)
  const tierPercentage = (currentTier / 5) * 100;

  const tierData = [{
    name: "tier",
    value: tierPercentage,
    fill: "#3b82f6"
  }];

  const transactionData = [{
    name: "transactions",
    value: Math.min(transactionCount, 100), // Cap at 100 for visual purposes
    fill: "#22c55e"
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tier Radial */}
      <Card className="flex flex-col bg-zinc-900 border-0">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-white">Current Tier</CardTitle>
          <CardDescription>Reward Level</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px]">
            <RadialBarChart
              data={tierData}
              startAngle={90}
              endAngle={-270}
              innerRadius={80}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                polarRadius={[86, 74]}
              />
              <RadialBar
                dataKey="value"
                background={{ fill: "#27272a" }}
                cornerRadius={30}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox: { cx, cy } }) => (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-white text-4xl font-bold"
                      >
                        {currentTier}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy + 24}
                        className="fill-zinc-400 text-sm"
                      >
                        of 5
                      </tspan>
                    </text>
                  )}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Count Radial */}
      <Card className="flex flex-col bg-zinc-900 border-0">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-white">Transactions</CardTitle>
          <CardDescription>Total Count</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px]">
            <RadialBarChart
              data={transactionData}
              startAngle={90}
              endAngle={-270}
              innerRadius={80}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                polarRadius={[86, 74]}
              />
              <RadialBar
                dataKey="value"
                background={{ fill: "#27272a" }}
                cornerRadius={30}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox: { cx, cy } }) => (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-white text-4xl font-bold"
                      >
                        {transactionCount}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy + 24}
                        className="fill-zinc-400 text-sm"
                      >
                        transactions
                      </tspan>
                    </text>
                  )}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 