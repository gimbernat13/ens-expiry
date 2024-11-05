"use client"

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface UserTierProps {
  currentTier: number;
  transactionCount: number;
}

export function UserTierRadial({ currentTier, transactionCount }: UserTierProps) {
  // Calculate percentage for tier (assuming max tier is 5)
  const tierPercentage = (currentTier / 5) * 100;

  const data = [{
    name: "tier",
    value: tierPercentage,
    fill: "#3b82f6"
  }];

  return (
    <Card className="flex flex-col bg-zinc-900 border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white">Tier Progress</CardTitle>
        <CardDescription>Level {currentTier}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px] relative">
          <RadialBarChart
            width={250}
            height={250}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarGrid gridType="circle" />
            <PolarRadiusAxis
              tick={false}
              axisLine={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={30}
              fill="#3b82f6"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-4xl font-bold"
            >
              {transactionCount}
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-zinc-400 text-sm"
            >
              transactions
            </text>
          </RadialBarChart>
        </div>
      </CardContent>
    </Card>
  )
} 