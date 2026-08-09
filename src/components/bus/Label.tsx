export function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55 transition-all duration-300 hover:text-ink/90 ${className}`}
    >
      {children}
    </span>
  );
}
