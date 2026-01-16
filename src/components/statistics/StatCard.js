'use client';

import styles from '@/styles/statistics.module.css';

/**
 * Reusable statistic card component
 * @param {string} icon - Icon component or element to display
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} subtitle - Description or subtitle text
 * @param {string} variant - Card variant for styling ('default', 'primary', 'secondary')
 * @param {function} onClick - Optional click handler
 * @param {boolean} loading - Loading state
 */
export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  variant = 'default',
  onClick,
  loading = false,
}) {
  return (
    <div
      className={`${styles.statCard} ${styles[variant]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {loading ? (
        <div className={styles.cardLoading}>
          <div className={styles.loadingSpinner} />
        </div>
      ) : (
        <>
          <div className={styles.iconWrapper}>
            {icon}
          </div>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardValue}>{value ?? '—'}</p>
          {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        </>
      )}
    </div>
  );
}
