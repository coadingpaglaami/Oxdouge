export const ParagraphFields = ({
  paragraphs,
  onChange,
  disabled = false,
}: {
  paragraphs: string[];
  onChange: (updated: string[]) => void;
  disabled?: boolean;
}) => {
  const MAX_CHARS = 60;

  const handleChange = (index: number, value: string) => {
    if (value.length > MAX_CHARS) return;
    const updated = [...paragraphs];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
        Description Paragraphs
      </label>
      {paragraphs.map((value, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Paragraph ${index + 1}`}
              maxLength={MAX_CHARS}
              disabled={disabled}
              className="w-full bg-black/60 border border-white/[0.07] rounded-lg px-3 py-2.5 pr-14 text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums transition-colors duration-200 ${
                value.length >= MAX_CHARS
                  ? "text-red-400"
                  : value.length >= MAX_CHARS * 0.8
                  ? "text-amber-400"
                  : "text-gray-600"
              }`}
            >
              {value.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};