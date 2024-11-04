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
import Link from "next/link";
import { Info } from "lucide-react";
import HyperText from "@/components/ui/hyper-text";
import { ArrowUpRight } from "lucide-react";
import { RewardsChart } from "@/components/RewardsChart";

const userQuery = gql`
query {
  transfers(limit: 500, orderBy: block_DESC) {
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

const formatCPOOLValue = (value: string) => {
  // Convert from wei (18 decimals) to regular CPOOL value
  const num = Number(value) / 1e18;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-zinc-950">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Stats Cards Row */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
            <CardHeader>
              <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                Reward Rate
                <Info className="w-4 h-4" />
              </CardDescription>
              <div className="flex items-center mt-2">
                <HyperText
                  className="text-2xl font-bold text-white"
                  text="5"
                />
                <span className="text-2xl text-white/80 ml-1">%</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
            <CardHeader>
              <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                Reward Token
                <Info className="w-4 h-4" />
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png"
                  alt="CPOOL"
                  className="w-6 h-6"
                />
                <span className="text-2xl font-bold text-white">RW-CPOOL</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
            <CardHeader>
              <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                Total Indexed Transfers
                <Info className="w-4 h-4" />
              </CardDescription>
              <div className="mt-2">
                <HyperText
                  className="text-2xl font-bold text-white"
                  text={data?.transfers.length.toString() || "0"}
                />
              </div>
            </CardHeader>
          </Card>
        </div>
        <RewardsChart rewardHistory={data?.transfers} />


        {/* Main Table Card */}
        <Card className="bg-zinc-900 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Recent Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table >
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400 text-xs font-semibold uppercase">Sender</TableHead>
                  <TableHead className="text-zinc-400 text-xs font-semibold uppercase">Network</TableHead>
                  <TableHead className="text-zinc-400 text-xs font-semibold uppercase">Value</TableHead>
                  <TableHead className="text-zinc-400 text-xs font-semibold uppercase">Block</TableHead>
                  <TableHead className="text-zinc-400 text-xs font-semibold uppercase text-right">Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transfers.map((transfer: any) => (
                  <TableRow 
                    key={transfer.id}
                    className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <Link 
                        href={`/rewards/${transfer.from}`}
                        className="flex items-center gap-2 hover:bg-zinc-800 rounded-md transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <img
                            src={`https://effigy.im/a/${transfer.from}.svg`}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <span className="font-semibold text-white">
                          {transfer.from.slice(0, 6)}...{transfer.from.slice(-4)}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <img
                            src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                            alt="ETH"
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="text-white font-medium">Ethereum</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png" 
                          alt="CPOOL" 
                          className="w-5 h-5"
                        />
                        <span className="text-white font-medium">
                          {formatCPOOLValue(transfer.value)}
                        </span>
                        <span className="text-white/80">
                          <strong>CPOOL</strong>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80 font-semibold">
                      {transfer.block}
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`https://etherscan.io/tx/${transfer.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-mono"
                      >
                        {transfer.txHash.slice(0, 6)}...{transfer.txHash.slice(-4)}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
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


