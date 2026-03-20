export interface RecommendedExam {
  id: string;
  name: string;
  frequencyMonths: number;
  description: string;
  specialist: string;
}

export const RECOMMENDED_EXAMS: RecommendedExam[] = [
  {
    id: "mammography",
    name: "Mammography",
    frequencyMonths: 12,
    description: "Early detection of breast cancer",
    specialist: "Radiologist",
  },
  {
    id: "bone-density",
    name: "Bone Density Scan",
    frequencyMonths: 24,
    description: "Osteoporosis screening",
    specialist: "Rheumatologist",
  },
  {
    id: "blood-work",
    name: "Complete Blood Work",
    frequencyMonths: 6,
    description: "Full blood panel including iron, vitamins and hormones",
    specialist: "General Practitioner",
  },
  {
    id: "abdominal-ultrasound",
    name: "Abdominal Ultrasound",
    frequencyMonths: 12,
    description: "Liver, kidneys and abdominal organs check",
    specialist: "Internal Medicine",
  },
  {
    id: "gynecology",
    name: "Gynecological Exam",
    frequencyMonths: 12,
    description: "Pap smear and pelvic examination",
    specialist: "Gynecologist",
  },
  {
    id: "blood-pressure",
    name: "Blood Pressure",
    frequencyMonths: 6,
    description: "Cardiovascular risk monitoring",
    specialist: "General Practitioner",
  },
  {
    id: "blood-sugar",
    name: "Blood Sugar",
    frequencyMonths: 6,
    description: "Diabetes and insulin resistance screening",
    specialist: "General Practitioner",
  },
  {
    id: "cholesterol",
    name: "Cholesterol Panel",
    frequencyMonths: 12,
    description: "LDL, HDL and triglycerides",
    specialist: "General Practitioner",
  },
  {
    id: "ophthalmology",
    name: "Eye Examination",
    frequencyMonths: 12,
    description: "Vision and eye pressure check",
    specialist: "Ophthalmologist",
  },
  {
    id: "dermatology",
    name: "Skin Check",
    frequencyMonths: 12,
    description: "Mole and skin cancer screening",
    specialist: "Dermatologist",
  },
  {
    id: "thyroid",
    name: "Thyroid Panel",
    frequencyMonths: 12,
    description: "TSH, T3, T4 hormone levels",
    specialist: "Endocrinologist",
  },
  {
    id: "colonoscopy",
    name: "Colonoscopy",
    frequencyMonths: 60,
    description: "Colorectal cancer screening — every 5 years after 45",
    specialist: "Gastroenterologist",
  },
];
