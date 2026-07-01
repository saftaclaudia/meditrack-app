import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchExams } from "../examsThunks";
import { selectExamsItems } from "../examsSelectors";
import { DocIcon, DownloadIcon, EyeIcon } from "../components/ExamIcons";
import { viewPdf, downloadPdf } from "../../../utils/documentActions";
import type { ExamWithMongoId } from "../../../types/exam";

interface DossierEntry {
  docId: string;
  name: string;
  file: string;
  uploadedAt: string;
  examName: string;
}

export function DossierPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const exams = useAppSelector(selectExamsItems);
  const loading = useAppSelector((state) => state.exams.loading);

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const documents = useMemo<DossierEntry[]>(() => {
    const entries: DossierEntry[] = [];
    for (const exam of exams) {
      const examId = (exam as ExamWithMongoId)._id ?? exam.id;
      for (const doc of exam.documents ?? []) {
        entries.push({
          docId: doc.id ?? doc._id ?? `${examId}-${doc.name}`,
          name: doc.name,
          file: doc.file,
          uploadedAt: doc.uploadedAt,
          examName: exam.name,
        });
      }
    }
    return entries.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  }, [exams]);

  if (loading) {
    return (
      <p className="text-center mt-10 font-light tracking-wide text-text-muted dark:text-text-darkMuted">
        {t("exams.loading")}
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Top bar */}
      <div>
        <button
          onClick={() => navigate("/exams")}
          className="flex items-center gap-1.5 text-sm text-text-muted dark:text-text-darkMuted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          {t("dossier.back")}
        </button>
      </div>

      {/* Header */}
      <div>
        <p className="text-xs font-light tracking-widest uppercase text-text-muted dark:text-text-darkMuted mb-1">
          {t("dossier.subtitle")}
        </p>
        <h1 className="font-serif font-light text-3xl text-primary">
          {t("dossier.title")}
        </h1>
      </div>

      {/* Content */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-cardLight dark:bg-surface-cardDark px-5 py-12 flex flex-col items-center gap-3 text-center">
          <FolderOpen
            size={32}
            className="text-text-muted dark:text-text-darkMuted opacity-40"
          />
          <p className="text-sm font-light text-text-muted dark:text-text-darkMuted">
            {t("dossier.empty")}
          </p>
          <p className="text-xs font-light text-text-muted dark:text-text-darkMuted opacity-70">
            {t("dossier.empty_hint")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <div
              key={doc.docId}
              className="flex items-center justify-between bg-surface-cardLight dark:bg-surface-cardDark px-4 py-3 rounded-2xl border border-border-light dark:border-border-dark"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <DocIcon />
                <div className="min-w-0">
                  <p className="text-xs font-light text-text-body dark:text-text-bodyDark truncate max-w-[160px]">
                    {doc.name}
                  </p>
                  <p className="text-xs font-light text-text-muted dark:text-text-darkMuted mt-0.5">
                    {doc.examName} · {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => viewPdf(doc.file)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-background-light text-xs font-light hover:bg-primary-hover transition-colors"
                >
                  <EyeIcon />
                  <span>{t("dossier.view")}</span>
                </button>
                <button
                  onClick={() => downloadPdf(doc.file, doc.name)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border-light dark:border-border-dark text-primary text-xs font-light hover:bg-soft-light transition-colors"
                >
                  <DownloadIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
