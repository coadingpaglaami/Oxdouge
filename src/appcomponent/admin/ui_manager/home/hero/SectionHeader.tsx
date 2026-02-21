export const SectionHeader = ({
  label,
  index,
  badge,
  badgeVariant = 'violet',
}: {
  label: string;
  index: string;
  badge?: string;
  badgeVariant?: 'violet' | 'emerald';
}) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="text-[10px] font-mono text-gray-700 shrink-0">{index}</span>
    <div className="flex-1 h-px bg-white/5" />
    <h2 className="text-[11px] font-mono tracking-widest uppercase text-gray-500 shrink-0">
      {label}
    </h2>
    {badge && (
      <span
        className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
          badgeVariant === 'emerald'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
        }`}
      >
        {badge}
      </span>
    )}
    <div className="flex-1 h-px bg-white/5" />
  </div>
);