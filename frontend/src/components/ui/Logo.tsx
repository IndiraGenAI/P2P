interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'dark' | 'light';
  iconOnly?: boolean;
}

const sizeMap = {
  sm: {
    box: 'w-10 h-10',
    iconSize: 22,
    wordmark: 'text-[20px]',
    tagline: 'text-[9px]',
    gap: 'gap-2.5',
  },
  md: {
    box: 'w-12 h-12',
    iconSize: 26,
    wordmark: 'text-[24px]',
    tagline: 'text-[10px]',
    gap: 'gap-3',
  },
  lg: {
    box: 'w-16 h-16',
    iconSize: 36,
    wordmark: 'text-[36px]',
    tagline: 'text-[12px]',
    gap: 'gap-4',
  },
} as const;

export function Logo({
  size = 'sm',
  showTagline = true,
  variant = 'dark',
  iconOnly = false,
}: Readonly<LogoProps>) {
  const s = sizeMap[size];
  const wordmarkColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const accentColor = variant === 'light' ? 'text-emerald-300' : 'text-emerald-500';
  const taglineColor = variant === 'light' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div
      className={`flex items-center transition-all duration-300 ease-in-out ${
        iconOnly ? 'gap-0' : s.gap
      }`}
    >
      <div
        className={`${s.box} rounded-2xl flex items-center justify-center relative overflow-hidden flex-shrink-0`}
        style={{
          background:
            'radial-gradient(circle at 30% 20%, #34D399 0%, #10B981 40%, #047857 100%)',
          boxShadow:
            '0 8px 20px -4px rgba(5, 150, 105, 0.45), 0 2px 4px rgba(5, 150, 105, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(circle at 70% 90%, rgba(0,0,0,0.18) 0%, transparent 55%)',
          }}
        />
        <svg
          width={s.iconSize}
          height={s.iconSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          <path
            d="M16 4.5a11.5 11.5 0 0 1 11.18 8.7"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M24.5 9.5l3 3.5-3.8 1.4"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 27.5A11.5 11.5 0 0 1 4.82 18.8"
            stroke="white"
            strokeOpacity="0.7"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M7.5 22.5l-3-3.5 3.8-1.4"
            stroke="white"
            strokeOpacity="0.7"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="2.4" fill="white" />
        </svg>
      </div>

      <div
        className={`flex flex-col leading-none overflow-hidden transition-all duration-300 ease-in-out ${
          iconOnly ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
        }`}
      >
        <span
          className={`${s.wordmark} font-extrabold ${wordmarkColor} tracking-tight whitespace-nowrap`}
        >
          P<span className={accentColor}>2</span>P
        </span>
        {showTagline && (
          <span
            className={`${s.tagline} font-semibold ${taglineColor} uppercase mt-1 whitespace-nowrap`}
            style={{ letterSpacing: '0.15em' }}
          >
            Procure&nbsp;·&nbsp;to&nbsp;·&nbsp;Pay
          </span>
        )}
      </div>
    </div>
  );
}
