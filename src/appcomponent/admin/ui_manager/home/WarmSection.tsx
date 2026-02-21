'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useGetWarmQuery, useUpdateWarmMutation } from '@/api/ui_manager';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/* ─── Types ──────────────────────────────────────────────────────── */
interface WarmData {
  // id is NOT present in the API response — we use a fixed id (e.g. 1)
  // or derive it from the URL. Check with your backend if PATCH needs it.
  heading1: string | null;
  description1: string | null;
  icon1: string | null;
  heading2: string | null;
  description2: string | null;
  icon2: string | null;
  heading3: string | null;
  description3: string | null;
  icon3: string | null;
  heading4: string | null;
  description4: string | null;
  icon4: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

type FeatureIndex = 1 | 2 | 3 | 4;

interface FeatureSlot {
  index: FeatureIndex;
  heading: string;
  description: string;
  icon: File | null;
  iconPreview: string | null;
}

interface MainImageState {
  file: File | null;
  preview: string | null;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

const IconPlaceholder = () => (
  <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UploadIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── FeatureCardForm — MUST be at module scope to avoid focus loss ── */
interface FeatureCardFormProps {
  slot: FeatureSlot;
  setSlot: React.Dispatch<React.SetStateAction<FeatureSlot | null>>;
  fileRef: React.RefObject<HTMLInputElement> | null;
  onFilePick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeatureCardForm = ({ slot, setSlot, fileRef, onFilePick, onFileChange }: FeatureCardFormProps) => (
  <div className="flex flex-col gap-4">
    {/* Live preview */}
    <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-900/60 to-amber-700/40 flex items-center justify-center overflow-hidden border border-primary/20">
        {slot.iconPreview ? (
          <Image src={slot.iconPreview} alt="preview" width={36} height={36} className="w-8 h-8 object-cover rounded-lg" />
        ) : (
          <svg className="w-5 h-5 text-primary/50" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-primary text-sm font-bold truncate">{slot.heading || 'Feature Heading'}</p>
        <p className="text-neutral-500 text-xs truncate">{slot.description || 'Feature description…'}</p>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 shrink-0">
        Card {slot.index}
      </span>
    </div>

    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Heading</Label>
      <Input
        value={slot.heading}
        onChange={(e) => setSlot((p) => p ? { ...p, heading: e.target.value } : p)}
        placeholder="e.g. Premium Quality"
        className="bg-[#1a1a1a] border-white/[0.08] text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary"
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Description</Label>
      <Textarea
        value={slot.description}
        onChange={(e) => setSlot((p) => p ? { ...p, description: e.target.value } : p)}
        placeholder="e.g. Engineered for the toughest conditions…"
        rows={3}
        className="bg-[#1a1a1a] border-white/[0.08] text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary resize-none"
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Icon</Label>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      <div
        role="button"
        tabIndex={0}
        onClick={onFilePick}
        onKeyDown={(e) => e.key === 'Enter' && onFilePick()}
        className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-xl py-4 cursor-pointer text-neutral-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
      >
        {slot.iconPreview ? (
          <>
            <Image src={slot.iconPreview} alt="icon" width={48} height={48} className="object-cover rounded-xl border border-white/10" />
            <span className="text-xs">Click to change</span>
          </>
        ) : (
          <>
            <UploadIcon />
            <span className="text-xs">Upload icon</span>
            <span className="text-[11px] text-neutral-700">PNG, JPG, SVG</span>
          </>
        )}
      </div>
    </div>
  </div>
);

/* ─── MainImageForm — module scope ──────────────────────────────── */
interface MainImageFormProps {
  state: MainImageState;
  currentUrl: string | null;
  fileRef: React.RefObject<HTMLInputElement> | null;
  onFilePick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainImageForm = ({ state, currentUrl, fileRef, onFilePick, onFileChange }: MainImageFormProps) => {
  const preview = state.preview ?? currentUrl;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-400 leading-relaxed">
        This is the primary hero image displayed in the Warm section.
      </p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      <div
        role="button"
        tabIndex={0}
        onClick={onFilePick}
        onKeyDown={(e) => e.key === 'Enter' && onFilePick()}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[#1a1a1a] hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
        style={{ aspectRatio: '16/9' }}
      >
        {preview ? (
          <>
            <Image src={preview} alt="main image" fill className="object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center rounded-2xl">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 text-white">
                <UploadIcon />
                <span className="text-sm font-semibold">Replace image</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-600">
            <UploadIcon className="w-8 h-8" />
            <span className="text-sm">Click to upload main image</span>
            <span className="text-xs text-neutral-700">Recommended: 1920×1080px</span>
          </div>
        )}
      </div>
      {state.file && (
        <p className="text-xs text-primary flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Selected: {state.file.name}
        </p>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */

export const WarmSection = () => {
  // getWarm takes no args — query: () => "section/"
  const { data, isLoading } = useGetWarmQuery({});
  const [updateWarm, { isLoading: isUpdating }] = useUpdateWarmMutation();

  const warm = data as WarmData | undefined;

  /* ── Dialog state ── */
  const [featureDialog, setFeatureDialog] = useState<FeatureSlot | null>(null);
  const [mainImageOpen, setMainImageOpen] = useState(false);
  const [mainImageState, setMainImageState] = useState<MainImageState>({ file: null, preview: null });

  /* ── File refs ── */
  const featureFileRef = useRef<HTMLInputElement>(null!);
  const mainFileRef = useRef<HTMLInputElement>(null!);

  /* ── Feature card handlers ── */
  const openFeature = (index: FeatureIndex) => {
    setFeatureDialog({
      index,
      heading: warm?.[`heading${index}`] ?? '',
      description: warm?.[`description${index}`] ?? '',
      icon: null,
      iconPreview: warm?.[`icon${index}`] ?? null,
    });
  };

  const handleFeatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeatureDialog((prev) => prev ? { ...prev, icon: file, iconPreview: URL.createObjectURL(file) } : prev);
    e.target.value = '';
  };

  const triggerFeatureFilePick = () => {
    if (featureFileRef.current) { featureFileRef.current.value = ''; featureFileRef.current.click(); }
  };

  const handleFeatureSave = async () => {
    if (!featureDialog) return;
    const fd = new FormData();
    fd.append(`heading${featureDialog.index}`, featureDialog.heading);
    fd.append(`description${featureDialog.index}`, featureDialog.description);
    if (featureDialog.icon) {
      fd.append(`icon${featureDialog.index}`, featureDialog.icon, featureDialog.icon.name);
    }
    // Pass FormData directly — browser sets Content-Type: multipart/form-data automatically
    await updateWarm({ data: fd });
    toast.success(`Card ${featureDialog.index} updated!`);
    setFeatureDialog(null);
  };

  /* ── Main image handlers ── */
  const openMainImage = () => {
    setMainImageState({ file: null, preview: null });
    setMainImageOpen(true);
  };

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageState({ file, preview: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const triggerMainFilePick = () => {
    if (mainFileRef.current) { mainFileRef.current.value = ''; mainFileRef.current.click(); }
  };

  const handleMainImageSave = async () => {
    if (!mainImageState.file) return;
    const fd = new FormData();
    fd.append('image', mainImageState.file, mainImageState.file.name);
    await updateWarm({ data: fd });
    toast.success('Main image updated!');
    setMainImageOpen(false);
  };

  const featureCards = ([1, 2, 3, 4] as const).map((i) => ({
    index: i,
    heading: warm?.[`heading${i}`] ?? null,
    description: warm?.[`description${i}`] ?? null,
    icon: warm?.[`icon${i}`] ?? null,
  }));

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center gap-3 text-neutral-500">
        <Spinner /> Loading section data…
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Manage <span className="text-primary">Warm Section</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary bg-primary/10 rounded-full px-3 py-1">
              Admin
            </span>
          </div>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            Update the main image and up to four feature cards displayed in the Warm section.
          </p>
        </div>

        {/* ── Main Image Card ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Main Image</h3>
            <Button
              onClick={openMainImage}
              size="sm"
              className="flex items-center gap-2 bg-primary text-black font-semibold hover:bg-primary/80 text-xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Replace Image
            </Button>
          </div>

          <div
            className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#121212] cursor-pointer group"
            style={{ aspectRatio: '16/6' }}
            onClick={openMainImage}
          >
            {warm?.image ? (
              <>
                <Image src={warm.image} alt="Warm section main image" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/10">
                    <UploadIcon className="w-4 h-4" />
                    Click to replace
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-xs text-neutral-300 font-medium px-2.5 py-1 rounded-lg border border-white/10">
                  Main Section Image
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-600">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm">No image set — click to upload</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div>
          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4">Feature Cards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureCards.map(({ index, heading, description, icon }) => (
              <div
                key={index}
                className="flex flex-col bg-[#121212] rounded-2xl p-5 border border-white/[0.08] hover:border-primary hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1e1e1e] border border-white/[0.08] overflow-hidden flex-shrink-0">
                    {icon ? (
                      <Image src={icon} alt={heading ?? `Card ${index}`} width={36} height={36} className="w-8 h-8 object-cover rounded-lg" />
                    ) : (
                      <IconPlaceholder />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 font-mono uppercase tracking-widest">
                    Card {String(index).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex-1 min-w-0 mb-4">
                  {heading ? (
                    <>
                      <h4 className="text-primary font-bold text-sm mb-1 truncate">{heading}</h4>
                      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3">{description}</p>
                    </>
                  ) : (
                    <p className="text-neutral-700 text-xs italic">No content set</p>
                  )}
                </div>

                <button
                  onClick={() => openFeature(index)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400 border border-white/10 rounded-lg py-2 hover:bg-white/5 hover:border-white/20 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Edit Card {index}
                </button>
              </div>
            ))}
          </div>
        </div>

        {warm?.updated_at && (
          <p className="mt-8 text-xs text-neutral-700 font-mono">
            Last updated: {new Date(warm.updated_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* ══════════════ FEATURE CARD DIALOG ══════════════ */}
      <Dialog open={!!featureDialog} onOpenChange={(open) => { if (!open) setFeatureDialog(null); }}>
        <DialogContent className="bg-[#141414] border border-white/10 text-white max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Edit Feature Card <span className="text-primary">#{featureDialog?.index}</span>
            </DialogTitle>
          </DialogHeader>

          {featureDialog && (
            <FeatureCardForm
              slot={featureDialog}
              setSlot={setFeatureDialog}
              fileRef={featureFileRef}
              onFilePick={triggerFeatureFilePick}
              onFileChange={handleFeatureFileChange}
            />
          )}

          <DialogFooter className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-white/10 text-neutral-300 hover:bg-white/5 bg-transparent">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleFeatureSave}
              disabled={isUpdating}
              className="flex items-center gap-2 bg-primary text-black hover:bg-primary/80 disabled:opacity-50"
            >
              {isUpdating && <Spinner />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════ MAIN IMAGE DIALOG ══════════════ */}
      <Dialog open={mainImageOpen} onOpenChange={(open) => { if (!open) setMainImageOpen(false); }}>
        <DialogContent className="bg-[#141414] border border-white/10 text-white max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Replace <span className="text-primary">Main Image</span>
            </DialogTitle>
          </DialogHeader>

          <MainImageForm
            state={mainImageState}
            currentUrl={warm?.image ?? null}
            fileRef={mainFileRef}
            onFilePick={triggerMainFilePick}
            onFileChange={handleMainFileChange}
          />

          <DialogFooter className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-white/10 text-neutral-300 hover:bg-white/5 bg-transparent">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleMainImageSave}
              disabled={isUpdating || !mainImageState.file}
              className="flex items-center gap-2 bg-primary text-black hover:bg-primary/80 disabled:opacity-50"
            >
              {isUpdating && <Spinner />}
              Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};