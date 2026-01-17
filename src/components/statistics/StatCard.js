'use client';

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
  const baseClasses = "bg-white rounded-xl p-6 text-center border border-slate-200 transition-all duration-300 flex flex-col items-center min-h-[180px] hover:-translate-y-1 hover:shadow-lg hover:border-[#0468B1]";
  const primaryClasses = "bg-gradient-to-br from-[#0468B1] to-[#1e5fbb] border-none";
  const clickableClasses = onClick ? "cursor-pointer focus:outline-2 focus:outline-[#0468B1] focus:outline-offset-2" : "";
  
  const cardClasses = `${baseClasses} ${variant === 'primary' ? primaryClasses : ''} ${clickableClasses}`;
  const textColor = variant === 'primary' ? 'text-white' : 'text-[#1e3a5f]';
  const subtitleColor = variant === 'primary' ? 'text-white' : 'text-slate-500';
  const iconBg = variant === 'primary' ? 'bg-white/20 text-white' : 'bg-[#e8f4fd] text-[#0468B1]';

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full min-h-[120px]">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#0468B1] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
            {icon}
          </div>
          <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${textColor}`}>{title}</h3>
          <p className={`text-xl font-bold mb-2 leading-tight break-words ${textColor}`}>{value ?? '—'}</p>
          {subtitle && <p className={`text-xs italic ${subtitleColor}`}>{subtitle}</p>}
        </>
      )}
    </div>
  );
}
