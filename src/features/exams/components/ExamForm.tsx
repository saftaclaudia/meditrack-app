import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../app/hooks";
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

const emptyForm: ExamFormData = {
  name: "",
  clinic: "",
  doctor: "",
  speciality: "",
  nextDate: "",
  lastDate: "",
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

function suggestNextDate(name: string, lastDate: string): string {
  if (!lastDate) return "";
  const norm = normalizeName(name);
  const match = RECOMMENDED_EXAMS.find(
    (r) => normalizeName(r.name).includes(norm) || norm.includes(normalizeName(r.name))
  );
  if (!match) return "";
  const d = new Date(lastDate);
  d.setMonth(d.getMonth() + match.frequencyMonths);
  return d.toISOString().split("T")[0];
}

export function ExamForm({ editingExam, onFinish, prefill }: ExamFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [form, setForm] = useState<ExamFormData>(() =>
    editingExam
      ? { ...examToFormData(editingExam), documents: editingExam.documents ?? [],
          resultValue: editingExam.resultValue != null ? String(editingExam.resultValue) : "",
          resultUnit: editingExam.resultUnit ?? "" }
      : { ...emptyForm, name: prefill?.name ?? "", speciality: prefill?.speciality ?? "" }
  );

  const [nextSuggestion, setNextSuggestion] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-suggest nextDate when lastDate changes and nextDate is empty
      if (name === "lastDate" && value && !prev.nextDate) {
        const suggestion = suggestNextDate(prev.name, value);
        if (suggestion) setNextSuggestion(suggestion);
        else setNextSuggestion(null);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      resultValue: form.resultValue !== "" ? Number(form.resultValue) : undefined,
    };
    if (editingExam) {
      const examId = (editingExam as ExamWithMongoId)._id ?? editingExam.id;
      await dispatch(updateExam({ ...editingExam, ...payload, id: examId } as Exam & { id: string }));
    } else {
      await dispatch(createExam(payload as Parameters<typeof createExam>[0]));
    }
    onFinish();
    setForm(emptyForm);
  };

  return (
    <section className="rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm space-y-6">
      <h1 className="font-serif font-light text-text-primary">
        {editingExam ? t("exams.form_edit_title") : t("exams.form_add_title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t("exams.form_name")} name="name" value={form.name} onChange={handleChange} />
        <Input label={t("exams.clinic")} name="clinic" value={form.clinic} onChange={handleChange} />
        <Input label={t("exams.doctor")} name="doctor" value={form.doctor} onChange={handleChange} />
        <Input label={t("exams.speciality")} name="speciality" value={form.speciality} onChange={handleChange} />

        <div className="space-y-1">
          <Input type="date" label={t("exams.last_visit")} name="lastDate" value={form.lastDate} onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <Input type="date" label={t("exams.form_next_visit")} name="nextDate" value={form.nextDate} onChange={handleChange} />
          {nextSuggestion && !form.nextDate && (
            <button
              type="button"
              onClick={() => { setForm((p) => ({ ...p, nextDate: nextSuggestion })); setNextSuggestion(null); }}
              className="text-[11px] text-primary hover:underline"
            >
              {t("exams.form_next_suggestion", { date: nextSuggestion })}
            </button>
          )}
        </div>

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

        <Textarea label={t("exams.treatment")} name="treatment" value={form.treatment} onChange={handleChange} />
        <Textarea label={t("exams.notes")} name="notes" value={form.notes} onChange={handleChange} />

        <FileUploadField
          label={t("exams.form_documents")}
          value={form.documents}
          onChange={(docs) => setForm((prev) => ({ ...prev, documents: docs }))}
        />

        <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:col-span-2">
          <Button variant="secondary" onClick={onFinish} fullWidth>{t("exams.form_cancel")}</Button>
          <Button onClick={handleSubmit} fullWidth>
            {editingExam ? t("exams.form_update_btn") : t("exams.form_add_btn")}
          </Button>
        </div>
      </div>
    </section>
  );
}
