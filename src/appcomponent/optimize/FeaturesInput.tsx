"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  features: string[];
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FeaturesInput = ({ features, setFeatures }: Props) => {
  const updateFeature = (idx: number, value: string) => setFeatures(features.map((f, i) => (i === idx ? value : f)));
  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm">Key Features</label>
      <div className="flex flex-col gap-2 w-full">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-1 w-full">
            <input type="text" value={f} onChange={(e) => updateFeature(i, e.target.value)} className="p-1 rounded border border-primary/20 bg-transparent text-white w-36" />
            <button type="button" onClick={() => removeFeature(i)} className="text-red-500">X</button>
          </div>
        ))}
        <Button variant={'outline'} onClick={addFeature} className="rounded-full w-fit p-2 self-center">Add +</Button>
      </div>
    </div>
  );
};
