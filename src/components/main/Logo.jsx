export default function Logo({ className = "h-8", showText = true , textColor = "text-on-surface"}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        className="h-6 w-6 text-primary flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path
          d="M12 2C8 2 6 6 6 12C6 18 8 22 12 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
      </svg>
      {showText && (
        <span className={`font-display text-xl font-extrabold tracking-tight ${textColor}`}>
          Jalinan Anak Sehat
        </span>
      )}
    </div>
  );
}
