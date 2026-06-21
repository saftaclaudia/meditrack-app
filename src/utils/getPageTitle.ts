export default function getPageTitle(pathname: string): string | undefined {
  if (pathname === "/") return "nav.page_home";
  if (pathname.startsWith("/exams/new")) return "nav.page_add_exam";
  if (pathname.startsWith("/exams")) return "nav.page_exams";
  if (pathname.startsWith("/calories")) return "nav.page_nutrition";
  if (pathname.startsWith("/settings")) return "nav.page_settings";
  if (pathname.startsWith("/profile")) return "nav.page_profile";
}
