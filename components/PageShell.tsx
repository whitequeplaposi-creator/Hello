'use client'

import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FooterProductStrip from '@/components/FooterProductStrip'

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <FooterProductStrip />
      <Footer />
    </>
  )
}
