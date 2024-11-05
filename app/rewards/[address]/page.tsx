import { query } from "@/apollo-client";
import { gql } from '@apollo/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import HyperText from "@/components/ui/hyper-text";
import { ArrowUpRight } from "lucide-react";
import { Info } from "lucide-react";
import { RewardsChart } from "@/components/RewardsChart";
import { UserRewardsBarChart } from "@/components/UserRewardsBarChart";

const formatCPOOLValue = (value: string) => {
    const num = Number(value) / 1e18;
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

const userRewardQuery = gql`
  query UserRewardHistory($address: String!) {
    userRewards(where: {user_eq: $address}) {
      totalReward
      lastUpdateTimestamp
           transactionCount
        currentTier
      rewardHistory(orderBy: timestamp_DESC) {
        amount
        timestamp
        block
        transfer {
          txHash
          value
        }
      }
    }
  }
`;

interface PageProps {
    params: {
        address: string;
    }
}

export default async function UserRewardsPage({ params }: PageProps) {
    const { data } = await query({
        query: userRewardQuery,
        variables: {
            address: params.address
        }
    });

    const userReward = data?.userRewards[0];

    if (!userReward) {
        return (
            <div className="min-h-screen p-8">
                <Card className="max-w-[1200px] mx-auto">
                    <CardHeader>
                        <CardTitle>No rewards found for this address</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-zinc-950">
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Title Card */}
                <Card className="bg-zinc-900 border-0">
                    <CardHeader >
                        <h1 className="text-3xl font-bold text-white">
                            Reward History
                        </h1>
                        </CardHeader>
                        <div className="flex items-center px-6 py-2 gap-4">
                        <img
                            src={`https://effigy.im/a/${params.address}.svg`}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full"
                          />
                        <CardDescription className="font-mono text-2xl text-zinc-400">{params.address}</CardDescription>

                        </div>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
                        <CardHeader>
                            <CardDescription className="text-zinc-400 text-sm font-medium">
                                Total Rewards at 5%
                            </CardDescription>
                            <div className="flex items-center gap-3 mt-2">
                                <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEVMaXEAQP8AQP8AQP8AQP8AQP8AQP8AQP8AQP9Oev+/z//v8//////c5f8gWP90l/+atP8QTP+a+FWEAAAACXRSTlMAEGCY2u//IDA1wGQ0AAAA3klEQVR4AYXTRQLEIAwFUCT8CgmU+x92BKm3vFUlgqqNNpYc4Mgara4G67CxgzrSFidWH9IJF7QrMhJu0HjNv6+hCQ9I5wCLRzY3wIvhvUAuofHGaWVQTLNnmQAE/vMoTOsQOVtaAK89qOQzx4QoHFHVEFIOfzPHEudPAU6114Q/4QAgiSAFZLcBgRnN2mJC/uORZEYIqJyiOgk/AZPwgsCCDbVpLsxemCUBIUhWp2lQRGH2MQHHlTBKO1Rb45DhT/c3q7/d3QPTP3LdQ9s/9v2L0796+fJi47bL273+X1kqFpk5hXrZAAAAAElFTkSuQmCC"
                                    alt="CPOOL"
                                    className="w-8 h-8"
                                />
                                <div className="flex items-center">
                                <span className="text-3xl font-bold text-white/80 mr-4">
                                        <strong>$OZ</strong>
                                    </span>
                                    <HyperText
                                        className="text-3xl font-bold text-white"
                                        text={formatCPOOLValue(userReward.totalReward)}
                                    />
                                 
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
                        <CardHeader>
                            <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                Last Block Update
                                <Info className="w-4 h-4 text-zinc-500" />
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                 
                                    <HyperText
                                        className="text-2xl font-bold text-white"
                                        text={userReward.rewardHistory[0]?.block.toString() || "0"}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                    <UserRewardsBarChart rewardHistory={userReward.rewardHistory} />

                    <Card className="bg-zinc-900 border-0 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-400 text-xs font-semibold uppercase">
                                    Reward Amount
                                </TableHead>
                                <TableHead className="text-zinc-400 text-xs font-semibold uppercase">
                                    Block
                                </TableHead>
                                <TableHead className="text-zinc-400 text-xs font-semibold uppercase">
                                    Transfer Value
                                </TableHead>
                                <TableHead className="text-zinc-400 text-xs font-semibold uppercase text-right">
                                    Transaction
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userReward.rewardHistory.map((history: any, index: number) => (
                                <TableRow
                                    key={`${history.timestamp}-${index}`}
                                    className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                                >
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEVMaXEAQP8AQP8AQP8AQP8AQP8AQP8AQP8AQP9Oev+/z//v8//////c5f8gWP90l/+atP8QTP+a+FWEAAAACXRSTlMAEGCY2u//IDA1wGQ0AAAA3klEQVR4AYXTRQLEIAwFUCT8CgmU+x92BKm3vFUlgqqNNpYc4Mgara4G67CxgzrSFidWH9IJF7QrMhJu0HjNv6+hCQ9I5wCLRzY3wIvhvUAuofHGaWVQTLNnmQAE/vMoTOsQOVtaAK89qOQzx4QoHFHVEFIOfzPHEudPAU6114Q/4QAgiSAFZLcBgRnN2mJC/uORZEYIqJyiOgk/AZPwgsCCDbVpLsxemCUBIUhWp2lQRGH2MQHHlTBKO1Rb45DhT/c3q7/d3QPTP3LdQ9s/9v2L0796+fJi47bL273+X1kqFpk5hXrZAAAAAElFTkSuQmCC"
                                                alt="CPOOL"
                                                className="w-5 h-5"
                                            />
                                            <span className="text-white font-medium">
                                                {formatCPOOLValue(history.amount)}
                                            </span>
                                            <span className="text-white/80">
                                                <strong>OZ</strong>
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/80 font-medium">
                                        {history.block}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png"
                                                alt="CPOOL"
                                                className="w-5 h-5"
                                            />
                                            <span className="text-white font-medium">
                                                {history.transfer?.value ? `${formatCPOOLValue(history.transfer.value)} CPOOL` : 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-4 text-right">
                                        {history.transfer?.txHash ? (
                                            <a
                                                href={`https://etherscan.io/tx/${history.transfer.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline font-mono"
                                            >
                                                <ArrowUpRight className="w-4 h-4 inline-block mr-1" />
                                                {history.transfer.txHash.slice(0, 6)}...{history.transfer.txHash.slice(-4)}
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                </div>

               
            </div>
        </div>
    );
}