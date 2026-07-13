import { Link } from "react-router-dom";

export default function ThaiLessonsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6" data-testid="thai-lessons-page">
      <nav className="mb-6 text-sm">
        <Link className="text-blue-700 hover:underline" to="/languages">
          Back to languages
        </Link>
      </nav>

      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Thai</p>
        <h1 className="text-2xl font-bold text-slate-950">Thai-English lessons</h1>
        <p className="mt-2 text-sm text-slate-700">
          English study explanations for Thai-speaking learners, from A1 to C2.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">Production static lesson pack</h2>
        <p className="mt-2 text-sm text-slate-700">
          The Thai lesson pack is also published as a static landing page for production crawlers and search indexing.
        </p>
        <a className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline" href="/thai-english/">
          Open Thai-English static lessons
        </a>
      </section>
    </main>
  );
}
