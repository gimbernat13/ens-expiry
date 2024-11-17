import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface DomainExpiryCardProps {
  domain: string
  expiryDate: number
  registrant: string
}

export function DomainExpiryCard({ domain, expiryDate, registrant }: DomainExpiryCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const diff = expiryDate - now

      if (diff <= 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  const getStatusColor = (days: number) => {
    if (days <= 7) return "text-destructive"
    if (days <= 14) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm overflow-hidden group hover:bg-zinc-900/70 transition-colors">
      <a 
        href={`https://app.ens.domains/${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <CardHeader>
          <CardTitle className="font-mono text-lg text-white group-hover:text-blue-400 transition-colors">
            {domain}
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 truncate">
            Registrant: {registrant}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getStatusColor(timeLeft.days)}`}>
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Days</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Hours</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Minutes</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Seconds</div>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  )
} 