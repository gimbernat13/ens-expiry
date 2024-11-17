'use client'

import { DomainExpiryCard } from "./DomainExpiryCard"

interface Registration {
  id: string
  domain: {
    name: string
  }
  expiryDate: string
  registrant: {
    id: string
  }
}

interface DomainExpiryCardsProps {
  registrations: Registration[]
  isExpired?: boolean
}

export function DomainExpiryCards({ registrations, isExpired = false }: DomainExpiryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {registrations.map((registration) => (
        <DomainExpiryCard
          key={registration.id}
          domain={registration.domain.name}
          expiryDate={Number(registration.expiryDate)}
          registrant={registration.registrant.id}
          isExpired={isExpired}
        />
      ))}
    </div>
  )
} 