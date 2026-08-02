"use client";

import { useState, useTransition } from "react";
import { updateSiteSetting } from "@/actions/settings";
import { Check, AlertCircle, Building2, Phone, Share2, Wallet } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";
const panelClass =
  "rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8";

const CATEGORIES = {
  brand: { label: "Brand Information", icon: Building2 },
  contact: { label: "Contact Details", icon: Phone },
  social: { label: "Social Media", icon: Share2 },
  payment: { label: "Payment Methods", icon: Wallet },
};

const TOGGLE_LABELS = {
  cod_enabled: "Cash on Delivery",
  online_payment_enabled: "Online Payment (Razorpay)",
};

export default function SettingsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [pending, startTransition] = useTransition();
  const [savingCategory, setSavingCategory] = useState(null);
  const [saved, setSaved] = useState(null);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleSaveSection = (category, items) => {
    setSaved(null);
    setSavingCategory(category);
    startTransition(async () => {
      const results = await Promise.all(items.map((item) => updateSiteSetting(item.key, settings[item.key].value)));
      const failed = results.find((r) => !r.success);
      setSavingCategory(null);
      if (failed) {
        setSaved({ category, success: false, error: failed.error });
      } else {
        setSaved({ category, success: true });
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  const groupedSettings = {};
  Object.entries(settings).forEach(([key, data]) => {
    const cat = data.category || "general";
    // Home Customization (hero/marquee/choose/journey/limited/testimonials/faq)
    // has its own dedicated page — don't dump those settings here too.
    if (!CATEGORIES[cat]) return;
    if (!groupedSettings[cat]) groupedSettings[cat] = [];
    groupedSettings[cat].push({ key, ...data });
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedSettings).map(([category, items]) => {
        const meta = CATEGORIES[category] || { label: category, icon: Building2 };
        const isSaving = pending && savingCategory === category;
        return (
          <div key={category} className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                  <meta.icon className="h-4 w-4" />
                </div>
                <h2 className="font-display text-lg text-ink">{meta.label}</h2>
              </div>
              <button
                onClick={() => handleSaveSection(category, items)}
                disabled={isSaving}
                className="btn-gold px-6 py-2.5 text-xs font-semibold disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {items.map((item) => {
                const isToggle = item.key in TOGGLE_LABELS;
                const isOn = item.value !== "false";

                if (isToggle) {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleChange(item.key, isOn ? "false" : "true")}
                      className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-300 ${
                        isOn ? "border-green-500/30 bg-green-500/10 text-green-700" : "border-ink/10 bg-ivory-deep text-ink/60"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium leading-snug">{TOGGLE_LABELS[item.key]}</span>
                        {item.description && (
                          <span className="mt-0.5 block text-sm leading-snug text-current opacity-70">{item.description}</span>
                        )}
                      </span>
                      <span
                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
                          isOn ? "bg-green-500/80" : "bg-ink/15"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                            isOn ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                    </button>
                  );
                }

                return (
                  <div key={item.key} className="sm:col-span-2">
                    <label className={labelClass}>{item.description || item.key}</label>
                    <textarea
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      rows={item.value.length > 80 ? 3 : 1}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                );
              })}
            </div>

            {saved?.category === category && (
              <div className={`mt-4 flex items-center gap-2 text-sm ${saved.success ? "text-emerald-600" : "text-red-600"}`}>
                {saved.success ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Saved successfully
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" /> {saved.error}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
