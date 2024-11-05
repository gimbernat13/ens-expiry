"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
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

export function RewardsBarChart({ rewardHistory }: { rewardHistory: Transfer[] }) {
  if (!rewardHistory) return null;

  // Format data for the chart - group by block and sum values
  const chartData = rewardHistory
    .reduce((acc: any[], transfer) => {
      const existingBlock = acc.find(item => item.block === transfer.block);
      const value = Number(transfer.value) / 1e18;

      if (existingBlock) {
        existingBlock.rewards += value;
      } else {
        acc.push({
          block: transfer.block,
          rewards: value
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.block - b.block) // Sort by block number
    .slice(-10); // Get last 10 blocks

  // Calculate average reward
  const averageReward = chartData.reduce((sum, item) => sum + item.rewards, 0) / chartData.length;

  // Calculate percentage above/below average
  const lastReward = chartData[chartData.length - 1]?.rewards || 0;
  const percentageChange = ((lastReward - averageReward) / averageReward) * 100;

  return (
    <Card className="bg-zinc-900 border-0">
      <CardHeader>
        <CardTitle className="text-white">Rewards Distribution</CardTitle>
        <CardDescription>Rewards per Block</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                left: 24,
                right: 24,
                top: 20,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.1} stroke="#666" />
              <XAxis 
                dataKey="block"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="#666"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="#666"
                tickFormatter={(value) => `${value.toFixed(1)} CPOOL`}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number) => [`${value.toFixed(2)} CPOOL`, "Rewards"]}
                labelFormatter={(label) => `Block ${label}`}
              />
              <Bar 
                dataKey="rewards" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {percentageChange > 0 ? 'Above' : 'Below'} average by {Math.abs(percentageChange).toFixed(1)}% 
          <TrendingUp className={`h-4 w-4 ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className="leading-none text-zinc-400">
          Average reward: {averageReward.toFixed(2)} CPOOL per block
        </div>
      </CardFooter>
    </Card>
  )
} 