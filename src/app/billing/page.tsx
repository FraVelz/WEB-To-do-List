import type { Metadata } from 'next'

import { PageBilling } from '@/features/account/PageBilling'

export const metadata: Metadata = {
  title: 'Facturación — To-do',
  description: 'Plan y facturas.',
}

export default function BillingPage() {
  return <PageBilling />
}
