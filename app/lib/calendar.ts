export function generateGoogleCalendarUrl(domain: string, expiryDate: number) {
  const date = new Date(expiryDate * 1000);
  const endDate = new Date(date.getTime() + (24 * 60 * 60 * 1000)); // Add one day

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${domain} ENS Domain Expiry`,
    details: `The ENS domain ${domain} is expiring. Consider renewing or preparing for registration.`,
    dates: `${date.toISOString().replace(/-|:|\.\d\d\d/g, '')}/${endDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}`,
  });

  return `https://calendar.google.com/calendar/render?${params}`;
} 