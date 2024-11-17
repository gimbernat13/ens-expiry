import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-zinc-400 text-sm font-medium">Search ENS Domains</CardTitle>
        <CardDescription>Enter a domain name to check its availability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-20 bg-zinc-800 rounded" />
        </div>
      </CardContent>
    </Card>
  );
} 