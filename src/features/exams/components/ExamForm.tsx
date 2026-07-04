import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../app/hooks";
import { useToast } from "../../../context/ToastContext";
import type { Exam, ExamWithMongoId } from "../../../types/exam";
import { Button } from "../../../components/ui/Button";
import { examToFormData } from "../utils/examMappers";
import type { ExamFormData } from "../../../types/examForm";
import { Input, Textarea } from "../../../components/ui/FormFields";
import { FileUploadField } from "../../../components/ui/FileUploadField";
import { createExam, updateExam } from "../examsThunks";
import { RECOMMENDED_EXAMS } from "../constants/recommendedExams";

interface ExamFormProps {
  editingExam: Exam | null;
  onFinish: () => void;
  prefill?: { name?: string; speciality?: string } | null;
}

const FREQUENCY_OPTIONS = [3, 6, 12, 24, 36, 60] as const;

const emptyForm: ExamFormData = {
  name: "",
  clinic: "",
  doctor: "",
  speciality: "",
  nextDate: "",
  lastDate: "",
  recommendedFrequencyMonths: "",
  result: "",
  resultValue: "",
  resultUnit: "",
  treatment: "",
  notes: "",
  documents: [],
};

function normalizeName(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function suggestNextDateFromExams(name: string, lastDate: string): string {
  if (!lastDate) return "";
  const norm = normalizeName(name);
  const match = RECOMMENDED_EXAMS.find((r) =>
    [r.name, ...r.aliases].some(
      (alias) =>
        normalizeName(alias).includes(norm) ||
        norm.includes(normalizeName(alias)),
    ),
  );
  if (!match) return "";
  const d = new Date(lastDate + "T00:00:00");
  d.setMonth(d.getMonth() + match.frequencyMonths);
  return d.toISOString().split("T")[0];
}

function computeNextDate(lastDate: string, frequencyMonths: number): string {
  const d = new Date(lastDate + "T00:00:00");
  d.setMonth(d.getMonth() + frequencyMonths);
  return d.toISOString().split("T")[0];
}

export function ExamForm({ editingExam, onFinish, prefill }: ExamFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [form, setForm] = useState<ExamFormData>(() =>
    editingExam
      ? {
          ...examToFormData(editingExam),
          documents: editingExam.documents ?? [],
          resultValue:
            editingExam.resultValue != null
              ? String(editingExam.resultValue)
              : "",
          resultUnit: editingExam.resultUnit ?? "",
        }
      : {
          ...emptyForm,
          name: prefill?.name ?? "",
          speciality: prefill?.speciality ?? "",
        },
  );

  const [nextSuggestion, setNextSuggestion] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "lastDate" && value && !prev.nextDate) {
        const freqMonths = prev.recommendedFrequencyMonths
          ? parseInt(prev.recommendedFrequencyMonths)
          : null;
        if (freqMonths) {
          setNextSuggestion(computeNextDate(value, freqMonths));
        } else {
          const suggestion = suggestNextDateFromExams(prev.name, value);
          setNextSuggestion(suggestion || null);
        }
      }
      return updated;
    });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => {
      if (value && prev.lastDate && !prev.nextDate) {
        setNextSuggestion(computeNextDate(prev.lastDate, parseInt(value)));
      } else if (!value && prev.lastDate && !prev.nextDate) {
        const suggestion = suggestNextDateFromExams(prev.name, prev.lastDate);
        setNextSuggestion(suggestion || null);
      }
      return { ...prev, recommendedFrequencyMonths: value };
    });
  };

  const handleSubmit = async () => {
    const newErrors: { name?: string } = {};
    if (!form.name.trim()) {
      newErrors.name = t("exams.form_error_name_required");
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      ...form,
      resultValue:
        form.resultValue !== "" ? Number(form.resultValue) : undefined,
      recommendedFrequencyMonths:
        form.recommendedFrequencyMonths !== ""
          ? Number(form.recommendedFrequencyMonths)
          : undefined,
    };
    try {
      if (editingExam) {
        const examId = (editingExam as ExamWithMongoId)._id ?? editingExam.id;
        await dispatch(
          updateExam({ ...editingExam, ...payload, id: examId } as Exam & {
            id: string;
          }),
        ).unwrap();
        showToast(t("exams.update_success"));
      } else {
        await dispatch(createExam(payload as Parameters<typeof createExam>[0])).unwrap();
        showToast(t("exams.add_success"));
      }
      onFinish();
      setForm(emptyForm);
    } catch {
      showToast(t("exams.save_error"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm space-y-6">
      <h1 className="font-serif font-light text-text-primary">
        {editingExam ? t("exams.form_edit_title") : t("exams.form_add_title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            label={t("exams.form_name")}
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-xs text-danger">{errors.name}</p>
          )}
        </div>
        <Input
          label={t("exams.clinic")}
          name="clinic"
          value={form.clinic}
          onChange={handleChange}
        />
        <Input
          label={t("exams.doctor")}
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
        />
        <Input
          label={t("exams.speciality")}
          name="speciality"
          value={form.speciality}
          onChange={handleChange}
        />

        <div className="space-y-1">
          <Input
            type="date"
            label={t("exams.last_visit")}
            name="lastDate"
            value={form.lastDate}
            onChange={handleChange}
          />
        </div>

        {/* Specialist-recommended frequency */}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted">
            {t("exams.form_recommended_frequency")}
          </span>
          <select
            name="recommendedFrequencyMonths"
            value={form.recommendedFrequencyMonths}
            onChange={handleFrequencyChange}
            className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark py-3 px-4 text-text-primary dark:text-text-darkPrimary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary hover:border-primary/50 transition-colors duration-200 [color-scheme:light] dark:[color-scheme:dark]"
          >
            <option value="">{t("exams.form_freq_none")}</option>
            {FREQUENCY_OPTIONS.map((months) => (
              <option key={months} value={String(months)}>
                {t(`exams.form_freq_${months}m`)}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1">
          <Input
            type="date"
            label={t("exams.form_next_visit")}
            name="nextDate"
            value={form.nextDate}
            onChange={handleChange}
          />
          {nextSuggestion && !form.nextDate && (
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, nextDate: nextSuggestion }));
                setNextSuggestion(null);
              }}
              className="text-[11px] text-primary hover:underline"
            >
              {t("exams.form_next_suggestion", { date: nextSuggestion })}
            </button>
          )}
        </div>

        <Textarea
          label={t("exams.form_result_text")}
          name="result"
          value={form.result}
          onChange={handleChange}
        />

        {/* Numeric result */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Input
            label={t("exams.form_result_value")}
            name="resultValue"
            type="number"
            value={form.resultValue}
            onChange={handleChange}
            placeholder={t("exams.form_result_value_placeholder")}
          />
          <Input
            label={t("exams.form_result_unit")}
            name="resultUnit"
            value={form.resultUnit}
            onChange={handleChange}
            placeholder={t("exams.form_result_unit_placeholder")}
          />
        </div>

        <Textarea
          label={t("exams.treatment")}
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
        />
        <Textarea
          label={t("exams.notes")}
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />

        <FileUploadField
          label={t("exams.form_documents")}
          value={form.documents}
          onChange={(docs) => setForm((prev) => ({ ...prev, documents: docs }))}
        />

        <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:col-span-2">
          <Button variant="secondary" onClick={onFinish} disabled={submitting} fullWidth>
            {t("exams.form_cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} fullWidth>
            {submitting
              ? t("exams.form_submitting")
              : editingExam
                ? t("exams.form_update_btn")
                : t("exams.form_add_btn")}
          </Button>
        </div>
      </div>
    </section>
  );
}
