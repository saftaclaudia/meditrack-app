export default function getPageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/exams")) return "Medical Exams";
  if (pathname.startsWith("/exams/new")) return "Add Exam";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/profile")) return "Health Profile";
}
