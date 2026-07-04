export interface RecommendedExam {
  id: string;
  name: string;        // English name for matching
  aliases: string[];   // Romanian + German variants for multilingual matching
  nameKey: string;
  descriptionKey: string;
  frequencyMonths: number;
  specialistKey: string;
}

export const RECOMMENDED_EXAMS: RecommendedExam[] = [
  {
    id: "mammography", name: "Mammography",
    aliases: ["Mamografie", "Mammographie"],
    nameKey: "exams.rec_mammography", descriptionKey: "exams.rec_mammography_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_radiologist",
  },
  {
    id: "bone-density", name: "Bone Density Scan",
    aliases: ["Densitometrie osoasa", "Densitometrie", "Knochendichtemessung"],
    nameKey: "exams.rec_bone_density", descriptionKey: "exams.rec_bone_density_desc",
    frequencyMonths: 24, specialistKey: "exams.spec_rheumatologist",
  },
  {
    id: "blood-work", name: "Blood Work",
    aliases: ["Analize de sange", "Analize sange", "Analize", "Blutbild", "Blutuntersuchung"],
    nameKey: "exams.rec_blood_work", descriptionKey: "exams.rec_blood_work_desc",
    frequencyMonths: 6, specialistKey: "exams.spec_gp",
  },
  {
    id: "abdominal-ultrasound", name: "Abdominal Ultrasound",
    aliases: ["Ecografie abdominala", "Ecografie", "Bauchultraschall", "Abdomenultraschall"],
    nameKey: "exams.rec_abdominal_us", descriptionKey: "exams.rec_abdominal_us_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_internal",
  },
  {
    id: "gynecology", name: "Gynecological Exam",
    aliases: ["Consultatie ginecologica", "Ginecologie", "Gynakologische Untersuchung", "Gynakologie"],
    nameKey: "exams.rec_gynecology", descriptionKey: "exams.rec_gynecology_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_gynecologist",
  },
  {
    id: "blood-pressure", name: "Blood Pressure",
    aliases: ["Tensiune arteriala", "Tensiune", "Blutdruck"],
    nameKey: "exams.rec_blood_pressure", descriptionKey: "exams.rec_blood_pressure_desc",
    frequencyMonths: 6, specialistKey: "exams.spec_gp",
  },
  {
    id: "blood-sugar", name: "Blood Sugar",
    aliases: ["Glicemie", "Zahar", "Blutzucker"],
    nameKey: "exams.rec_blood_sugar", descriptionKey: "exams.rec_blood_sugar_desc",
    frequencyMonths: 6, specialistKey: "exams.spec_gp",
  },
  {
    id: "cholesterol", name: "Cholesterol Panel",
    aliases: ["Profil lipidic", "Colesterol", "Cholesterin"],
    nameKey: "exams.rec_cholesterol", descriptionKey: "exams.rec_cholesterol_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_gp",
  },
  {
    id: "ophthalmology", name: "Eye Examination",
    aliases: ["Consultatie oftalmologica", "Oftalmologie", "Augenuntersuchung"],
    nameKey: "exams.rec_ophthalmology", descriptionKey: "exams.rec_ophthalmology_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_ophthalmologist",
  },
  {
    id: "dermatology", name: "Skin Check",
    aliases: ["Dermatoscopie", "Dermatologie", "Hautcheck", "Hautuntersuchung"],
    nameKey: "exams.rec_dermatology", descriptionKey: "exams.rec_dermatology_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_dermatologist",
  },
  {
    id: "thyroid", name: "Thyroid Panel",
    aliases: ["Panou tiroidian", "Tiroida", "Schilddrusenwerte", "Schilddruse"],
    nameKey: "exams.rec_thyroid", descriptionKey: "exams.rec_thyroid_desc",
    frequencyMonths: 12, specialistKey: "exams.spec_endocrinologist",
  },
  {
    id: "colonoscopy", name: "Colonoscopy",
    aliases: ["Colonoscopie", "Koloskopie"],
    nameKey: "exams.rec_colonoscopy", descriptionKey: "exams.rec_colonoscopy_desc",
    frequencyMonths: 60, specialistKey: "exams.spec_gastroenterologist",
  },
];
