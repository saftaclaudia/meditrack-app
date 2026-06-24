import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookTemplate, Plus, Trash2, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchTemplates, deleteTemplate, createTemplate } from "../mealTemplatesSlice";
import type { MealTemplate } from "../../../types/mealTemplate";

interface Props {
  onApply: (template: MealTemplate) => void;
}

export function MealTemplatesPanel({ onApply }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.mealTemplates);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <BookTemplate size={13} className="text-text-muted dark:text-text-darkMuted" />
        <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
          {t("nutrition.templates_title")}
        </span>
      </div>

      {items.map((tpl) => (
        <div key={tpl._id} className="rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2">
            <button
              className="flex items-center gap-1.5 flex-1 text-left"
              onClick={() => setExpanded(expanded === tpl._id ? null : tpl._id)}
            >
              {expanded === tpl._id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span className="text-xs font-light text-text-secondary dark:text-text-darkSecondary">
                {tpl.name}
              </span>
              <span className="text-[10px] text-text-muted dark:text-text-darkMuted ml-1">
                ({tpl.entries.reduce((s, e) => s + e.calories, 0)} kcal)
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onApply(tpl)}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
              >
                <Zap size={10} />
                {t("nutrition.templates_apply")}
              </button>
              <button
                onClick={() => dispatch(deleteTemplate(tpl._id))}
                className="text-text-muted hover:text-danger transition"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {expanded === tpl._id && (
            <div className="border-t border-border-light dark:border-border-dark px-3 py-2 space-y-1 bg-surface-light dark:bg-surface-dark">
              {tpl.entries.map((e, i) => (
                <div key={i} className="flex justify-between text-[10px] text-text-muted dark:text-text-darkMuted">
                  <span>{e.name}</span>
                  <span>{e.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Button to save current meal as template
interface SaveBtnProps {
  entries: Array<{ name: string; calories: number; quantity: number; unit: string; protein?: number; carbs?: number; fat?: number }>;
}

export function SaveAsTemplateButton({ entries }: SaveBtnProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  if (entries.length === 0) return null;

  const save = async () => {
    if (!name.trim()) return;
    await dispatch(createTemplate({ name: name.trim(), entries }));
    setName("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[10px] text-text-muted dark:text-text-darkMuted hover:text-primary transition"
      >
        <Plus size={11} />
        {t("nutrition.templates_save_as")}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setOpen(false); }}
        placeholder={t("nutrition.templates_name_placeholder")}
        className="flex-1 h-7 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-2 text-xs focus:outline-none focus:border-primary"
      />
      <button onClick={save} className="h-7 px-3 rounded-xl bg-primary text-white text-[10px] font-light">
        {t("nutrition.templates_save_btn")}
      </button>
      <button onClick={() => setOpen(false)} className="h-7 px-2 text-text-muted text-[10px]">✕</button>
    </div>
  );
}
