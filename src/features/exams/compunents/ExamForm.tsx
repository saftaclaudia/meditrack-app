import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import type { Exam } from "../../../types/exam";
import { v4 as uuid } from "uuid";

import { addExam, updateExam } from "../examsSlice";
import { Button } from "../../../components/ui/Button";

import { examToFormData } from "../utils/examMappers";
import type { ExamFormData } from "../../../types/examForm";
import { Input, Textarea } from "../../../components/ui/FormFields";

interface ExamFormProps {
  editingExam: Exam | null; // Exam ->Edit mode  null ->Add mode
  onFinish: () => void;
}

const emptyForm = {
  name: "",
  clinic: "",
  doctor: "",
  speciality: "",
  nextDate: "",
  lastDate: "",
  result: "",
  treatment: "",
  notes: "",
};

export function ExamForm({ editingExam, onFinish }: ExamFormProps) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<ExamFormData>(() =>
    editingExam ? examToFormData(editingExam) : emptyForm,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value })); //comuted property
  };

  const handleSubmit = () => {
    if (editingExam) {
      dispatch(updateExam({ ...editingExam, ...form }));
    } else {
      dispatch(addExam({ id: uuid(), ...form }));
    }

    onFinish();
    setForm(emptyForm);
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 border border-pink-200 dark:border-gray-700 p-4 md:p-6 shadow-sm space-y-6">
      <h1 className="text-lg font-semibold text-pink-600 dark:text-pink-300">
        {editingExam ? "Edit medical exam" : "Add new medical exam"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Exam name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="Clinic"
          name="clinic"
          value={form.clinic}
          onChange={handleChange}
        />
        <Input
          label="Doctor"
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
        />
        <Input
          label="Speciality"
          name="speciality"
          value={form.speciality}
          onChange={handleChange}
        />
        <Input
          type="date"
          label="Last visit"
          name="lastDate"
          value={form.lastDate}
          onChange={handleChange}
        />
        <Input
          type="date"
          label="Next visit"
          name="nextDate"
          value={form.nextDate}
          onChange={handleChange}
        />
        <Textarea
          label="Treatment"
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
        />
        <Textarea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
        {/* ACTIONS */}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:col-span-2">
          <Button variant="secondary" onClick={onFinish} fullWidth>
            Cancel
          </Button>
          <Button onClick={handleSubmit} fullWidth>
            {editingExam ? "Update exam" : "Add Exam"}
          </Button>
        </div>
      </div>
    </section>
  );
}
