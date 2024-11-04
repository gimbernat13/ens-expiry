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
import Link from "next/link";

const userQuery = gql`
query {
  transfers(limit: 11000, offset: 10, orderBy: id_ASC) {
    from
    block
    id
    to
    value
    txHash
  }
}

`;

const { data } = await query({ query: userQuery });

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-[1200px] mx-auto">
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Block</TableHead>
                <TableHead className="text-right">Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.transfers.map((transfer: any) => (
                <TableRow key={transfer.id}>
                  <Link href={`/rewards/${transfer.from}`}>     <TableCell className="font-mono">{transfer.from}</TableCell></Link>

                  <TableCell className="font-mono">{transfer.to.slice(0, 6)}...{transfer.to.slice(-4)}</TableCell>
                  <TableCell>{transfer.value}</TableCell>
                  <TableCell>{transfer.block}</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`https://etherscan.io/tx/${transfer.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline font-mono"
                    >
                      {transfer.txHash.slice(0, 6)}...{transfer.txHash.slice(-4)}
                    </a>
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
