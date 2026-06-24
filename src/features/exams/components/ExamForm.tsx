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
  treatment: "",
  notes: "",
  documents: [],
};

export function ExamForm({ editingExam, onFinish, prefill }: ExamFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [form, setForm] = useState<ExamFormData>(() =>
    editingExam
      ? {
          ...examToFormData(editingExam),
          documents: editingExam.documents ?? [],
        }
      : {
          ...emptyForm,
          name: prefill?.name ?? "",
          speciality: prefill?.speciality ?? "",
        },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (editingExam) {
      const examId = (editingExam as ExamWithMongoId)._id ?? editingExam.id;
      await dispatch(updateExam({ ...editingExam, ...form, id: examId }));
    } else {
      await dispatch(createExam(form));
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
        <Input
          label={t("exams.form_name")}
          name="name"
          value={form.name}
          onChange={handleChange}
        />
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
        <Input
          type="date"
          label={t("exams.last_visit")}
          name="lastDate"
          value={form.lastDate}
          onChange={handleChange}
        />
        <Input
          type="date"
          label={t("exams.form_next_visit")}
          name="nextDate"
          value={form.nextDate}
          onChange={handleChange}
        />
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

        {/* ACTIONS */}
        <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:col-span-2">
          <Button variant="secondary" onClick={onFinish} fullWidth>
            {t("exams.form_cancel")}
          </Button>
          <Button onClick={handleSubmit} fullWidth>
            {editingExam ? t("exams.form_update_btn") : t("exams.form_add_btn")}
          </Button>
        </div>
      </div>
    </section>
  );
}
