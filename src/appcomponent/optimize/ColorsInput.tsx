"use client";

import React from "react";

interface Props {
  colors: string[];
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ColorsInput = ({ colors, setColors }: Props) => {
  const updateColor = (idx: number, value: string) =>
    setColors(colors.map((c, i) => (i === idx ? value : c)));
  const addColor = () => setColors([...colors, ""]);
  const removeColor = (idx: number) =>
    setColors(colors.filter((_, i) => i !== idx));

  return (
    // <div className="flex flex-col gap-2">
    //   <label className="text-white text-sm">Colors</label>
    //   <div className="flex flex-wrap gap-2">
    //     {colors.map((c, i) => (
    //       <div key={i} className="flex items-center gap-1">
    //         <input type="text" value={c} onChange={(e) => updateColor(i, e.target.value)} className="p-1 rounded border border-primary/20 bg-transparent text-white w-20" />
    //         <button type="button" onClick={() => removeColor(i)} className="text-red-500">X</button>
    //       </div>
    //     ))}
    //     <button type="button" onClick={addColor} className="text-primary">+ Add</button>
    //   </div>
    // </div>
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm">Colors</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-[#1a1a1a] px-2 py-1 rounded"
          >
            {/* Color Picker */}
            <input
              type="color"
              value={c}
              onChange={(e) => updateColor(i, e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-none outline-none"
            />
            {/* Hex Value Input */}
            <input
              type="text"
              value={c}
              onChange={(e) => updateColor(i, e.target.value)}
              className="p-1 rounded border border-primary/20 bg-transparent text-white w-24"
            />
            <button
              type="button"
              onClick={() => removeColor(i)}
              className="text-red-500 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addColor}
          className="text-primary hover:underline"
        >
          + Add
        </button>
      </div>
    </div>
  );
};
