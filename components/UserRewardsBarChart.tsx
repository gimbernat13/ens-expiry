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

interface RewardHistory {
  amount: string;
  block: number;
  timestamp: number;
  transfer?: {
    txHash: string;
    value: string;
  };
}

export function UserRewardsBarChart({ rewardHistory }: { rewardHistory: RewardHistory[] }) {
  if (!rewardHistory?.length) return null;

  // Format data for the chart
  const chartData = rewardHistory
    .slice(-100) // Get last 10 rewards
    .map(history => ({
      block: history.block,
      rewards: Number(history.amount) / 1e18,
      transfer: history.transfer?.value ? Number(history.transfer.value) / 1e18 : 0
    }))
    .reverse();

  // Calculate average reward
  const averageReward = chartData.reduce((sum, item) => sum + item.rewards, 0) / chartData.length;

  // Calculate percentage above/below average
  const lastReward = chartData[chartData.length - 1]?.rewards || 0;
  const percentageChange = ((lastReward - averageReward) / averageReward) * 100;

  return (
    <Card className="bg-zinc-900 border-0">
      <CardHeader>
        <CardTitle className="text-white">Rewards History</CardTitle>
        <CardDescription>Last 200 Rewards</CardDescription>
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
                tickFormatter={(value) => `${value.toFixed(1)} OZ`}
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
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} ${name === 'rewards' ? 'OZ' : 'CPOOL'}`,
                  name === 'rewards' ? 'Rewards' : 'Transfer Value'
                ]}
                labelFormatter={(label) => `Block ${label}`}
              />
              <Bar 
                dataKey="rewards" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="rewards"
              />
              <Bar 
                dataKey="transfer" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                name="transfer"
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
          Average reward: {averageReward.toFixed(2)} OZ per block
        </div>
      </CardFooter>
    </Card>
  )
} 