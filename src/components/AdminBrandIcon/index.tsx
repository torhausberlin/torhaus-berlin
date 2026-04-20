import React from 'react'

import styles from './index.module.css'

/** Same mark as the admin logo, sized for `admin.components.graphics.Icon`. */
export const AdminNavLogo: React.FC = () => {
  return (
    <div className={styles.wrap}>
      <img
        alt="Torhaus Berlin"
        className={styles.image}
        decoding="async"
        height={32}
        src="/logo.png"
        width={32}
      />
    </div>
  )
}
