import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  href,
  onClick,
  className = '',
  external = false,
}) => {
  const baseClasses =
    'group relative inline-flex items-center gap-3 bg-sage-green text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden transition-transform duration-200 active:scale-[0.98] hover:shadow-lg';

  const inner = (
    <>
      <span className="absolute inset-0 bg-[#4a6e5d] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${className}`}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {inner}
    </button>
  );
};

export default PrimaryButton;