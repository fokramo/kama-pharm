export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <rect width="48" height="48" rx="14" fill="url(#kg)" />
        <path
          d="M24 12v24M12 24h24"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="3.4" fill="url(#kg)" />
        <defs>
          <linearGradient id="kg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
      <span className="leading-none">
        <span
          style={{ fontWeight: 800, fontSize: 20, color: "var(--brand-700)" }}
        >
          קמא פארם
        </span>
        <span
          style={{
            display: "block",
            fontSize: 11,
            color: "var(--muted)",
            fontWeight: 500,
            marginTop: 2,
          }}
        >
          בית מרקחת אונליין
        </span>
      </span>
    </span>
  );
}
