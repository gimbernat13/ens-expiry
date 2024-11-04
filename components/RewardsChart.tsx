"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Transfer {
  block: number;
  value: string;
  from: string;
  to: string;
  txHash: string;
}

export function RewardsChart({ rewardHistory }: { rewardHistory: Transfer[] }) {
  if (!rewardHistory) return null;

  // Format data for the chart - group by block and sum values
  const chartData = rewardHistory
    .reduce((acc: any[], transfer) => {
      const existingBlock = acc.find(item => item.block === transfer.block);
      const value = Number(transfer.value) / 1e18;

      if (existingBlock) {
        existingBlock.totalValue += value;
      } else {
        acc.push({
          block: transfer.block,
          totalValue: value
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.block - b.block) // Sort by block number
    .slice(-20); // Get last 20 blocks

  // Calculate trend
  const lastTwoBlocks = chartData.slice(-2);
  const trend = lastTwoBlocks.length === 2
    ? ((lastTwoBlocks[1].totalValue - lastTwoBlocks[0].totalValue) / lastTwoBlocks[0].totalValue) * 100
    : 0;

  return (
    <Card className="bg-zinc-900 border-0">
      <CardHeader>
        <CardTitle className="text-white">Transfer Volume Trend</CardTitle>
        <CardDescription>Last 20 Blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                left: 24,
                right: 24,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.1} stroke="#666" />
              <XAxis 
                dataKey="block"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="#666"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="#666"
                tickFormatter={(value) => `${value.toFixed(2)} CPOOL`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number) => [`${value.toFixed(2)} CPOOL`, "Volume"]}
                labelFormatter={(label) => `Block ${label}`}
              />
              <Line
                type="monotone"
                dataKey="totalValue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{
                  fill: "#3b82f6",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#fff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {trend > 0 ? 'Volume trending up' : 'Volume trending down'} by {Math.abs(trend).toFixed(2)}% 
          <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className="leading-none text-zinc-400">
          Showing transfer volume per block for the last 20 blocks
        </div>
      </CardFooter>
    </Card>
  )
} 