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

const formatCPOOLValue = (value: string) => {
    const num = Number(value) / 1e18;
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

const userRewardQuery = gql`
  query UserRewardHistory($address: String!) {
    userRewards(where: {user_eq: $address}) {
      totalReward
      lastUpdateTimestamp
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
        <div className="min-h-screen p-8">
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Title Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Reward History</CardTitle>
                        <CardDescription className="font-mono">{params.address}</CardDescription>
                    </CardHeader>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/50 dark:to-background">
                        <CardHeader>
                            <CardDescription>Total Rewards</CardDescription>
                            <div className="flex items-center gap-3 mt-2">
                                <img
                                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png"
                                    alt="CPOOL"
                                    className="w-8 h-8"
                                />
                                <CardTitle className="text-3xl font-bold">
                                    {formatCPOOLValue(userReward.totalReward)} CPOOL
                                </CardTitle>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/50 dark:to-background">
                        <CardHeader>
                            <CardDescription>Last Updated</CardDescription>
                            <CardTitle className="text-2xl mt-2">
                                {new Date(userReward.lastUpdateTimestamp * 1000).toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* History Table Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reward Amount</TableHead>
                                    <TableHead>Block</TableHead>
                                    <TableHead>Transfer Value</TableHead>
                                    <TableHead className="text-right">Transaction</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userReward.rewardHistory.map((history: any, index: number) => (
                                    <TableRow key={`${history.timestamp}-${index}`}>
                                        <TableCell className="flex items-center gap-2">
                                            <img
                                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png"
                                                alt="CPOOL"
                                                className="w-5 h-5"
                                            />
                                            {formatCPOOLValue(history.amount)} CPOOL
                                        </TableCell>
                                        <TableCell>{history.block}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <img
                                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png"
                                                alt="CPOOL"
                                                className="w-5 h-5"
                                            />
                                            {history.transfer?.value ? `${formatCPOOLValue(history.transfer.value)} CPOOL` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {history.transfer?.txHash ? (
                                                <a
                                                    href={`https://etherscan.io/tx/${history.transfer.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline font-mono"
                                                >
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}