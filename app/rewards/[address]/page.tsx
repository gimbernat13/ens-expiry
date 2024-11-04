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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
      <Card className="max-w-[1200px] mx-auto">
        <CardHeader>
          <CardTitle>Reward History for {params.address}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total Rewards: {userReward.totalReward}
            <br />
            Last Updated: {new Date(userReward.lastUpdateTimestamp * 1000).toLocaleString()}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                {/* <TableHead>Timestamp</TableHead> */}
                <TableHead>Block</TableHead>
                <TableHead>Transfer Value</TableHead>
                <TableHead className="text-right">Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userReward.rewardHistory.map((history: any, index: number) => (
                <TableRow key={`${history.timestamp}-${index}`}>
                  <TableCell>{history.amount}</TableCell>
                  {/* <TableCell>
                    {new Date(history.timestamp * 1000).toLocaleString()}
                  </TableCell> */}
                  <TableCell>{history.block}</TableCell>
                  <TableCell>{history.transfer?.value || 'N/A'}</TableCell>
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
  );
}