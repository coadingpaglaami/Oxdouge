export const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
  accent = 'violet',
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  accent?: 'violet' | 'emerald';
  disabled?: boolean;
}) => {
  const ring =
    accent === 'emerald'
      ? 'focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
      : 'focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20';
  const base = `w-full bg-black/60 border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-all duration-200 ${ring} disabled:cursor-not-allowed disabled:opacity-60 `;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-y`}
          disabled={disabled}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
          disabled={disabled}
        />
      )}
    </div>
  );
};
