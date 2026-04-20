import React from 'react'

import { cn } from '@/utilities/ui'

import styles from './index.module.css'

function BrandImage() {
  return (
    <img
      alt="Torhaus Berlin"
      className={styles.image}
      decoding="async"
      height={120}
      src="/logo.png"
      width={120}
    />
  )
}

/** Brand logo in admin chrome (`admin.components.graphics.Logo`) — login and logged-in UI. */
export const AdminNavLogo: React.FC = () => {
  return (
    <div className={cn(styles.wrap, styles.navLogo)}>
      <BrandImage />
    </div>
  )
}
