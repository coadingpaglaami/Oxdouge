'use client';

import { useState, useEffect } from 'react';
import {
    useGetHeadingSectionQuery,
    useUpdateHeadingSectionMutation,
} from '@/api/ui_manager';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeadingSection {
    id: number;
    heading1: string;
    subheading1: string;
    heading2: string;
    subheading2: string;
    heading3: string;
    subheading3: string;
    heading4: string;
    subheading4: string;
    heading5: string;
    subheading5: string;
    created_at: string;
    updated_at: string;
}

interface HeadingSectionUpdatePayload {
    heading4?: string;
    subheading4?: string;
    heading5?: string;
    subheading5?: string;
}

interface FormState {
    heading4: string;
    subheading4: string;
    heading5: string;
    subheading5: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const FIELD_CONFIG: {
    label: string;
    description: string;
    headingKey: keyof FormState;
    subheadingKey: keyof FormState;
    accent: {
        badge: string;
        border: string;
        dot: string;
        ring: string;
    };
}[] = [
    {
        label: 'About',
        description: 'Intro section on your about page',
        headingKey: 'heading4',
        subheadingKey: 'subheading4',
        accent: {
            badge: 'bg-cyan-50 text-cyan-700',
            border: 'border-l-cyan-400',
            dot: 'bg-cyan-400',
            ring: 'focus:border-cyan-400 focus:ring-cyan-100',
        },
    },
    {
        label: 'Our Values',
        description: 'Values section displayed on about page',
        headingKey: 'heading5',
        subheadingKey: 'subheading5',
        accent: {
            badge: 'bg-amber-50 text-amber-700',
            border: 'border-l-amber-400',
            dot: 'bg-amber-400',
            ring: 'focus:border-amber-400 focus:ring-amber-100',
        },
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const AboutHeadingManagement = () => {
    const { data: headingData, isLoading } = useGetHeadingSectionQuery({});
    const [updateHeadingSection, { isLoading: isUpdating }] = useUpdateHeadingSectionMutation();

    const record = (headingData as HeadingSection[] | undefined)?.[0];

    const [form, setForm] = useState<FormState>({
        heading4: '',
        subheading4: '',
        heading5: '',
        subheading5: '',
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (record) {
            setForm({
                heading4: record.heading4,
                subheading4: record.subheading4,
                heading5: record.heading5,
                subheading5: record.subheading5,
            });
        }
    }, [record]);

    const handleChange = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (!record) return;
        const payload: HeadingSectionUpdatePayload = {
            heading4: form.heading4,
            subheading4: form.subheading4,
            heading5: form.heading5,
            subheading5: form.subheading5,
        };
        await updateHeadingSection({ id: record.id, data: payload });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-10 text-slate-400">
                <span className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin" />
                <span className="text-sm">Loading headings…</span>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-6 bg-slate-800 border-b border-slate-700">
                <div className="space-y-1">
                    <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-cyan-700">
                        About Page
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-100">
                        About &amp; Values Headings
                    </h2>
                    <p className="text-sm text-slate-400">
                        Manage heading &amp; subheading copy for your About and Our Values sections.
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className={[
                        'rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        saved
                            ? 'bg-emerald-500 text-white focus:ring-emerald-400'
                            : isUpdating
                            ? 'cursor-not-allowed bg-slate-600 text-slate-400'
                            : 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
                    ].join(' ')}
                >
                    {isUpdating ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
                </button>
            </div>

            {/* ── Section Cards ── */}
            <div className="flex flex-col gap-0 divide-y divide-slate-700">
                {FIELD_CONFIG.map((field) => (
                    <div
                        key={field.headingKey}
                        className={`border-l-4 px-8 py-6 transition-colors hover:bg-slate-800/70 ${field.accent.border}`}
                    >
                        {/* Label */}
                        <div className="mb-5 flex items-center gap-3">
                            <span className={`h-2 w-2 rounded-full ${field.accent.dot}`} />
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${field.accent.badge}`}>
                                {field.label}
                            </span>
                            <span className="text-xs text-slate-500">{field.description}</span>
                        </div>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Heading */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={form[field.headingKey]}
                                    onChange={(e) => handleChange(field.headingKey, e.target.value)}
                                    placeholder={`${field.label} heading…`}
                                    className={[
                                        'rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5',
                                        'text-sm text-slate-100 placeholder:text-slate-600',
                                        'outline-none transition focus:ring-2',
                                        field.accent.ring,
                                    ].join(' ')}
                                />
                            </div>

                            {/* Subheading */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                                    Subheading
                                </label>
                                <textarea
                                    rows={2}
                                    value={form[field.subheadingKey]}
                                    onChange={(e) => handleChange(field.subheadingKey, e.target.value)}
                                    placeholder={`${field.label} subheading…`}
                                    className={[
                                        'resize-y rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5',
                                        'text-sm leading-relaxed text-slate-100 placeholder:text-slate-600',
                                        'outline-none transition focus:ring-2',
                                        field.accent.ring,
                                    ].join(' ')}
                                />
                            </div>
                        </div>

                        {/* Live preview */}
                        {(form[field.headingKey] || form[field.subheadingKey]) && (
                            <div className="mt-4 rounded-lg border border-dashed border-slate-700 bg-slate-800 px-4 py-3">
                                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                    Preview
                                </p>
                                {form[field.headingKey] && (
                                    <p className="text-base font-bold tracking-tight text-slate-100">
                                        {form[field.headingKey]}
                                    </p>
                                )}
                                {form[field.subheadingKey] && (
                                    <p className="mt-0.5 text-sm leading-relaxed text-slate-400">
                                        {form[field.subheadingKey]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Footer ── */}
            {record && (
                <div className="border-t border-slate-700 bg-slate-800/40 px-8 py-3 text-right">
                    <span className="text-xs text-slate-500">
                        Last updated:{' '}
                        {new Date(record.updated_at).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                    </span>
                </div>
            )}
        </div>
    );
};